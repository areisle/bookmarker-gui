import { Stack } from '@mui/material';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useLeaveCategory, GetCategory } from '../../queries';
import { ConfirmButton } from '../ConfirmButton';
import { PatternAliases } from './PatternAliases';
import { Users } from './Users';


interface CategorySettingsProps {
    id: number;
    category: GetCategory['category'];
    isLoading: boolean;
}

function CategorySettings(props: CategorySettingsProps) {
    const { id, category, isLoading } = props;

    const queryClient = useQueryClient();

    const { mutate: leaveCategory } = useLeaveCategory({
        onSuccess: () => {
            queryClient.invalidateQueries('categories')
        }
    });

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
