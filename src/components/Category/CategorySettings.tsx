import { Typography, Stack } from '@mui/material';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useLeaveCategory, useGetCategory } from '../../queries';
import { ConfirmButton } from '../ConfirmButton';
import { PatternAliases } from './PatternAliases';
import { Users } from './Users';


interface CategorySettingsProps {
    id: number;
}

function CategorySettings(props: CategorySettingsProps) {
    const { id } = props;

    const queryClient = useQueryClient();

    const { mutate: leaveCategory } = useLeaveCategory({
        onSuccess: () => {
            queryClient.invalidateQueries('categories')
        }
    });

    const {
        data: category,
        isLoading,
        error,
    } = useGetCategory({ id }, { select: (response) => response.category })

    if (error) {
        return <Typography color='error'>Unable to load category. {error.message}</Typography>
    }

    const isOnlyUser = category?.users?.length === 1;
    const isAdmin = Boolean(category?.isAdmin);

    return (
        <Stack spacing={2} alignItems='start'>
            <Users
                users={category?.users}
                isLoading={isLoading}
                categoryId={id}
                isAdmin={isAdmin}
            />
            <PatternAliases
                categoryId={id}
                rules={category?.rules}
                isLoading={isLoading}
                isAdmin={isAdmin}
            />
            <ConfirmButton
                confirmText={`Confirm ${isOnlyUser ? 'delete' : 'leave'} category?`}
                onClick={() => leaveCategory({ id })}
                color='error'
            >
                {isOnlyUser ? 'Delete' : 'Leave'} Category
            </ConfirmButton>
        </Stack>
    );
}

export { CategorySettings };
export type { CategorySettingsProps };
