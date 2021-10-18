import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { RelativeDate, RelativeDateProps } from './RelativeDate';

export default {
    component: RelativeDate,
    title: 'components/RelativeDate'
} as Meta;

export const New: Story<RelativeDateProps> = {
    args: {
        children: new Date().toISOString()
    }
}

export const Recent: Story<RelativeDateProps> = {
    args: {
        children: new Date(new Date().getFullYear(), new Date().getMonth() - 1).toISOString()
    }
}

export const Old: Story<RelativeDateProps> = {
    args: {
        children: new Date(2019, 3, 5).toISOString()
    }
}
