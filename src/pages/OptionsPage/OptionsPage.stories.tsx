import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { OptionsPage } from './OptionsPage';

export default {
    component: OptionsPage,
    title: 'pages/OptionsPage',
} as Meta;

export const AsStandardUser: Story = {
    parameters: {
        user: {
            email: 'example@domain.ca',
            id: 1,
        }
    },
}
export const AsAdminUser: Story = {
    parameters: {
        user: {
            email: 'example@domain.ca',
            id: 1,
            admin: true
        }
    }
}
