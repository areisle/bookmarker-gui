import { Edit } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { Bookmarks, useRemoveBookmark, useUpdateBookmark } from '../../queries';
import { BookmarkEditor } from './BookmarkEditor';

interface BookmarkEditorDialogButtonProps {
    bookmark: Bookmarks['bookmarks'][number];
    onSuccess?: () => void;
}

function BookmarkEditorDialogButton(props: BookmarkEditorDialogButtonProps) {
    const { bookmark, onSuccess } = props;
    const [open, setOpen] = useState(false);

    const {
        mutate: removeBookmark,
        error: errorRemoving,
        isLoading: isRemoving
    } = useRemoveBookmark({
        onSuccess: () => {
            setOpen(false);
            onSuccess?.()
        }
    });

    const {
        mutate: updateBookmark,
        error: errorUpdating,
        isLoading: isUpdating
    } = useUpdateBookmark({
        onSuccess: () => {
            setOpen(false);
            onSuccess?.()
        }
    });

    return (
        <>
            <IconButton
                onClick={() => setOpen(true)}
            >
                <Edit />
            </IconButton>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogContent>
                    <BookmarkEditor
                        bookmark={bookmark}
                        onUpdate={updateBookmark}
                        onDelete={removeBookmark}
                        error={errorRemoving || errorUpdating}
                        isDeleting={isRemoving}
                        isProcessing={isUpdating}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export { BookmarkEditorDialogButton };
