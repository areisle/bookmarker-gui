import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { useTags } from '../../queries';
import { GroupedTags, useGroupedTags } from '../GroupedTags';

interface Tag {
    name: string;
    createdByCurrentUser: boolean;
    index?: number;
    hide?: boolean;
}

interface TagsEditorProps {
    categoryId: number | undefined | null;
    disabled?: boolean;
    value: Tag[] | undefined;
    onChange: (next: Tag[]) => void;
}

const defaultTags: Tag[] = [];

/**
 * should allow user to add tags to include as well as
 * tags to exclude.
 * if they start typing a tag and start it with -, that should be ignored in matching
 * but indicate that when they match a tag to exclude not include it
 */
function TagsEditor(props: TagsEditorProps) {
    const { categoryId, value: ungroupedValue, onChange } = props;

    const groupedValue = useGroupedTags(ungroupedValue);

    const [inputText, setInputText] = useState('');

    const { data: tags, isLoading: isLoadingOptions, error } = useTags(
        {
            categoryId: categoryId!,
            tagsWhere: {
                name: {
                    contains: inputText
                }
            }
        },
        {
            keepPreviousData: true,
            select: (response) => response.tags.map((tag) => ({ ...tag, createdByCurrentUser: true })),
            enabled: Boolean(categoryId),
        }
    )

    return (
        <Autocomplete
            disablePortal
            autoComplete
            disableClearable={true}
            filterSelectedOptions={true}
            onInputChange={(_, nextInputText) => {
                setInputText(nextInputText.toLowerCase())
            }}
            onChange={(_, next, reason, details) => {
                if (reason === 'removeOption' && !details?.option.createdByCurrentUser) {
                    // cannot be deleted
                    return;
                }

                if (reason === 'createOption' && details?.option) {
                    onChange([...ungroupedValue ?? [], { name: (details.option as unknown as string).toLowerCase(), createdByCurrentUser: true }]);
                    return;
                }
                onChange(next as Tag[]);
            }}
            inputValue={inputText}
            autoHighlight
            loading={isLoadingOptions}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={tags ?? defaultTags}
            fullWidth={true}
            multiple={true}
            freeSolo={true}
            value={ungroupedValue ?? defaultTags}
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
            renderTags={(values_, getTagProps) => (
                // cannot use values_ or ui doesn't update on click
                <GroupedTags
                    tags={groupedValue}
                    onAdd={(name) => onChange([...ungroupedValue ?? [], { name, createdByCurrentUser: true }])}
                    getTagProps={getTagProps}
                />
            )}
        />
    )
}

export { TagsEditor };
export type { TagsEditorProps };
