import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { action } from '@storybook/addon-actions';
import { GroupedTags, GroupedTagsProps } from './GroupedTags';

export default {
    component: GroupedTags,
    title: 'components/GroupedTags',
} as Meta;

export const OnlyByCurrentUser: Story<GroupedTagsProps> = {
    args: {
        tags: [
            { name: 'tag name', createdByCurrentUser: true },
            { name: 'tag name 2', createdByCurrentUser: true },
            { name: 'tag name 3', createdByCurrentUser: true },
        ]
    }
}

export const OnlyByOtherUser: Story<GroupedTagsProps> = {
    args: {
        tags: [
            { name: 'tag name', createdByCurrentUser: false },
            { name: 'tag name 2', createdByCurrentUser: false },
            { name: 'tag name 3', createdByCurrentUser: false },
        ]
    }
}

export const ByMultipleUsers: Story<GroupedTagsProps> = {
    args: {
        tags: [
            { name: 'tag name', createdByCurrentUser: false, hide: true },
            { name: 'tag name', createdByCurrentUser: false },
            { name: 'tag name 2', createdByCurrentUser: true },
            { name: 'tag name 2', createdByCurrentUser: false, hide: true },
            { name: 'tag name 3', createdByCurrentUser: false },
        ]
    }
}

export const ByMultipleUsersWithDelete: Story<GroupedTagsProps> = {
    args: {
        tags: [
            { name: 'tag name', createdByCurrentUser: false, hide: true },
            { name: 'tag name', createdByCurrentUser: false },
            { name: 'tag name 2', createdByCurrentUser: true },
            { name: 'tag name 2', createdByCurrentUser: false, hide: true },
            { name: 'tag name 3', createdByCurrentUser: false },
        ],
        getTagProps: () => ({ onDelete: action('onDelete') })
    }
}
