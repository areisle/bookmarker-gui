import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storage } from '../../queries/storage';

const useStoredFilterText = () => {
    const [filters, setFilters] = useState('');

    const storageKey = `BOOKMARKER_EXT__TAG_FILTERS`;

    const { data: defaultFilters, isLoading: isLoadingDefault } = useQuery(
        [storageKey],
        async () => {
            return storage.get(storageKey);
        },
    );

    const handleSetTags = useCallback((next: string) => {
        setFilters(next);
        storage.set(storageKey, next)
    }, [storageKey]);

    useLayoutEffect(() => {
        if (!isLoadingDefault) {
            setFilters(defaultFilters ?? '');
        }
    }, [defaultFilters, isLoadingDefault]);

    return [filters, handleSetTags] as [string, (next: string) => void];

}


export { useStoredFilterText };
