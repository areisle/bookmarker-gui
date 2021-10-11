import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { BookmarksForUrl } from '../../queries';
import { storage } from '../../queries/storage';

const LAST_CATEGORY_KEY = 'BOOKMARKER_EXT__LAST_CATEGORY';

const useDefaultCategory = (bookmarks: BookmarksForUrl['bookmarksForUrl'] | undefined) => {
    const { data, refetch, isLoading } = useQuery(
        LAST_CATEGORY_KEY,
        () => storage.get(LAST_CATEGORY_KEY),
        { select: (response) => response ? Number(response) : undefined }
    )

    const handleSetCategoryId = async (id: number) => {
        await storage.set(LAST_CATEGORY_KEY, String(id));
        refetch();
    }

    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (bookmarks?.length && !bookmarks.some((bookmark) => bookmark.category.id === data)) {
            // select whatever first category is
            handleSetCategoryId(bookmarks[0].category.id)
        }
    }, [bookmarks, isLoading, data]);

    return {
        data: data ?? null,
        isLoading,
        update: handleSetCategoryId
    }
}


export { useDefaultCategory };
