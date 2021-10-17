import { Button, ButtonProps, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import React, { useState } from 'react';

interface ConfirmButtonProps extends ButtonProps {
    confirmText: string;
}

function ConfirmButton(props: ConfirmButtonProps) {
    const { confirmText, children, onClick, ...rest } = props;
    const [open, setOpen] = useState(false);

    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        setOpen(false);
    }

    return (
        <>
            <Button
                {...rest}
                onClick={() => setOpen(true)}
            >
                {children}
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent><Typography>{confirmText}</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export { ConfirmButton };
export type { ConfirmButtonProps };
