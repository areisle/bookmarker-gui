import { getToken, removeToken } from "./auth";

class AuthenticationError extends Error {}

export const fetchData = <TData, TVariables>(
    query: string,
    variables?: TVariables
): (() => Promise<TData>) => {
    return async () => {
        const token = await getToken();
        const res = await fetch(process.env.API_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
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
                await removeToken();
                throw new AuthenticationError(message);
            }
            throw new Error(message);
        }

        return json.data;
    };
};

export { AuthenticationError };
