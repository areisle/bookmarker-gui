import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { AliasesEditor, AliasesEditorProps } from './AliasesEditor';

export default {
    component: AliasesEditor,
    title: 'components/AliasesEditor'
} as Meta;

export const Empty: Story<AliasesEditorProps> = {}
export const WithValues: Story<AliasesEditorProps> = {
    args: {
        aliases: [
            { url: 'https://url-one.com/page/content/here' },
            { url: 'https://url-two.com/page-thing-something-2' },
        ]
    }
}
