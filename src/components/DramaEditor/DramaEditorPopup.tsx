import { Edit } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton, Button } from '@mui/material';
import React, { useState } from 'react';
import { Drama, useAddDrama, useRemoveDrama, useUpdateDrama } from '../../queries';
import { DramaEditor } from './DramaEditor';

interface DramaEditorDialogButtonProps {
    drama?: React.ComponentProps<typeof DramaEditor>['drama'];
    onSuccess?: () => void;
}

function DramaEditorDialogButton(props: DramaEditorDialogButtonProps) {
    const { drama, onSuccess } = props;
    const [open, setOpen] = useState(false);

    const isNew = !drama?.id;

    const {
        mutate: removeDrama,
        error: errorRemoving,
        isLoading: isRemoving
    } = useRemoveDrama({
        onSuccess: () => {
            setOpen(false);
            onSuccess?.()
        }
    });

    const {
        mutate: updateDrama,
        error: errorUpdating,
        isLoading: isUpdating
    } = useUpdateDrama({
        onSuccess: () => {
            setOpen(false);
            onSuccess?.()
        }
    });

    const {
        mutate: addDrama,
        error: errorAdding,
        isLoading: isAdding
    } = useAddDrama({
        onSuccess: () => {
            setOpen(false);
            onSuccess?.()
        }
    });

    return (
        <>
            {isNew ? (
                <Button
                    onClick={() => setOpen(true)}
                >
                    Add Drama
                </Button>
            ) : (
                <IconButton
                    onClick={() => setOpen(true)}
                >
                    <Edit />
                </IconButton>
            )}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogContent>
                    {drama && (
                        <DramaEditor
                            drama={drama}
                            onUpdate={updateDrama}
                            onDelete={removeDrama}
                            onAdd={addDrama}
                            error={errorRemoving || errorUpdating || errorAdding}
                            isDeleting={isRemoving}
                            isProcessing={isUpdating || isAdding}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export { DramaEditorDialogButton };
