import { Button, ButtonProps, Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';

interface ConfirmButtonProps extends ButtonProps {
    confirmText: string;
    icon?: boolean;
}

function ConfirmButton(props: ConfirmButtonProps) {
    const { confirmText, children, onClick, icon, ...rest } = props;
    const [open, setOpen] = useState(false);

    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        setOpen(false);
    }

    const ButtonComponent: typeof Button = icon ? IconButton : Button

    return (
        <>
            <ButtonComponent
                {...rest}
                onClick={() => setOpen(true)}
            >
                {children}
            </ButtonComponent>
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
