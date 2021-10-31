import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
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

const categoryId = 3;

export const NoTags: Story<TagsEditorProps> = {
    args: {
        value: [],
        categoryId
    }
}

export const TagsByCurrentUser: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', createdByCurrentUser: 1, total: 1 },
            { name: 'funny', createdByCurrentUser: 1, total: 1 }
        ],
        categoryId
    }
}

export const TagsByOtherUser: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', createdByCurrentUser: 0, total: 1 },
            { name: 'funny', createdByCurrentUser: 0, total: 1 }
        ],
        categoryId
    }
}

export const TagsByMultipleUsers: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', createdByCurrentUser: 1, total: 2 },
            { name: 'funny', createdByCurrentUser: 0, total: 1 }
        ],
        categoryId
    }
}

export const ManyTagsByMultipleUsers: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', createdByCurrentUser: 1, total: 2 },
            { name: 'funny', createdByCurrentUser: 1, total: 2 },
        ],
        categoryId
    }
}
