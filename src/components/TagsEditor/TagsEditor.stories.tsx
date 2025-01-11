import React from 'react';
import { Meta, Story } from '@storybook/react/types-7-0';
import { TagsEditor, TagsEditorProps } from './TagsEditor';

export default {
    component: TagsEditor,
    title: 'components/TagsEditor',
    parameters: {
        viewport: {
            defaultViewport: 'popup'
        }
    }
} as Meta;

export const NoTags: Story<TagsEditorProps> = {
    args: {
        value: [],
    }
}

export const TagsByCurrentUser: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', current: true, count: 1 },
            { name: 'funny', current: true, count: 1 }
        ],
    }
}

export const TagsByOtherUser: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', current: false, count: 1 },
            { name: 'funny', current: false, count: 1 }
        ],
    }
}

export const TagsByMultipleUsers: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', current: true, count: 2 },
            { name: 'funny', current: false, count: 1 }
        ],
    }
}

export const ManyTagsByMultipleUsers: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', current: true, count: 2 },
            { name: 'funny', current: true, count: 2 },
        ],
    }
}
