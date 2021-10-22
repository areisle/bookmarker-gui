import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery } from "react-query";
import { getToken, removeToken, setToken, USE_AUTH } from "./auth";

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

function AuthProvider(props: { children: ReactNode }) {
    const { children } = props;

    const { data: token = '', refetch } = useQuery<string, Error>('isAuthenticated', getToken, {
        enabled: USE_AUTH,
    })

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {
        mutate: login,
        isLoading: isLoggingIn,
        error: errorLoggingIn,
    } = useMutation<string, Error>(
        async () => {
            // remove old token
            await removeToken()

            const response = await fetch(process.env.API_URL!, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                    mutation login($email: String!, $password: String!) {
                        login(email: $email, password: $password)
                    }
                    `,
                    variables: { email, password },
                }),
            });

            const body = await response.json();

            if (!response.ok) {
                throw new Error(`Authentication Failed. ${body.message}`);
            }

            if (body.errors) {
                throw new Error(`${body.errors[0]?.message ?? 'An error occurred.'}`);
            }

            const token = body.data.login
            await setToken(token ?? '')

            return token;
        },
        { onSuccess: () => refetch() }
    );

    const { mutate: logout, isLoading: isLoggingOut, error: errorLoadingOut } = useMutation<unknown, Error>(
        async () => removeToken(),
        { onSuccess: () => refetch() }
    );

    const handleLogin = useCallback(() => {
        if (!isLoggingOut || !isLoggingIn) {
            login();
        }
    }, [login, isLoggingOut, isLoggingIn])

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
                <TextField
                    label='email'
                    type='email'
                    sx={{ minWidth: 300, marginTop: 1 }}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <TextField
                    label='password'
                    type='password'
                    sx={{ minWidth: 300, marginTop: 1 }}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                {errorLoggingIn && <Typography color='error' sx={{ marginTop: 1 }}>{errorLoggingIn.message}</Typography>}
                <Button
                    onClick={handleLogin}
                    endIcon={isLoggingIn && <CircularProgress size={20} />}
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

const AuthenticatedQueryProvider = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
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

const useAuthenticatedFetcher = <TData, TVariables>(query: string): (() => Promise<TData>) => {
    const auth = useAuth();

    return async (variables?: TVariables) => {
        console.log("token is", auth.token);
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
                console.log("unauthenticated error, removing token");
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
