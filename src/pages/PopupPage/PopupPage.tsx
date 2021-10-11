import { Box, Typography } from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import { CategorySelect } from '../../components';
import { useBookmarksForUrl } from '../../queries';
import { getCurrentTab } from '../../queries/chrome';
import { useDefaultCategory } from './useDefaultCategory';

interface PopupPageProps {
    /** url of page user is on when in extension */
    // url: string;
}

/**
 * allow user to add/edit/delete bookmark for active page
 *
 * if multiple bookmarks are returned for url what should it do?
 * probably look at whatever category was last selected,
 * or show a select for category
 * @param props
 * @returns
 */
function PopupPage(props: PopupPageProps) {
    const { data: tab } = useQuery('current-tab', getCurrentTab);

    const { data: bookmarks, isLoading, error } = useBookmarksForUrl(
        { url: tab?.url! },
        { enabled: Boolean(tab?.url), select: (response) => response.bookmarksForUrl }
    );

    const {
        data: categoryId,
        update: updateCategoryId,
    } = useDefaultCategory(bookmarks);

    console.log(categoryId, bookmarks)

    if (isLoading) {
        return <Typography>loading bookmarks for url...</Typography>
    }

    if (error) {
        return <Typography color='error'>Unable to load bookmarks for url. {error.message}</Typography>
    }

    return (
        <Box sx={{ minWidth: '300px', minHeight: '200px' }}>
            {/* category select */}
            <CategorySelect
                value={categoryId}
                onChange={updateCategoryId}
            />

            {bookmarks?.length ? (
                <Typography>bookmarked</Typography>
            ) : (
                <Typography>no bookmarks to show</Typography>
            )}
        </Box>
    );
}

export { PopupPage };
export type { PopupPageProps };
