import React, { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useCategories } from '../../queries';
import { storage } from '../../queries/storage';

const LAST_CATEGORY_KEY = 'BOOKMARKER_EXT__LAST_CATEGORY';

const useSelectedCategory = () => {
    const [selectedCategoryId, setCategoryId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    const { data: defaultCategoryId, refetch, isLoading: isLoadingDefault } = useQuery(
        LAST_CATEGORY_KEY,
        async () => {
            const lastString = await storage.get(LAST_CATEGORY_KEY);
            const last = lastString ? Number(lastString) : null;
            return last;
        },
    )

    const {
        data: categories,
        isLoading: isLoadingCategories,
        error,
    } = useCategories(
        {},
        {
            select: (response) => response.categories,
            onSuccess: () => queryClient.invalidateQueries(LAST_CATEGORY_KEY)
        }
    )

    const handleSetCategoryId = useCallback(async (id: number | null) => {
        setCategoryId(id);
        if (id) {
            await storage.set(LAST_CATEGORY_KEY, String(id))
        }
    }, [refetch]);

    const categoryId = useMemo(() => {
        if (isLoadingCategories || isLoadingDefault || !categories?.length) {
            return null;
        }

        if (selectedCategoryId && categories.some((c) => c.id === selectedCategoryId)) {
            return selectedCategoryId;
        }

        if (defaultCategoryId && categories.some((c) => c.id === defaultCategoryId)) {
            return defaultCategoryId;
        }

        return null;
    }, [isLoadingCategories, isLoadingDefault, selectedCategoryId, defaultCategoryId, categories]);

    return {
        categories,
        categoryId: categoryId,
        setCategoryId: handleSetCategoryId,
        isLoading: isLoadingCategories || isLoadingDefault,
        error,
    }
}


export { useSelectedCategory };
