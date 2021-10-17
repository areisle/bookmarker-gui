import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { BookmarksForUrl, useBookmarksForUrl } from '../../queries';
import { getCurrentTab } from '../../queries/chrome';

type Bookmark = BookmarksForUrl['bookmarksForUrl'][number];


const useBookmark = (categoryId: number | null, setCategoryId: (categoryId: number) => void) => {
    const { data: tab } = useQuery('current-tab', getCurrentTab);

    const { data: bookmarks, isLoading, error, refetch } = useBookmarksForUrl(
        { url: tab?.url! },
        {
            enabled: Boolean(tab?.url),
            select: (response) => response.bookmarksForUrl,

            onSuccess: (data: BookmarksForUrl['bookmarksForUrl']) => {
                // if there is a bookmarked category but it's not the
                // currently selected one, update it to one that has a bookmark
                if (data.length && categoryId && !data.some((b) => b.category.id === categoryId)) {
                    setCategoryId(data[0].category.id)
                }
            }
        }
    );

    const bookmark = useMemo(() => {
        const next: Partial<Bookmark> = {
            url: tab?.url!,
            title: tab?.title!,
            category: categoryId ? { id: categoryId } : undefined,
        }

        if (isLoading || !bookmarks?.length) {
            return next;
        }

        return bookmarks.find((b) => b.category.id === categoryId) ?? next;
    }, [bookmarks, isLoading, categoryId]);

    const bookmarkedCategories = useMemo(() => {
        return bookmarks?.map((b) => b.category.id);
    }, [bookmarks]);

    return {
        bookmark: bookmark,
        bookmarkedCategories,
        isLoading: isLoading,
        error: error,
        refetch,
    }
}


export { useBookmark };
