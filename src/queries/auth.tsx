import React, { createContext, ReactNode, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Typography, Button, TextField, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { storage } from "./storage";

const TOKEN_KEY = 'BOOKMARKER_EXT__TOKEN';

const isAuthenticated = async () => {
    const token = await storage.get(TOKEN_KEY) ?? '';
    return token;
}

interface AuthContextState {
    token: string;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    isPopup?: boolean;
}

const USE_AUTH = process.env.NODE_ENV !== "development" || !process.env.NO_AUTH;

const AuthProvider = (props: AuthProviderProps) => {
    const { children, isPopup } = props;

    const { data: token, refetch } = useQuery<string, Error>('isAuthenticated', isAuthenticated, {
        enabled: USE_AUTH,
    })

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { mutate: login, isLoading, error } = useMutation<string, Error>(
        async () => authenticate(email, password),
        { onSuccess: () => refetch() }
    );

    const handleLogin = () => {
        login();
    }

    if (!token && isPopup && USE_AUTH) {
        return (
            <Button
                onClick={() => chrome?.runtime.openOptionsPage()}
                endIcon={isLoading && <CircularProgress size={20} />}
            >
                Login
            </Button>
        )
    }

    if (!token && USE_AUTH) {
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
                {error && <Typography color='error' sx={{ marginTop: 1 }}>{error.message}</Typography>}
                <Button
                    onClick={handleLogin}
                    endIcon={isLoading && <CircularProgress size={20} />}
                    sx={{ marginTop: 1 }}
                >
                    Login
                </Button>
            </Box>
        )

    }

    return (
        <AuthContext.Provider value={{ token: token! }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('No AuthProvider found.')
    }

    return auth;
}

const authenticate = async (email: string, password: string) => {
    // remove old token
    await storage.remove(TOKEN_KEY)

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
    await storage.set(TOKEN_KEY, token ?? '')

    return token;
};


export { useAuth, AuthProvider };
