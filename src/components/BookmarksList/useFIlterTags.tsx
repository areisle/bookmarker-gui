import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { storage } from '../../queries/storage';


interface Tag {
    name: string;
    exclude?: boolean;
}

const useFilterTags = (categoryId: number | null) => {
    const [tagFilters, setTagFilters] = useState<Tag[]>([]);

    const storageKey = `BOOKMARKER_EXT__CATEGORY_${categoryId}_TAG_FILTERS`;

    const { data: defaultTagFilters, isLoading: isLoadingDefault } = useQuery(
        storageKey,
        async () => {
            const lastString = await storage.get(storageKey);
            const last = lastString ? JSON.parse(lastString) : [];
            return last;
        },
        {
            enabled: Boolean(categoryId),
        }
    );

    const handleSetTags = useCallback((next: Tag[]) => {
        setTagFilters(next);
        storage.set(storageKey, JSON.stringify(next))
    }, [storageKey]);

    useLayoutEffect(() => {
        if (!isLoadingDefault) {
            setTagFilters(defaultTagFilters ?? []);
        }
    }, [categoryId, defaultTagFilters, isLoadingDefault]);

    return [tagFilters, handleSetTags] as [Tag[], (next: Tag[]) => void];

}


export { useFilterTags };
