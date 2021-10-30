import { Box } from '@mui/system';
import React from 'react';
import { FlippableTag } from '../FlippableTag';

interface TagsProps {
    tags: {
        name: string;
        createdByCurrentUser: number;
        total: number;
    }[];
    onDelete: (tagName: string) => void;
    onAdd: (tagName: string) => void;
    isEditable: boolean;

}

/**
 * @todo this needs to group all tags by name and only show one
 * @param props
 * @todo if user clicks tags that's not there's it should add it
 * @returns
 */
function Tags(props: TagsProps) {
    const { tags, onDelete, onAdd, isEditable } = props;

    return (
        <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {tags.map((tag) => {
                return (
                    <FlippableTag
                        key={tag.name}
                        onDelete={onDelete ? () => onDelete(tag.name) : undefined}
                        name={tag.name}
                        onFlip={onAdd}
                        createdByCurrentUser={tag.createdByCurrentUser}
                        isEditable={isEditable}
                        count={tag.total}
                    />
                )
            })}
        </Box>
    )
}

export { Tags };
