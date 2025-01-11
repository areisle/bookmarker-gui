import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { PopupPage } from './PopupPage';

export default {
    component: PopupPage,
    title: 'pages/PopupPage',
    parameters: {
        viewport: {
            defaultViewport: 'popup'
        }
    }
} as Meta;

export const WithoutBookmark: Story = {
    parameters: {
        pageMeta: {
            title: 'Recipe Dessert Thing',
            url: 'https://some-random-link.com/recipe-dessert-thing'
        }
    }
}

export const WithBookmark: Story = {
    parameters: {
        pageMeta: {
            title: 'Maids Revenge',
            url: 'https://dramanice.ac/drama/maids-revenge-2022-detail'
        }
    }
}
