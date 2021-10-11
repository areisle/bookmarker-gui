import { getToken } from "./auth";

export const fetchData = <TData, TVariables>(query: string, variables?: TVariables): (() => Promise<TData>) => {
    return async () => {
        const token = await getToken();
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
