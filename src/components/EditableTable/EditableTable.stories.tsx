import React from 'react';
import { Meta, Story } from '@storybook/react/dist/ts3.9/client/preview/types-7-0';
import { EditableTable, EditableTableProps } from './EditableTable';

export default {
    component: EditableTable,
    title: 'components/EditableTable'
} as Meta;

export const Empty: Story<EditableTableProps> = {
    args: {
        columns: [
            { field: 'firstName', label: 'First Name' },
            { field: 'lastName', label: 'Last Name' },
            { field: 'email', label: 'Email' },
        ]
    }
}

export const Loading: Story<EditableTableProps> = {
    args: {
        ...Empty.args,
        isLoading: true
    }
}

export const WithData: Story<EditableTableProps> = {
    args: {
        ...Empty.args,
        rows: [
            { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'asmith@something.ca' },
            { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bsmith@something.ca' }
        ]
    }
}

export const WithRenderer: Story<EditableTableProps> = {
    args: {
        columns: [
            { field: 'firstName', label: 'First Name' },
            { field: 'lastName', label: 'Last Name' },
            { field: 'email', label: 'Email', Renderer: ({ field, row }) => <a href={`mailto:${row[field]}`}>{row[field] as string}</a> },
        ],
        rows: [
            { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'asmith@something.ca' },
            { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bsmith@something.ca' }
        ]
    }
}

export const Editable: Story<EditableTableProps> = {
    args: {
        ...WithRenderer.args,
        isEditable: true,
    }
}
