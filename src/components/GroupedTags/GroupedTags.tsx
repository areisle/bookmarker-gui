import { AutocompleteGetTagProps, ChipProps } from '@mui/material';
import React, { useMemo } from 'react';
import { FlippableTag } from '../FlippableTag';

interface Tag {
    id?: number;
    name: string;
    hide?: boolean;
    createdByCurrentUser?: boolean;
}

const useGroupedTags = (value: Tag[] | undefined) => useMemo(() => {
    const indexByName: Record<string, number> = {};

    value?.forEach((tag, i) => {
        if (indexByName[tag.name] === undefined) {
            indexByName[tag.name] = i;
        } else if (tag.createdByCurrentUser) {
            indexByName[tag.name] = i;
        }
    });

    return value?.map((tag, i) => indexByName[tag.name] === i ? tag : ({ ...tag, hide: true, flipped: !tag.createdByCurrentUser })) ?? []
}, [value]);

interface GroupedTagsProps {
    tags: Tag[];
    onAdd: (tagName: string) => void;
    onDelete?: (tagName: string) => void;
    getTagProps?: (props: { index: number }) => Partial<ReturnType<AutocompleteGetTagProps>>;
}


/**
 * @todo this needs to group all tags by name and only show one
 * @param props
 * @todo if user clicks tags that's not there's it should add it
 * @returns
 */
function GroupedTags(props: GroupedTagsProps) {
    const { tags, onAdd, getTagProps, onDelete } = props;

    return (
        <>
            {tags.map((tag, index) => {
                if (tag.hide) {
                    return null;
                }

                return (
                    <FlippableTag
                        key={tag.name}
                        onDelete={onDelete ? () => onDelete(tag.name) : undefined}
                        {...getTagProps?.({ index })}
                        name={tag.name}
                        onFlip={onAdd}
                        createdByCurrentUser={tag.createdByCurrentUser}
                    />
                )
            })}
        </>
    )
}

export { GroupedTags, useGroupedTags };
export type { GroupedTagsProps };
