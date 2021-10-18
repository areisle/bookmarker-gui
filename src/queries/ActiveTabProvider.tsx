import React, { createContext, ReactNode, useContext } from 'react';
import { useQuery } from 'react-query';
import { getCurrentTab } from './chrome';

interface PageMetaContextState {
    url?: string;
    title?: string;
}

const PageMetaContext = createContext<PageMetaContextState | undefined>(undefined);

function usePageMeta() {
    return useContext(PageMetaContext);
}

function PageMetaProvider({ children }: { children: ReactNode }) {
    const { data: tab, isLoading } = useQuery('current-tab', getCurrentTab);

    if (isLoading) {

    }

    return (
        <PageMetaContext.Provider value={{ url: tab?.url, title: tab?.title }}>
            {children}
        </PageMetaContext.Provider>
    )
}

export { usePageMeta, PageMetaProvider, PageMetaContext }
