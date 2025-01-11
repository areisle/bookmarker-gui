import React from 'react';
import { Meta, Story } from '@storybook/react/types-7-0';
import { DramaEditor } from './DramaEditor';

export default {
    component: DramaEditor,
    parameters: {
        viewport: {
            defaultViewport: 'popup'
        }
    },
    title: 'components/DramaEditor',
} as Meta;

type Props = React.ComponentProps<typeof DramaEditor>;

export const NewDrama: Story<Props> = {
    args: {
        drama: {
            links: [{ url: 'https://test.com/some-page-link' }],
            title: 'Some page title'
        },
    }
}

export const LoadingDrama: Story<Props> = {
    args: {
        drama: {
        },
        isLoading: true,
    }
}

export const ExistingDrama: Story<Props> = {
    args: {
        drama: {
            links: [{ url: 'https://test.com/some-page-link' }],
            title: 'Some page title',
            id: 1
        },
        isLoading: false,
    }
}

export const ExistingDramaWithTags: Story<Props> = {
    args: {
        drama: {
            links: [{ url: 'https://test.com/some-page-link' }],
            title: 'Some page title',
            id: 1,
            groupedTags: [
                { name: 'tag 1', current: true, count: 1 },
                { name: 'tag 2', current: false, count: 1 },
            ]
        },
        isLoading: false,
    }
}

export const UpdatingDramaInProgress: Story<Props> = {
    args: {
        drama: {
            links: [{ url: 'https://test.com/some-page-link' }],
            title: 'Some page title',
            id: 1
        },
        isLoading: false,
        isProcessing: true,
    }
}

export const AddingDramaInProgress: Story<Props> = {
    args: {
        drama: {
            links: [{ url: 'https://test.com/some-page-link' }],
            title: 'Some page title',
        },
        isLoading: false,
        isProcessing: true,
    }
}

export const RemovingDramaInProgress: Story<Props> = {
    args: {
        drama: {
            links: [{ url: 'https://test.com/some-page-link' }],
            title: 'Some page title',
            id: 1
        },
        isLoading: false,
        isProcessing: false,
        isDeleting: true,
    }
}
