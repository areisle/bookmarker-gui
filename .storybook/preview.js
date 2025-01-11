import { CustomThemeProvider } from '../src/theme';
import { AuthContext, UserContext, queryClient } from '../src/queries';
import { QueryClientProvider } from "@tanstack/react-query";

import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { PageMetaContext } from '../src/queries/ActiveTabProvider';
import { initialize, mswDecorator } from 'msw-storybook-addon';

// Initialize MSW
initialize({
    // onUnhandledRequest: 'bypass',
    onUnhandledRequest: async (req) => {
        if (req.url.origin.includes('googleapis')) {
            return 'bypass';
        }
        let data = ''
        try {
            data = await req.json()
        } catch (e) {
            // pass
        }
        console.warn(`Unhandled request ${req.method} ${req.url}.\n
            ${JSON.stringify(data, undefined, 2)}
        `)
        return 'bypass';
    },
});

const customViewports = {
    popup: {
        name: 'Extension Popup',
        styles: {
            maxWidth: '600px',
            width: '100%',
            maxHeight: '600px',
            height: '100%',
        },
        type: 'desktop'
    },
};

export const parameters = {
    actions: { argTypesRegex: "^on.*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    viewport: {
        viewports: {
            ...MINIMAL_VIEWPORTS,
            ...customViewports,
        },
    },
};

export const decorators = [
    mswDecorator,
    (Story, context) => {
        return (
            <CustomThemeProvider>
                <QueryClientProvider client={queryClient}>
                    <AuthContext.Provider value={{ token: '', logout: console.log }}>
                        <UserContext.Provider value={context.parameters.user}>
                            <PageMetaContext.Provider value={context.parameters.pageMeta}>
                                <Story />
                            </PageMetaContext.Provider>
                        </UserContext.Provider>
                    </AuthContext.Provider>
                </QueryClientProvider>
            </CustomThemeProvider>
        )
    },
];
