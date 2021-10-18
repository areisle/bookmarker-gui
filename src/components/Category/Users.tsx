import { Typography } from '@mui/material';
import React from 'react';
import { useQueryClient } from 'react-query';
import { GetCategory, useAddUsers, useRemoveUser } from '../../queries';
import { BooleanEditor, EditableTable } from '../EditableTable';
import { ColumnDef } from '../EditableTable/EditableTable';


interface UsersProps {
    categoryId: number;
    users: NonNullable<GetCategory['category']>['users'] | undefined;
    isLoading: boolean;
    isAdmin: boolean;
}

type User = NonNullable<GetCategory['category']>['users'][number];

const columns: ColumnDef<User>[] = [
    { field: 'email', valueGetter: (row) => row.user?.email, isEditable: (row) => !row.id },
    { field: 'active', Renderer: ({ value }) => <>{value ? 'active' : 'invited'}</> },
    { field: 'admin', Renderer: ({ value }) => <>{value ? 'admin' : ''}</>, Editor: BooleanEditor, isEditable: (row) => Boolean(row.id) },
];


function Users(props: UsersProps) {
    const { users, isLoading, categoryId, isAdmin } = props;

    const queryClient = useQueryClient();

    const { mutate: addUsers, isLoading: isAdding, error: errorAdding } = useAddUsers({
        onSuccess: () => {
            queryClient.invalidateQueries('getCategory');
        }
    });

    const { mutate: deleteUser, isLoading: isDeleting, error: errorDeleting } = useRemoveUser({
        onSuccess: () => {
            queryClient.invalidateQueries('getCategory');
        }
    });

    return (
        <>
            <Typography variant='h3'>Users</Typography>
            {errorAdding && (
                <Typography color='error'>{errorAdding.message}</Typography>
            )}
            {errorDeleting && (
                <Typography color='error'>{errorDeleting.message}</Typography>
            )}
            <EditableTable
                rows={users}
                columns={columns}
                isLoading={isLoading}
                // TODO
                isEditable={false}
                isDeletable={isAdmin}
                addButtonLabel='Invite User'
                isCreatable={isAdmin}
                onAdd={(user) => {
                    const email = user.user?.email;
                    if (email) {
                        addUsers({ categoryId, emails: [email] })
                    }
                }}
                isDeleting={isDeleting}
                onDelete={(user) => deleteUser({ categoryId, id: user.id })}
                isSaving={isAdding}
            />
        </>
    );
}

export { Users };
export type { UsersProps };
