import { useInfiniteQuery } from "react-query";
import { useAuthenticatedFetcher } from "./AuthProvider";
import {
    Bookmarks,
    BookmarksDocument,
    BookmarksVariables,
    useBookmarks,
} from "./generated";

export { AuthenticatedQueryProvider, useAuth } from "./AuthProvider";
export * from "./generated";

export type Bookmark = Bookmarks["bookmarks"]["data"][number];

const useInfiniteBookmarks = (variables: Omit<BookmarksVariables, "skip">) => {
    const fetcher = useAuthenticatedFetcher<Bookmarks, BookmarksVariables>(
        BookmarksDocument
    );

    return useInfiniteQuery<Bookmarks["bookmarks"], Error>(
        useBookmarks.getKey(variables),
        async ({ pageParam }) => {
            const skip = pageParam ?? 0;

            const response = await fetcher({
                ...variables,
                skip,
            });

            return response.bookmarks;
        },
        {
            getNextPageParam: (lastPage) => {
                const skip = lastPage.meta.skip ?? 0;
                const take = variables.take ?? 10;
                const { count, total } = lastPage.meta;
                if (skip + count < total) {
                    return skip + take;
                }
            },
            keepPreviousData: true,
        }
    );
};

export { useInfiniteBookmarks };
