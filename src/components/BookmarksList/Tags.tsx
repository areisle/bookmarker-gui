import { Box } from '@mui/system';
import React from 'react';
import { GroupedTags, useGroupedTags } from '../GroupedTags';

interface TagsProps {
    tags: {
        name: string;
        createdByCurrentUser: boolean;
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

    const groupedTags = useGroupedTags(tags);

    return (
        <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <GroupedTags
                onAdd={onAdd}
                onDelete={onDelete}
                tags={groupedTags}
                isEditable={isEditable}
            />
        </Box>
    )
}

export { Tags };
