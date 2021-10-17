import { Typography, Stack } from '@mui/material';
import React, { ReactNode } from 'react';
import { useQueryClient } from 'react-query';
import { useLeaveCategory, useUsers, useGetCategory } from '../../queries';
import { ConfirmButton } from '../ConfirmButton';
import { EditableTable } from '../EditableTable';
import { AddUser } from './AddUser';
import { EditUser } from './EditUser';


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

    return (
        <Stack spacing={1.5} alignItems='start'>
            <Typography variant='h3'>Users</Typography>
            <EditableTable
                rows={category?.users}
                columns={[
                    { field: 'email', Renderer: ({ row }) => <>{row.user.email}</> },
                    { field: 'active', Renderer: ({ row }) => <>{row.active ? 'active' : 'invited'}</> },
                    { field: 'admin', Renderer: ({ row }) => <>{row.active ? 'admin' : ''}</> },
                ]}
                isLoading={isLoading}
                isEditable={true}
                editor={({ row, open, onClose }) => (
                    <EditUser
                        id={row?.id}
                        open={open}
                        onClose={onClose}
                        categoryId={id}
                    />
                )}
            />
            <AddUser categoryId={id} />
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
