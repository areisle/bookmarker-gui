import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthenticatedFetcher } from "./AuthProvider";
import {
    FetchDramas,
    FetchDramasDocument,
    FetchDramasVariables,
    useFetchDramas,
} from "./generated";

export * from "./AuthProvider";
export * from "./generated";

export type Drama = FetchDramas["dramas"]["data"][number];

const useInfiniteDramas = (variables: Omit<FetchDramasVariables, "skip">) => {
    const fetcher = useAuthenticatedFetcher<FetchDramas, FetchDramasVariables>(
        FetchDramasDocument
    );

    return useInfiniteQuery<FetchDramas["dramas"], Error>({
        queryKey: useFetchDramas.getKey(variables),
        queryFn: async ({ pageParam }) => {
            const skip = pageParam ?? 0;

            const response = await fetcher({
                ...variables,
                skip,
            });

            return response.dramas;
        },
        getNextPageParam: (lastPage) => {
            const skip = lastPage.meta.skip ?? 0;
            const take = variables.take ?? 50;
            const { count, total } = lastPage.meta;
            if (skip + count < total) {
                return skip + take;
            }
        },
    });
};

export { useInfiniteDramas };
