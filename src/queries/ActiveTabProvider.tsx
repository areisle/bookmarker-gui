import React, { createContext, ReactNode, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

interface PageMetaContextState {
    url?: string;
    title?: string;
}

const PageMetaContext = createContext<PageMetaContextState | undefined>(undefined);

function usePageMeta() {
    return useContext(PageMetaContext);
}

function PageMetaProvider({ children }: { children: ReactNode }) {
    const { data: tab, isLoading } = useQuery(['current-tab'], async () => {
        const [next] = await global.browser.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });

        return {
            url: next.url,
            title: (next.title ?? '').split(' at Dramanice')[0].trim()
        };
    });


    return (
        <PageMetaContext.Provider value={{ url: tab?.url, title: tab?.title }}>
            {children}
        </PageMetaContext.Provider>
    )
}

export { usePageMeta, PageMetaProvider, PageMetaContext }
