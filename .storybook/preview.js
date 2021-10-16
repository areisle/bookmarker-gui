import { CustomThemeProvider } from '../src/theme';
import { QueryProvider, AuthProvider } from '../src/queries';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

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
    (Story) => (
        <CustomThemeProvider>
            <QueryProvider>
                <AuthProvider>
                    <Story />
                </AuthProvider>
            </QueryProvider>
        </CustomThemeProvider>
    ),
];
