import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { ConfirmButton, ConfirmButtonProps } from './ConfirmButton';

export default {
    component: ConfirmButton,
    title: 'components/ConfirmButton'
} as Meta;

export const Example: Story<ConfirmButtonProps> = {
    args: {
        children: 'Button text',
        confirmText: 'Confirm button action?'
    }
}
