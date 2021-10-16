import { Table, TableHead, TableRow, TableBody, TableCell, Typography, Box, Button, Skeleton } from '@mui/material';
import React, { ReactNode } from 'react';
import { useQueryClient } from 'react-query';
import { useLeaveCategory, useUsers } from '../../queries';
import { AddUser } from './AddUser';
import { EditUser } from './EditUser';

interface CategoryUsersProps {
    id: number;
}

function CategoryUsers(props: CategoryUsersProps) {
    const { id } = props;
    const { data: users, error, isLoading } = useUsers(
        { categoryId: id },
        { select: (response) => response.users, keepPreviousData: true }
    )

    const queryClient = useQueryClient();

    const { mutate: leaveCategory } = useLeaveCategory({
        onSuccess: () => {
            queryClient.invalidateQueries('categories')
        }
    });

    let content: ReactNode;
    if (error) {
        content = (
            <TableRow>
                <TableCell colSpan={3}>
                    <Typography color='error'>Unable to load users. {error.message}</Typography>
                </TableCell>
            </TableRow>
        )
    } else if (isLoading) {
        content = (users ?? [{ id: 0 }]).map((user) => (
            <TableRow key={user.id}>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell></TableCell>
            </TableRow>
        ))
    } else if (!users?.length) {
        content = (
            <TableRow>
                <TableCell colSpan={3}>
                    <Typography>No users to show.</Typography>
                </TableCell>
            </TableRow>
        )
    } else {
        content = users?.map((user) => (
            <TableRow key={user.id}>
                <TableCell>{user.user.email}</TableCell>
                <TableCell>{user.active ? 'active' : 'invited'}</TableCell>
                <TableCell>{user.admin ? 'admin' : ''}</TableCell>
                <TableCell padding='none'><EditUser categoryId={id} id={user.id} /></TableCell>
            </TableRow>
        ))
    }

    return (
        <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>email</TableCell>
                        <TableCell>active</TableCell>
                        <TableCell>admin</TableCell>
                        <TableCell>edit</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {content}
                </TableBody>
            </Table>
            <Box p={1} sx={{ display: 'flex', gap: 1 }}>
                <AddUser categoryId={id} />
                {/* TODO add confirm */}
                <Button
                    onClick={() => leaveCategory({ id })}
                    color='error'
                >
                    {users?.length === 1 ? 'Delete' : 'Leave'} Category
                </Button>
            </Box>
        </div>
    );
}

export { CategoryUsers };
export type { CategoryUsersProps };
