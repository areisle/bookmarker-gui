import { Edit } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useRemoveUser } from '../../queries';

interface EditUserProps {
    categoryId: number;
    id: number;
}

function EditUser(props: EditUserProps) {
    const { categoryId, id } = props;
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [emails, setEmails] = useState<string[]>([]);

    const { mutate, isLoading, error } = useRemoveUser({
        onSuccess: () => {
            queryClient.invalidateQueries('users');
            setOpen(false)
        }
    });

    const handleDeleteUser = () => {
        mutate({
            categoryId,
            id,
        })

    }

    return (
        <span>
            <IconButton
                onClick={() => setOpen(true)}
            >
                <Edit />
            </IconButton>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {/* TODO allow swapping admin or not? */}
                    <span>Editing not yet Implemented</span>
                </DialogContent>
                <DialogActions>
                    {/* <Button
                        // onClick={handleAddUsers}
                        disabled={isLoading}
                    >
                        Update User
                    </Button> */}
                    {error && <Typography color='error'>Error deleting user. {error.message}</Typography>}
                    <Button
                        onClick={handleDeleteUser}
                        disabled={isLoading}
                        color='error'
                    >
                        Delete User
                    </Button>
                </DialogActions>
            </Dialog>
        </span>
    );
}

export { EditUser };
