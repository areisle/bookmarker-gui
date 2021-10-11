import { Button, TextField } from '@mui/material';
import React, { useEffect } from 'react';

interface LoginPageProps {

}

function LoginPage(props: LoginPageProps) {
    useEffect(() => {
        const oldToken = localStorage.getItem('BOOKMARKER_EXT__TOKEN');
        console.log({ oldToken })
    }, []);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch(process.env.STORYBOOK_API_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                mutation($email: String!, $password: String!) {
                    login(email: $email, password: $password)
                  }
                `,
                variables: { url: 'https://developer.chrome.com/docs/extensions/reference/identity/#method-getAuthToken' },
            }),
        });

        let body = await response.json()

        if (body.token) {
            localStorage.setItem('BOOKMARKER_EXT__TOKEN', body.token)
        }

        console.log({ body })
    }

    return (
        <form onSubmit={handleLogin}>
            <TextField label='email' type='email' sx={{ minWidth: 300 }} />
            <TextField label='password' type='password' sx={{ minWidth: 300 }} />
            <Button type='submit'>Login</Button>
        </form>
    );
}

export { LoginPage };
export type { LoginPageProps };
