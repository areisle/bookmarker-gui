import { Add } from '@mui/icons-material';
import { TextField, Autocomplete, CircularProgress, Chip, ChipProps } from '@mui/material';
import React, { useState } from 'react';
import { GroupedTag, useFetchTags } from '../../queries';


interface TagsEditorProps {
    disabled?: boolean;
    value: GroupedTag[] | undefined;
    onChange: (next: GroupedTag[]) => void;
}

const defaultTags: GroupedTag[] = [];

/**
 * should allow user to add tags to include as well as
 * tags to exclude.
 * if they start typing a tag and start it with -, that should be ignored in matching
 * but indicate that when they match a tag to exclude not include it
 */
function TagsEditor(props: TagsEditorProps) {
    const { value, onChange, disabled } = props;

    const [inputText, setInputText] = useState('');

    const { data: tags, isLoading: isLoadingOptions, error } = useFetchTags(
        undefined,
        {
            keepPreviousData: true,
            select: (response) => response.tags.map((tag) => ({ ...tag, current: true, count: 1 } as GroupedTag)),
        }
    )

    const handleUpdateTags = (tagName: string | undefined, op: 'add' | 'remove') => {
        if (!value || !tagName) return;
        const tagIndex = value.findIndex((tag) => tag.name === tagName);
        let tag = value[tagIndex];

        if (op === 'remove') {
            if (!tag || !tag.current) return;
            if (tag.count === 1) {
                onChange([...value.slice(0, tagIndex), ...value.slice(tagIndex + 1)]);
                return;
            }
            tag = { ...tag };
            tag.count -= 1;
            tag.current = false;
        } else {
            if (tag && tag.current) return;
            if (!tag) {
                onChange([...value, { name: tagName, current: true, count: 1 }]);
                return;
            }
            tag = { ...tag };
            tag.current = true;
            tag.count += 1;
        }


        const next = [
            ...value.slice(0, tagIndex),
            tag,
            ...value.slice(tagIndex + 1)
        ];
        onChange(next);
    }

    return (
        <Autocomplete
            disabled={disabled}
            disablePortal
            autoComplete
            disableClearable={true}
            filterSelectedOptions={true}
            onInputChange={(_, nextInputText) => {
                setInputText(nextInputText.toLowerCase())
            }}
            onChange={(_, next, reason, details) => {
                const opt = details?.option;
                if (reason === 'removeOption') {
                    handleUpdateTags(opt?.name, 'remove');
                    return;
                } else if (reason === 'createOption') {
                    handleUpdateTags(opt as unknown as string, 'add');
                } else if (reason === 'selectOption') {
                    handleUpdateTags(opt?.name, 'add');
                }
            }}
            inputValue={inputText}
            autoHighlight
            loading={isLoadingOptions}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
            options={tags ?? defaultTags}
            fullWidth={true}
            multiple={true}
            freeSolo={true}
            value={value ?? defaultTags}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={Boolean(error)}
                    helperText={error ? error.message : ''}
                    label="Add tags"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {isLoadingOptions ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    sx={{
                        '& .MuiAutocomplete-input': {
                            textTransform: 'lowercase',
                        }
                    }}
                />
            )}
            renderTags={(values, getTagProps) => (
                values.map((tag, index) => {
                    const label = tag.count > 1 ? `${tag.name} (${tag.count})` : tag.name;
                    const tagProps = getTagProps?.({ index }) as ChipProps;
                    if (tag.current) {
                        return (
                            <Chip
                                {...tagProps}
                                label={label}
                                variant='filled'
                            />
                        )
                    }

                    return (
                        <Chip
                            {...tagProps}
                            onClick={() => handleUpdateTags(tag.name, 'add')}
                            onDelete={() => handleUpdateTags(tag.name, 'add')}
                            deleteIcon={<Add />}
                            label={label}
                            variant='outlined'
                        />
                    );
                })
            )}
        />
    )
}

export { TagsEditor };
export type { TagsEditorProps };
