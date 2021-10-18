import { Typography, Stack } from '@mui/material';
import React from 'react';
import { useQueryClient } from 'react-query';
import { GetCategory } from '../../queries';
import { EditableTable } from '../EditableTable';


interface PatternAliasesProps {
    categoryId: number;
    rules: NonNullable<GetCategory['category']>['rules'] | undefined;
    isLoading: boolean;
    isAdmin?: boolean;
}

function PatternAliases(props: PatternAliasesProps) {
    const { categoryId, rules, isLoading, isAdmin } = props;

    const queryClient = useQueryClient();

    return (
        <Stack spacing={1}>
            <Typography variant='h3'>Rules for default url aliases</Typography>
            <EditableTable
                rows={rules}
                columns={[
                    { field: 'origin', isEditable: true },
                    { field: 'match', isEditable: true },
                    { field: 'canonical', isEditable: true },
                ]}
                isLoading={isLoading}
                isDeletable={isAdmin}
                isCreatable={isAdmin}
                isEditable={isAdmin}
                addButtonLabel='Add new pattern'
            />
        </Stack>
    );
}

export { PatternAliases };
export type { PatternAliasesProps };
