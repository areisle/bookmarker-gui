import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { useTags } from '../../queries';
import { FlippableTag } from '../FlippableTag';

interface Tag {
    name: string;
    createdByCurrentUser: number;
    index?: number;
    total: number;
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
    const { categoryId, value, onChange, disabled } = props;

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
            select: (response) => response.tags.map((tag) => ({ ...tag, createdByCurrentUser: 1, total: 1 })),
            enabled: Boolean(categoryId),
        }
    )

    const handleAddExistingTag = (tagName: string) => {
        if (!value) { return; }
        const tagIndex = value.findIndex((tag) => tag.name === tagName);
        const next = [
            ...value.slice(0, tagIndex),
            {
                ...value[tagIndex],
                createdByCurrentUser: 1,
                total: value[tagIndex].total + 1,
            },
            ...value.slice(tagIndex + 1)
        ];
        onChange(next);
    }

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
                    const newTag: Tag = {
                        name: (details.option as unknown as string).toLowerCase(),
                        createdByCurrentUser: 1,
                        total: 1
                    }

                    onChange([...value ?? [], newTag]);
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
                    return (
                        <FlippableTag
                            {...getTagProps?.({ index })}
                            name={tag.name}
                            onFlip={handleAddExistingTag}
                            createdByCurrentUser={tag.createdByCurrentUser}
                            isEditable={!disabled}
                        />
                    )
                })
            )}
        />
    )
}

export { TagsEditor };
export type { TagsEditorProps };
