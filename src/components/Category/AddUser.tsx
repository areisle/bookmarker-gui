import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useAddUsers } from '../../queries';

interface AddUserProps {
    categoryId: number;
}

function AddUser(props: AddUserProps) {
    const { categoryId } = props;
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [emails, setEmails] = useState<string[]>([]);

    const { mutate, isLoading } = useAddUsers({
        onSuccess: () => {
            queryClient.invalidateQueries('users');
            setOpen(false)
        }
    });

    const handleAddUsers = () => {
        mutate({
            categoryId,
            emails,
        })

    }

    return (
        <span>
            <Button onClick={() => setOpen(true)}>Invite User</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Users To Category</DialogTitle>
                <DialogContent>
                    <Box p={1}>
                        <Autocomplete
                            freeSolo={true}
                            options={[] as string[]}
                            multiple={true}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Email Addresses"
                                />
                            )}
                            disabled={isLoading}
                            sx={{ width: 300 }}
                            onChange={(e, nextValue) => setEmails(nextValue)}
                            value={emails}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAddUsers}
                        disabled={isLoading}
                    >
                        Add Users
                    </Button>
                </DialogActions>
            </Dialog>
        </span>
    );
}

export { AddUser };
