import { Chip } from '@mui/material';
import { Box } from '@mui/system';
import React, { useMemo } from 'react';

interface TagsProps {
    tags: {
        id: number;
        name: string;
        createdByCurrentUser: boolean;
    }[];
    onDelete: (tagName: string) => void;
    onAdd: (tagName: string) => void;

}

/**
 * @todo this needs to group all tags by name and only show one
 * @param props
 * @todo if user clicks tags that's not there's it should add it
 * @returns
 */
function Tags(props: TagsProps) {
    const { tags, onDelete, onAdd } = props;

    const groupedTags = useMemo(() => {
        const tagsByCurrentUser = new Set();
        tags.forEach((tag) => {
            if (tag.createdByCurrentUser) {
                tagsByCurrentUser.add(tag.name)
            }
        })

        const next = tags.filter((tag) => {
            if (!tagsByCurrentUser.has(tag.name) || tag.createdByCurrentUser) {
                return true
            }
        })
        return next;
    }, [tags]);

    return (
        <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {groupedTags.map((tag) => {
                if (tag.createdByCurrentUser) {
                    return (
                        <Chip
                            label={tag.name}
                            key={tag.id}
                            color='primary'
                            onDelete={() => onDelete(tag.name)}
                            size='small'
                        />
                    )
                }

                return (
                    <Chip
                        label={tag.name}
                        key={tag.id}
                        clickable={true}
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={() => onAdd(tag.name)}
                    />
                )
            })}
        </Box>
    )
}

export { Tags };
