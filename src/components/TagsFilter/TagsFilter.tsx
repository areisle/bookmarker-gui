import { Chip, TextField, Autocomplete, CircularProgress, FilterOptionsState, Box } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import React, { useState } from 'react';
import { useTags } from '../../queries';

interface Tag {
    name: string;
    exclude?: boolean;
}

function filterOptions(options: Tag[], state: FilterOptionsState<Tag>) {
    const { inputValue } = state;
    const exclude = inputValue.startsWith('-');
    return options.map(({ name }) => ({ name, exclude }));
}

interface TagsFilterProps {
    categoryId: number;
    value: Tag[];
    onChange: (nextTags: Tag[]) => void;
}

/**
 * should allow user to add tags to include as well as
 * tags to exclude.
 * if they start typing a tag and start it with -, that should be ignored in matching
 * but indicate that when they match a tag to exclude not include it
 */
function TagsFilter(props: TagsFilterProps) {
    const { categoryId, value, onChange } = props;

    const [inputText, setInputText] = useState('');

    const { data, isLoading: loading } = useTags({
        categoryId,
        tagsWhere: {
            name: {
                contains: inputText.startsWith('-') ? inputText.slice(1) : inputText
            }
        }
    }, { keepPreviousData: true })

    return (
        <Box sx={{ marginTop: '10px' }}>
            <Autocomplete
                disablePortal
                autoComplete
                onInputChange={(event, newInputValue) => {
                    setInputText(newInputValue);
                }}
                onChange={(e, nextTags) => onChange(nextTags)}
                value={value}
                filterOptions={filterOptions}
                filterSelectedOptions={true}
                autoHighlight
                loading={loading}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={data?.tags ?? []}
                fullWidth={true}
                multiple={true}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Filter by tags"
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
                )}
                renderTags={(values, getTagProps) =>
                    values.map(({ name, exclude }, index) => {
                        return (
                            <Chip
                                label={name}
                                {...getTagProps({ index })}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = values.map((tag) => tag.name === name ? ({ name, exclude: !exclude }) : tag);
                                    onChange(next);
                                }}
                                clickable={true}
                                icon={exclude ? <Remove /> : <Add />}
                            />
                        )
                    })
                }
            />
        </Box>
    )
}

export { TagsFilter };
export type { TagsFilterProps };
