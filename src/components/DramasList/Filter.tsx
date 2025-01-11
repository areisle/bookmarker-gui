import { TextField, Autocomplete, CircularProgress, Box, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import { FetchUsers, useFetchTags, useFetchUsers, User } from '../../queries';
import { storage } from '../../queries/storage';

function matchesBasicFilter(text: string) {
    const matches = text.match(/(?<filterType>tag|status|title|watched|country|episodeCount|episodeDuration|finishedAiringAt)\s*(\[\s*(?<userId>\d+)\s*\])?\s*(?<op>[\!\=\~\<\>])\s*(?<values>([a-zA-Z0-9\s\-\/\?]*,)*)\s*(?<search>[a-zA-Z0-9\s\-\/\?]*)$/);

    return matches as ({ groups: { filterType: string; op: string; values: string | null; search: string | null; userId: string | null } } & RegExpMatchArray) | null;
}

function parseBasicFilterText(text: string) {
    const matches = matchesBasicFilter(text);
    if (!matches) return undefined;
    let values: unknown[] = ((matches.groups.values ?? '') + (matches.groups.search ?? '')).trim().split(/\s*,\s*/).filter(Boolean);
    const userId = matches.groups.userId ? Number(matches.groups.userId) : undefined;
    const userCondition = matches.groups.userId ? { createdById: Number(matches.groups.userId) } : {};

    const { filterType, op } = matches.groups;

    if (['episodeCount', 'episodeDuration'].includes(filterType)) {
        values = values.map(Number);
    } else if (['finishedAiringAt', 'startedAiringAt'].includes(filterType) && op != '~') {
        values = values.map((v) => v + 'T00:00:00Z')
    }
    // if (!values.length) { return filterText; }
    if (filterType === 'tag' || filterType == 'watched') {
        let filterProperty = 'watched';
        let filterSubProperty = 'status';

        if (filterType === 'tag') {
            filterProperty = 'tags';
            filterSubProperty = 'name'
        }

        if (!values.length) {
            return
        }
        if (op === '=') {
            return {
                [filterProperty]: {
                    some: {
                        [filterSubProperty]: {
                            in: values
                        },
                        ...userCondition,
                    }
                }
            }
        }
        if (op === '!') {
            let filterOr: any[] = [
                {
                    [filterSubProperty]: {
                        not: {
                            in: values
                        }
                    },
                },
            ]
            if (filterSubProperty === 'status') {
                filterOr.push({ [filterSubProperty]: { equals: null } })
            }
            if (userId) {
                filterOr.push({ createdById: { not: userId } })
            }
            return {
                [filterProperty]: {
                    every: {
                        OR: filterOr
                    }
                }
            }
        }
    }
    if (['title', 'status', 'country', 'episodeCount', 'episodeDuration', 'finishedAiringAt'].includes(filterType)) {
        if (op === '=') {
            return {
                [filterType]: {
                    in: values
                }
            }
        }
        if (op === '!') {
            return {
                OR: [
                    {
                        [filterType]: {
                            not: {
                                in: values
                            }
                        }
                    },
                    { [filterType]: { equals: null } }
                ]
            }
        }
        if (op === '~') {
            return {
                [filterType]: {
                    contains: values.join('')
                }
            }
        }
        if (op === '>') {
            return {
                [filterType]: {
                    gt: values[0]
                }
            }
        }
        if (op === '<') {
            return {
                [filterType]: {
                    lt: values[0]
                }
            }
        }
    }

    throw new Error(`unmatched filter ${text}`)
}

/**
 *
 * @param text string
 */
function textToFilter(text: string) {
    text = text.trim();
    if (!text) return undefined;

    let openingCount = text.split('(').length - 1;
    let closingCount = text.split(')').length - 1;
    if (openingCount - closingCount > 0) {
        text = text + ')'.repeat(openingCount - closingCount)
    } else if (closingCount - openingCount > 0) {
        text = '('.repeat(closingCount - openingCount) + text
    }
    text = `(${text})`;

    interface Pair {
        open: number;
        close?: number;
        text: string;
        // text without variables in it
        fullText: string;
        children: Required<Pair>[];
    }

    let flatPairs: Pair[] = [];
    const toMatch = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '(') {
            flatPairs.push({ open: i, children: [], text: '', fullText: '' });
            toMatch.push(flatPairs.length - 1)
        } else if (char === ')') {
            const current = toMatch.pop();
            if (current === undefined) {
                throw new Error('Unmatched number of opening and closing brackets.')
            }
            const pair = flatPairs[current];
            pair.close = i;
            pair.text = text.substring(pair.open, i + 1).replace(/[\(\)]/g, '');
            pair.fullText = pair.text;
            pair.children.forEach((child, i) => {
                pair.text = pair.text.replace(child.fullText, `$${i}`);
            });

            if (pair.text === pair.fullText && pair.children.length) {
                throw new Error('text unchanged');
            } else {
            }

            // now parse condition to see if need to to split on ops
            let segmentStartIndex = 0;
            let lastOp: string | undefined;
            for (let i = 0; i < pair.text.length; i++) {
                const char = pair.text[i];
                if (['&', '|'].includes(char)) {
                    if (lastOp === undefined) {
                        lastOp = char
                    } else {
                        if (lastOp !== char) {
                            const subtext = pair.text.substring(segmentStartIndex, i);
                            pair.children.push({
                                open: 0,
                                close: 0,
                                text: subtext,
                                fullText: subtext,
                                children: [],
                            })
                            pair.text = pair.text.replace(subtext, `$${pair.children.length - 1}`)

                            segmentStartIndex = i;
                            lastOp = char;
                        }
                    }
                }
            }

            if (flatPairs[current - 1] && flatPairs[current - 1].close === undefined) {
                if (pair.text.trim()) {
                    flatPairs[current - 1].children.push(pair as Required<Pair>);
                }
                flatPairs.splice(current, 1);
            }
        }
    }

    const remapForCondition = (pair: Pair): any => {
        const children = pair.children.map(remapForCondition);
        let conditions = [pair.text];
        let op = null;

        // instead need to split until different operator
        if (pair.text.includes('&')) {
            op = 'AND';
            conditions = pair.text.split('&');
        } else if (pair.text.includes('|')) {
            op = 'OR';
            conditions = pair.text.split('|');
        }

        const filters = conditions.map((condition) => {
            let cleaned = condition.trim().replace(/[\(\)]/g, '');
            if (cleaned.match(/^\$\d+$/)) {
                const index = Number(cleaned.substring(1));
                if (!children[index]) {
                    throw new Error(`missing child ${index} in ${JSON.stringify(children)} for ${pair.text}`)
                }
                return children[index];
            }
            cleaned = cleaned.split(/[^\!\~\=\<\>a-zA-Z0-9\?\-\/\s\?\,\]\[]/)[0];
            return parseBasicFilterText(cleaned);
        }).filter(Boolean);

        if (filters.length <= 1 || !op) {
            return filters[0]
        }
        return {
            [op]: filters
        }
    }

    if (flatPairs.length > 1) {
        throw new Error('too many segments?')
    }

    return remapForCondition(flatPairs[0]);
}

interface Option {
    value: string;
    label: string;
    pos: number;
}

/**
 * @todo deal with cases where cursor is part way through a word
 */
function filterTextToOptions(inputText: string, originalCursor: number, meta: { tags?: string[], users?: { id: number; email: string }[] }) {
    const options: Option[] = [];
    let cursor = originalCursor;
    let text = inputText.substring(0, cursor);
    let suffix = inputText.substring(cursor);

    let matches: RegExpMatchArray | null = null;

    matches = text.match(/[^\&\|](?<search>\s+)$/);
    if (!matches) {
        matches = text.match(/\)(?<search>\s*)$/);
    }
    if (suffix.match(/^\s*[\&\|]/)) {
        matches = null;
    }
    if (matches) {
        let search = matches.groups?.search ?? '';
        let prefix = text.substring(0, text.length - search.length);
        let pos = cursor;
        if (!prefix.endsWith(' ')) {
            prefix += ' ';
            pos += 1;
        }

        options.push(
            {
                label: '& (and)',
                value: prefix + '& ' + suffix,
                pos: pos + '& '.length - search.length,
            },
            {
                label: '| (or)',
                value: prefix + '| ' + suffix,
                pos: pos + '| '.length - search.length,
            }
        )
    }

    matches = text.match(/(^|\&|\|)(?<search>\s*[a-z]*)$/);
    if (matches) {
        let search = matches.groups?.search ?? '';
        const trimmedSearch = search.trim();
        const filterTypes = ['tag', 'status', 'title', 'watched', 'country', 'episodeCount', 'episodeDuration', 'finishedAiringAt'];
        if (!filterTypes.includes(trimmedSearch)) {
            let prefix = text.substring(0, text.length - search.length);
            let pos = cursor - search.length;

            if (prefix.length - search.length > 0) {
                pos += 1;
                prefix += ' ';
            }
            // suggest filter types
            filterTypes.forEach((value) => {
                if (value.includes(trimmedSearch)) {
                    options.push({
                        label: value,
                        value: prefix + value + suffix,
                        pos: pos + value.length,
                    })
                }
            });
        }
    }

    matches = text.match(/(?<filterType>tag|status|title|watched|country|episodeCount|episodeDuration|finishedAiringAt)(?<userId>\[\d+\])?\s*$/)
    if (matches) {
        // return operators
        const filterType = matches.groups!.filterType;
        const prefix = text.trim();
        const pos = cursor - text.length + prefix.length;
        const nameToLabel = {
            '=': '= (equals or in)',
            '!': '! (does not equals or is not in)',
            '~': '~ (contains)',
            '>': '> (greater than)',
            '<': '< (less than)'
        }

        let names: (keyof typeof nameToLabel)[] = ['=', '!', '~', '>', '<'];

        if (filterType === 'title') {
            names = ['~'];
        } else if (filterType === 'status' || filterType === 'tag' || filterType === 'country') {
            names = ['=', '!'];
        } else if (filterType === 'watched') {
            names = [];
            if (matches.groups!.userId) {
                names = ['=', '!'];
            }
        } else if (filterType === 'episodeCount' || filterType === 'episodeDuration' || filterType === 'finishedAiringAt') {
            names = ['=', '>', '<']
        }

        names.forEach((name) => {
            options.push({
                label: nameToLabel[name],
                value: prefix + name + suffix,
                pos: pos + name.length,
            })
        })
    }

    matches = text.match(/(?<filterType>tag|watched)(?<search>\s*(\[\s*\d*)?\s*)$/);

    if (matches) {
        const search = matches.groups!.search ?? '';
        let prefix = text.substring(0, text.length - search.length);

        const filterType = matches.groups!.filterType;

        for (const user of meta.users ?? []) {
            const value = `[${user.id}]`;
            options.push({
                label: `${filterType}${value} (filter on ${filterType} by ${user.email})`,
                value: prefix + value + suffix,
                pos: cursor + value.length - search.length,
            });
        }
    }

    // test for should use operator
    matches = matchesBasicFilter(text);
    if (matches) {
        const filterType = matches.groups!.filterType;
        const op = matches.groups!.op;
        let search = matches.groups?.search ?? '';
        const values = matches.groups?.values ?? '';

        let names: string[] = []
        if (filterType === 'tag') {
            names = meta.tags ?? [];
        } else if (filterType === 'status') {
            names = ['Completed', 'Completed - Missing Subs', 'Ongoing', 'Upcoming'];
        } else if (filterType === 'watched' && matches.groups!.userId) {
            names = ['yes', 'no', 'dropped']
        } else if (filterType === 'country') {
            names = ['China', 'South Korea', 'Japan', 'Taiwan', 'Thailand', 'Hong Kong', 'Philippines', 'Other']
        }

        const selected = values.split(',').map(v => v.trim()).filter(Boolean);

        let prefix = '';
        let pos = cursor;

        const matched = names.filter(name => name.includes(search));
        if (matched.length === 1 && matched[0] === search) {
            prefix = text.substring(0, text.length) + ',';
            pos += 1;
            search = '';
            selected.push(matched[0])
        } else {
            prefix = text.substring(0, text.length - search.length);
            pos -= search.length;
        }

        names.forEach((value) => {
            if (!selected.includes(value) && value.toLowerCase().includes(search.toLowerCase())) {
                options.push({
                    label: value,
                    value: prefix + value + suffix,
                    pos: pos + value.length,
                });
            }
        });
    }

    return options;
}


interface DramasFilterProps {
    value: string;
    onChange: (next: string) => void;
}

/**
 * should allow user to add tags to include as well as
 * tags to exclude.
 * if they start typing a tag and start it with -, that should be ignored in matching
 * but indicate that when they match a tag to exclude not include it
 */
function DramasFilter(props: DramasFilterProps) {
    const { value, onChange } = props;
    const ref = useRef<HTMLInputElement>(null);
    const [inputText, setInputText] = useState(value);
    const [cursor, setCursor] = useState(value.length);

    const [focused, setFocused] = useState(false);

    useEffect(() => {
        setInputText(value);
        setCursor(value.length);
    }, [value]);

    const { data: tags, isLoading: loading } = useFetchTags(
        undefined,
        {
            select: (response) => response.tags.map((tag) => tag.name)
        }
    );

    const { data: users } = useFetchUsers(
        undefined,
        {
            select: (response) => response.users
        }
    );

    const options = useMemo(() => {
        return filterTextToOptions(inputText, cursor, { tags, users })
    }, [inputText, tags, cursor, users]);

    return (
        <Box sx={{ marginTop: '10px', display: 'flex' }}>
            <Autocomplete
                disablePortal
                autoComplete
                onFocus={() => setFocused(true)}
                onBlur={() => { setFocused(false); }}
                onInputChange={(e, newInputValue, reason) => {
                    const position = ref.current?.selectionStart ?? newInputValue.length - 1;
                    if (reason !== 'reset') {
                        setCursor(position);
                        setInputText(newInputValue);
                    }
                }}
                freeSolo={true}
                onChange={(e, next) => {
                    if (next && typeof next !== 'string') {
                        setCursor(next.pos);
                        setTimeout(() => {
                            ref.current!.setSelectionRange(next.pos, next.pos);
                        }, 1);
                        setInputText(next.value);
                    }
                }}
                renderOption={(liProps, option) => (
                    <li {...liProps}>{option.label}</li>
                )}
                inputValue={inputText}
                filterOptions={(opts) => opts}
                filterSelectedOptions={false}
                autoHighlight
                loading={loading}
                isOptionEqualToValue={() => false}
                open={Boolean(focused && options.length)}
                value={inputText}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.value}
                options={options}
                fullWidth={true}
                multiple={false}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                            }}
                            label="Filter"
                            inputRef={ref}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )
                }}
            />
            <Button
                onClick={() => {
                    onChange(inputText);
                }}
            >
                Search
            </Button>
        </Box>
    )
}

function useStoredValue<T>(storageKey: string, initialValue: T) {
    const [value, setValue] = useState(initialValue);

    const { data: defaultValue, isLoading: isLoadingDefault } = useQuery(
        [storageKey],
        async () => {
            const next = await storage.get(storageKey);
            return next ? JSON.parse(next) : next;
        },
    );

    const handleSetValue = useCallback((next: T) => {
        setValue(next);
        storage.set(storageKey, JSON.stringify(next))
    }, [storageKey]);

    useLayoutEffect(() => {
        if (!isLoadingDefault) {
            setValue(defaultValue ?? '');
        }
    }, [defaultValue, isLoadingDefault]);

    return [value, handleSetValue] as [T, (next: T) => void];
}

const useStoredFilterText = () => {
    const [filters, setFilters] = useState('');

    const storageKey = `BOOKMARKER_EXT__TAG_FILTERS`;

    const { data: defaultFilters, isLoading: isLoadingDefault } = useQuery(
        [storageKey],
        async () => {
            return storage.get(storageKey);
        },
    );

    const handleSetTags = useCallback((next: string) => {
        setFilters(next);
        storage.set(storageKey, next)
    }, [storageKey]);

    useLayoutEffect(() => {
        if (!isLoadingDefault) {
            setFilters(defaultFilters ?? '');
        }
    }, [defaultFilters, isLoadingDefault]);

    return [filters, handleSetTags] as [string, (next: string) => void];
}

export { DramasFilter, textToFilter, useStoredFilterText, matchesBasicFilter, parseBasicFilterText, useStoredValue, filterTextToOptions };
