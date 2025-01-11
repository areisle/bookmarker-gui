import { TableCell, Typography, TableRow, Table, TableHead, TableBody, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAddUser, useRemoveUser, useFetchUsers, useDumpData } from '../queries';
import { RelativeDate } from './RelativeDate';


function Users() {

    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');

    const { data: users, isLoading } = useFetchUsers(undefined, {
        select: (response) => response.users
    });

    const { mutate: addUser, isLoading: isAdding, error: errorAdding } = useAddUser({
        onSuccess: () => {
            setNewUserEmail('');
            setOpen(false);
            queryClient.invalidateQueries(['fetchUsers']);
            queryClient.invalidateQueries(['fetchDramas']);
        }
    });

    const { mutate: deleteUser, isLoading: isDeleting, error: errorDeleting } = useRemoveUser({
        onSuccess: () => {
            queryClient.invalidateQueries(['fetchUsers']);
            queryClient.invalidateQueries(['fetchDramas']);
        }
    });

    const { refetch: dumpData } = useDumpData({}, {
        refetchOnWindowFocus: false,
        enabled: false
    })

    const dumpDataToConsole = async () => {
        const x = await dumpData();
        console.log(x.data?.dump)
    }

    return (
        <>
            <Typography variant='h3'>Users</Typography>
            {errorDeleting && (
                <Typography color='error'>{errorDeleting.message}</Typography>
            )}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>email</TableCell>
                        <TableCell>admin</TableCell>
                        <TableCell>added</TableCell>
                        <TableCell>added by</TableCell>
                        <TableCell>delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{String(user.admin)}</TableCell>
                            <TableCell>
                                <RelativeDate>{user.createdAt}</RelativeDate>
                            </TableCell>
                            <TableCell>{user.createdBy?.email}</TableCell>
                            <TableCell>
                                <Button
                                    color='error'
                                    disabled={isDeleting}
                                    onClick={() => deleteUser({ email: user.email })}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                onClick={() => setOpen(true)}
                disabled={isLoading}
            >
                Add User
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add User</DialogTitle>
                <DialogContent>
                    <Box p={1}>
                        <TextField
                            value={newUserEmail}
                            type='email'
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            label="Email Addresses"
                        />
                    </Box>
                    {errorAdding && (
                        <Typography color='error'>{errorAdding.message}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => addUser({ email: newUserEmail })}
                        disabled={isAdding}
                    >
                        Add User
                    </Button>
                </DialogActions>
            </Dialog>
            <Button onClick={dumpDataToConsole}>Dump data to console</Button>
        </>
    );
}

export { Users };
