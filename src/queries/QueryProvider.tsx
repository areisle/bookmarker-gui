import React, { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { AuthenticationError } from "./fetcher"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            onError: (e) => {
                if (e instanceof AuthenticationError) {
                    queryClient.invalidateQueries('isAuthenticated')
                }
            }
        }
    }
})

function QueryProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export { QueryProvider, queryClient }
