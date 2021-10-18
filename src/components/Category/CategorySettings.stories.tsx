import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { CategorySettings, CategorySettingsProps } from './CategorySettings';

export default {
    component: CategorySettings,
    title: 'components/CategorySettings'
} as Meta;

export const Example: Story<CategorySettingsProps> = {
    args: {
        id: 1
    }
}
