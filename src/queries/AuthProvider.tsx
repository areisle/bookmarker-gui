import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FetchCurrentUser, useFetchCurrentUser } from "./generated";
import { useStoredValue } from "../components/DramasList/Filter";


class AuthenticationError extends Error { }

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // don't retry on authentication error
            retry: (count, e) => e instanceof AuthenticationError ? false : count < 3,
        },
    }
})


const UserContext = createContext<FetchCurrentUser['currentUser'] | undefined>(undefined);

function UserContextProvider(props: { children: ReactNode }) {
    const {
        data: user,
        isLoading,
        error,
    } = useFetchCurrentUser();

    if (isLoading || error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                {isLoading && <CircularProgress size={20} />}
                {error && <Typography color='error' sx={{ marginTop: 1 }}>{error.message}</Typography>}
            </Box>
        )
    }

    return (
        <UserContext.Provider value={user['currentUser']}>
            {props.children}
        </UserContext.Provider>
    )
}

function useCurrentUser() {
    const user = useContext(UserContext);

    if (!user) {
        throw new Error('No User Provider found.')
    }

    return user;
}

interface AuthContextState {
    token: string;
    logout: () => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

function AuthProvider(props: { children: ReactNode, isPopup: boolean }) {
    const { children, isPopup } = props;

    const [email, setEmail] = useStoredValue<string | null>('email', null);
    console.log({ isPopup, email });
    const [inputValue, setInputValue] = useState('');

    const handleLogout = useCallback(() => {
        setEmail(null);
    }, []);

    const handleLogin = useCallback(() => {
        if (isPopup) {
            console.log({ isPopup, browser: global.browser })
            global.browser?.runtime?.openOptionsPage();
        } else {
            setEmail(inputValue || null);
        }
    }, [inputValue, isPopup]);

    const value = useMemo(() => ({
        token: email!,
        logout: handleLogout,
    }), [handleLogout, email]);

    if (!email) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                {!isPopup && (
                    <TextField
                        name='email'
                        type='email'
                        label='your email'
                        helperText='this is used to identify which user is making changes'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                )}
                <Button
                    onClick={handleLogin}
                    sx={{ marginTop: 1 }}
                >
                    Login
                </Button>
            </Box>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            <span>email: {email}</span>
            <button onClick={() => global.browser?.runtime?.openOptionsPage()}>options page</button>
            {children}
        </AuthContext.Provider>
    )
}

const AuthenticatedQueryProvider = (props: { children: ReactNode, isPopup: boolean }) => {
    const { children, isPopup } = props;

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider isPopup={isPopup}>
                <UserContextProvider>
                    {children}
                </UserContextProvider>
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
    console.log('auth', auth)

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
    useCurrentUser,
    AuthContext,
    UserContext,
    queryClient,
}
