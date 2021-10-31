import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { createContext, ReactNode, useCallback, useContext } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { requestLogin, requestLogout, useToken } from "./firebase";

const USE_AUTH = process.env.NODE_ENV !== "development" || !process.env.NO_AUTH;

class AuthenticationError extends Error { }

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // don't retry on authentication error
            retry: (count, e) => e instanceof AuthenticationError ? false : count < 3,
        },
    }
})

interface AuthContextState {
    token: string;
    logout: () => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

function AuthProvider(props: { children: ReactNode, isPopup: boolean }) {
    const { children, isPopup } = props;

    const token = useToken();

    const {
        mutate: login,
        isLoading: isLoggingIn,
        error: errorLoggingIn,
    } = useMutation<unknown, Error>(
        async () => requestLogin(),
    );


    const { mutate: logout, isLoading: isLoggingOut, error: errorLoadingOut } = useMutation<unknown, Error>(
        requestLogout,
    );

    const handleLogin = useCallback(() => {
        if (isPopup) {
            global.browser?.runtime.openOptionsPage()
            return;
        }
        if (!isLoggingOut || !isLoggingIn) {
            login();
        }
    }, [login, isLoggingOut, isLoggingIn, isPopup])

    const handleLogout = useCallback(() => {
        if (!isLoggingOut || !isLoggingIn) {
            logout();
        }
    }, [logout, isLoggingOut, isLoggingIn]);

    if ((isLoggingIn || !token || errorLoggingIn) && USE_AUTH) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                {errorLoggingIn && <Typography color='error' sx={{ marginTop: 1 }}>{errorLoggingIn.message}</Typography>}
                <Button
                    onClick={handleLogin}
                    endIcon={isLoggingIn && <CircularProgress size={20} />}
                    disabled={isLoggingIn || isLoggingOut}
                    sx={{ marginTop: 1 }}
                >
                    Login
                </Button>
            </Box>
        )
    }

    return (
        <AuthContext.Provider value={{ token, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}

const AuthenticatedQueryProvider = (props: { children: ReactNode, isPopup: boolean }) => {
    const { children, isPopup } = props;

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider isPopup={isPopup}>
                {children}
            </AuthProvider>
        </QueryClientProvider>
    )
}

const useAuth = () => {
    const auth = useContext(AuthContext);

    if (!auth) {
        throw new Error('No Auth Provider found.')
    }

    return auth;
}

const useAuthenticatedFetcher = <TData, TVariables>(query: string): ((variables?: TVariables) => Promise<TData>) => {
    const auth = useAuth();

    return async (variables?: TVariables) => {
        const res = await fetch(process.env.API_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: auth.token,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        const json = await res.json();

        if (json.errors) {
            const { message, extensions } = json.errors[0] || "Error..";
            if (extensions?.code === "UNAUTHENTICATED") {
                auth.logout()
                throw new AuthenticationError(message);
            }
            throw new Error(message);
        }

        return json.data;
    };
}

export {
    AuthenticatedQueryProvider,
    useAuthenticatedFetcher,
    useAuth,
}
