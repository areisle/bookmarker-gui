import { CustomThemeProvider } from '../src/theme';
import { QueryProvider } from '../src/queries';

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

export const decorators = [
    (Story) => <CustomThemeProvider><Story /></CustomThemeProvider>,
    (Story) => <QueryProvider><Story /></QueryProvider>,
];
