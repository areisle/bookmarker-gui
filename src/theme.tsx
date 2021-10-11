import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

declare module '@mui/material/styles' {
    interface Theme {
        status?: {
            danger: React.CSSProperties['color'];
        };
    }

    interface Palette {
        neutral: Palette['primary'];
    }
    interface PaletteOptions {
        neutral: PaletteOptions['primary'];
    }

    interface PaletteColor {
        darker?: string;
    }
    interface SimplePaletteColorOptions {
        darker?: string;
    }
    interface ThemeOptions {
        status?: {
            danger: React.CSSProperties['color'];
        };
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        neutral: true;
    }
}

const theme = createTheme({
    palette: {
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                variant: 'outlined'
            }
        },
        MuiTextField: {
            defaultProps: {
                margin: 'none',
                size: 'small'
            }
        }
    }
});

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
)
