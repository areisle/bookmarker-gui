import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { BookmarkEditor, BookmarkEditorProps } from './BookmarkEditor';

export default {
    component: BookmarkEditor,
    parameters: {
        viewport: {
            defaultViewport: 'popup'
        }
    },
    title: 'components/BookmarkEditor',
} as Meta;

export const NewBookmark: Story<BookmarkEditorProps> = {
    args: {
        bookmark: {
            category: { id: 1 },
            url: 'https://test.com/some-page-link',
            title: 'Some page title'
        },
    }
}

export const LoadingBookmark: Story<BookmarkEditorProps> = {
    args: {
        bookmark: {
            category: { id: 1 },
        },
        isLoading: true,
    }
}

export const ExistingBookmark: Story<BookmarkEditorProps> = {
    args: {
        bookmark: {
            category: { id: 1 },
            url: 'https://test.com/some-page-link',
            title: 'Some page title',
            id: 1
        },
        isLoading: false,
    }
}

export const ExistingBookmarkWithTags: Story<BookmarkEditorProps> = {
    args: {
        bookmark: {
            category: { id: 1 },
            url: 'https://test.com/some-page-link',
            title: 'Some page title',
            id: 1,
            tags: [
                { name: 'tag 1', createdByCurrentUser: true },
                { name: 'tag 2', createdByCurrentUser: false },
            ]
        },
        isLoading: false,
    }
}

export const UpdatingBookmarkInProgress: Story<BookmarkEditorProps> = {
    args: {
        bookmark: {
            category: { id: 1 },
            url: 'https://test.com/some-page-link',
            title: 'Some page title',
            id: 1
        },
        isLoading: false,
        isProcessing: true,
    }
}

export const AddingBookmarkInProgress: Story<BookmarkEditorProps> = {
    args: {
        bookmark: {
            category: { id: 1 },
            url: 'https://test.com/some-page-link',
            title: 'Some page title',
        },
        isLoading: false,
        isProcessing: true,
    }
}

export const RemovingBookmarkInProgress: Story<BookmarkEditorProps> = {
    args: {
        bookmark: {
            category: { id: 1 },
            url: 'https://test.com/some-page-link',
            title: 'Some page title',
            id: 1
        },
        isLoading: false,
        isProcessing: false,
        isDeleting: true,
    }
}
