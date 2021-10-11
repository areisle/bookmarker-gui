import { useAuth } from "./auth";

export const useFetchData = <TData, TVariables>(query: string): (() => Promise<TData>) => {
    const { token } = useAuth();
    return async (variables?: TVariables) => {
        const res = await fetch(process.env.STORYBOOK_API_URL ?? "", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        const json = await res.json();

        if (json.errors) {
            const { message } = json.errors[0] || 'Error..';
            throw new Error(message);
        }

        return json.data;
    };
};
