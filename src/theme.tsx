import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { GlobalStyles } from '@mui/material';

const styles = `
.MuiLink-root:visited {
    color: #2b1691;
    text-decoration-color: #2b1691;
}
`;

const inputGlobalStyles = <GlobalStyles styles={styles} />;

const theme = createTheme({
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '0.9rem'
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '0.9rem'
                }
            }
        },
        MuiButton: {
            defaultProps: {
                variant: 'outlined'
            },
            styleOverrides: {
                root: {
                    fontSize: '0.8rem'
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                margin: 'none',
                size: 'small'
            },
        },
        MuiAutocomplete: {
            defaultProps: {
                size: 'small'
            }
        },
        MuiMenuItem: {
            defaultProps: {
                dense: true,
            }
        },
        MuiIconButton: {
            defaultProps: {
                size: 'small',
            }
        },
        MuiIcon: {
            defaultProps: {
                fontSize: 'small'
            }
        },
        MuiTable: {
            defaultProps: {
                size: 'small'
            }
        },
        MuiLink: {
            defaultProps: {
                target: '_blank',
                rel: 'noopener'
            }
        },
        MuiChip: {
            defaultProps: {
                size: 'small',
                color: 'primary'
            }
        }
    }
});

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => (
    <ThemeProvider theme={theme}>
        {inputGlobalStyles}
        {children}
    </ThemeProvider>
)
