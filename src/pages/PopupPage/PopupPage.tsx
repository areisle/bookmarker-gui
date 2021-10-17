import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { BookmarkEditor, CategorySelect } from '../../components';
import { useAddBookmark, useRemoveBookmark, useUpdateBookmark } from '../../queries';
import { useBookmark } from './useSelectedBookmark';
import { useSelectedCategory } from './useSelectedCategory';


/**
 * allow user to add/edit/delete bookmark for active page
 *
 * if multiple bookmarks are returned for url what should it do?
 * probably look at whatever category was last selected,
 * or show a select for category
 * @returns
 */
function PopupPage() {
    const { categoryId, setCategoryId } = useSelectedCategory();

    const {
        bookmark,
        isLoading: isLoadingBookmark,
        error: errorLoadingBookmark,
        refetch,
        bookmarkedCategories,
    } = useBookmark(categoryId, setCategoryId);

    const {
        mutate: addBookmark,
        error: errorAdding,
        isLoading: isAdding
    } = useAddBookmark({ onSuccess: () => refetch() });

    const {
        mutate: removeBookmark,
        error: errorRemoving,
        isLoading: isRemoving
    } = useRemoveBookmark({ onSuccess: () => refetch() });

    const {
        mutate: updateBookmark,
        error: errorUpdating,
        isLoading: isUpdating
    } = useUpdateBookmark({ onSuccess: () => refetch() });

    if (errorLoadingBookmark) {
        return (
            <Typography color='error'>
                Unable to load bookmarks for url. {errorLoadingBookmark.message}
            </Typography>
        )
    }

    return (
        <Box sx={{ minWidth: '300px', minHeight: '200px' }}>
            <Stack spacing={1.5}>
                <CategorySelect
                    value={categoryId}
                    onChange={(value) => setCategoryId(value)}
                    bookmarkedCategories={bookmarkedCategories}
                />
                <BookmarkEditor
                    bookmark={bookmark}
                    onAdd={addBookmark}
                    onDelete={removeBookmark}
                    onUpdate={updateBookmark}
                    error={errorAdding || errorRemoving || errorUpdating}
                    isDeleting={isRemoving}
                    isProcessing={isAdding || isUpdating}
                    isLoading={isLoadingBookmark}
                />
            </Stack>
        </Box>
    );
}

export { PopupPage };
