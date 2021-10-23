import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { FlippableTag, FlippableTagProps } from './FlippableTag';

export default {
    component: FlippableTag,
    title: 'components/FlippableTag',
} as Meta;

export const ReadOnly: Story<FlippableTagProps> = {
    args: {
        name: 'tag name',
        createdByCurrentUser: false,
        isEditable: false,
    },
}

export const Unflipped: Story<FlippableTagProps> = {
    args: {
        name: 'tag name',
        createdByCurrentUser: true,
        isEditable: true,
    },
}

export const Flipped: Story<FlippableTagProps> = {
    args: {
        name: 'tag name',
        createdByCurrentUser: false,
        isEditable: true,
    }
}

export const FlippedWithVariant: Story<FlippableTagProps> = {
    args: {
        name: 'tag name',
        createdByCurrentUser: false,
        variant: 'filled',
        isEditable: true,
    }
}
