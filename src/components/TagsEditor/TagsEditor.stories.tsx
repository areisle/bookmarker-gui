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

export const NoTags: Story<TagsEditorProps> = {
    args: {
        value: [],
        categoryId: 1
    }
}

export const TagsByCurrentUser: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', createdByCurrentUser: true },
            { name: 'funny', createdByCurrentUser: true }
        ],
        categoryId: 1
    }
}

export const TagsByOtherUser: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', createdByCurrentUser: false },
            { name: 'funny', createdByCurrentUser: false }
        ],
        categoryId: 1
    }
}

export const TagsByMultipleUsers: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', createdByCurrentUser: false },
            { name: 'historical', createdByCurrentUser: true },
            { name: 'funny', createdByCurrentUser: false }
        ],
        categoryId: 1
    }
}

export const ManyTagsByMultipleUsers: Story<TagsEditorProps> = {
    args: {
        value: [
            { name: 'historical', createdByCurrentUser: false },
            { name: 'historical', createdByCurrentUser: true },
            { name: 'funny', createdByCurrentUser: true },
            { name: 'funny', createdByCurrentUser: false }
        ],
        categoryId: 1
    }
}
