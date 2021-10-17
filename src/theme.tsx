import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import { GlobalStyles } from '@mui/material';

const hours = new Date().getHours()
const isNightTime = hours < 6 || hours > 20

const styles = `
html {
    background: ${isNightTime ? 'black' : 'white'};
    color: ${isNightTime ? 'white' : 'black'};
}

.MuiLink-root:visited {
    color: ${isNightTime ? '#6752cc' : '#2b1691'};
    text-decoration-color: ${isNightTime ? '#6752cc' : '#2b1691'};
}
`;

const inputGlobalStyles = <GlobalStyles styles={styles} />;

const createCustomTheme = (prefersDarkMode: boolean) => createTheme({
    typography: {
        h1: {
            fontSize: '2.25rem',
        },
        h2: {
            fontSize: '1.75rem',
        },
        h3: {
            fontSize: '1.5rem',
        },
        h4: {
            fontSize: '1.2rem',
        },
        h5: {
            fontSize: '1.1rem',
        },
        h6: {
            fontSize: '1rem',
        }
    },
    palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
    },
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


export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
    const theme = React.useMemo(
        () => {
            return createCustomTheme(isNightTime);
        },
        [],
    );

    return (
        <ThemeProvider theme={theme}>
            {inputGlobalStyles}
            {children}
        </ThemeProvider>
    )
}
