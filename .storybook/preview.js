import { CustomThemeProvider } from '../src/theme';
import { AuthenticatedQueryProvider } from '../src/queries';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import { PageMetaContext } from '../src/queries/ActiveTabProvider';

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
    actions: { argTypesRegex: "^on[A-Z].*" },
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
    (Story, context) => (
        <CustomThemeProvider>
            <AuthenticatedQueryProvider>
                <PageMetaContext.Provider value={context.parameters.pageMeta}>
                    <Story />
                </PageMetaContext.Provider>
            </AuthenticatedQueryProvider>
        </CustomThemeProvider>
    ),
];
