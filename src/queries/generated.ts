import {
    useQuery,
    UseQueryOptions,
    useMutation,
    UseMutationOptions,
} from "react-query";
import { useAuthenticatedFetcher } from "./AuthProvider";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
    JSON: any;
    Void: any;
};

export type Bookmark = {
    __typename?: "Bookmark";
    aliases: Array<BookmarkAlias>;
    category: Category;
    categoryId: Scalars["Int"];
    createdAt: Scalars["Date"];
    description?: Maybe<Scalars["String"]>;
    id: Scalars["Int"];
    modifiedAt: Scalars["Date"];
    tags: Array<Tag>;
    title: Scalars["String"];
    url: Scalars["String"];
};

export type BookmarkAlias = {
    __typename?: "BookmarkAlias";
    bookmark: Bookmark;
    createdAt: Scalars["Date"];
    id: Scalars["Int"];
    modifiedAt: Scalars["Date"];
    url: Scalars["String"];
};

export type Category = {
    __typename?: "Category";
    createdAt: Scalars["Date"];
    id: Scalars["Int"];
    isAdmin: Scalars["Boolean"];
    modifiedAt: Scalars["Date"];
    name: Scalars["String"];
    rules: Array<CategoryPatternAlias>;
    users: Array<UserCategory>;
};

export type CategoryPatternAlias = {
    __typename?: "CategoryPatternAlias";
    canonical: Scalars["String"];
    category: Category;
    categoryId: Scalars["Int"];
    createdAt: Scalars["Date"];
    id: Scalars["Int"];
    match: Scalars["String"];
    modifiedAt: Scalars["Date"];
    origin: Scalars["String"];
};

export type CreateBookmarkContent = {
    categoryId: Scalars["Int"];
    description?: Maybe<Scalars["String"]>;
    tags?: Maybe<Array<Scalars["String"]>>;
    title: Scalars["String"];
    url: Scalars["String"];
};

export type CreateCategoryAliasContent = {
    canonical: Scalars["String"];
    match: Scalars["String"];
    origin: Scalars["String"];
};

export type Mutation = {
    __typename?: "Mutation";
    addBookmark?: Maybe<Bookmark>;
    addCategory?: Maybe<Category>;
    addCategoryPatternAlias?: Maybe<Scalars["Void"]>;
    addTag?: Maybe<Scalars["Void"]>;
    addUsers?: Maybe<Scalars["Void"]>;
    batchUpdateHostName?: Maybe<Scalars["Void"]>;
    joinCategory?: Maybe<Scalars["Void"]>;
    leaveCategory?: Maybe<Scalars["Void"]>;
    login: Scalars["String"];
    removeBookmark?: Maybe<Scalars["Void"]>;
    removeCategoryPatternAlias?: Maybe<Scalars["Void"]>;
    removeTag?: Maybe<Scalars["Void"]>;
    removeUser?: Maybe<Scalars["Void"]>;
    updateBookmark?: Maybe<Scalars["Void"]>;
    updateCategory?: Maybe<Scalars["Void"]>;
    updateCategoryPatternAlias?: Maybe<Scalars["Void"]>;
};

export type MutationAddBookmarkArgs = {
    input: CreateBookmarkContent;
};

export type MutationAddCategoryArgs = {
    name: Scalars["String"];
};

export type MutationAddCategoryPatternAliasArgs = {
    categoryId: Scalars["Int"];
    input: CreateCategoryAliasContent;
};

export type MutationAddTagArgs = {
    bookmarkId: Scalars["Int"];
    name: Scalars["String"];
};

export type MutationAddUsersArgs = {
    categoryId: Scalars["Int"];
    emails: Array<Scalars["String"]>;
};

export type MutationBatchUpdateHostNameArgs = {
    categoryId: Scalars["Int"];
    newName: Scalars["String"];
    oldName: Scalars["String"];
};

export type MutationJoinCategoryArgs = {
    id: Scalars["Int"];
};

export type MutationLeaveCategoryArgs = {
    id: Scalars["Int"];
};

export type MutationLoginArgs = {
    email: Scalars["String"];
    password: Scalars["String"];
};

export type MutationRemoveBookmarkArgs = {
    id: Scalars["Int"];
};

export type MutationRemoveCategoryPatternAliasArgs = {
    id: Scalars["Int"];
};

export type MutationRemoveTagArgs = {
    bookmarkId: Scalars["Int"];
    name: Scalars["String"];
};

export type MutationRemoveUserArgs = {
    categoryId: Scalars["Int"];
    id: Scalars["Int"];
};

export type MutationUpdateBookmarkArgs = {
    bookmarkId: Scalars["Int"];
    input: UpdateBookmarkContent;
};

export type MutationUpdateCategoryArgs = {
    id: Scalars["Int"];
    input?: Maybe<UpdateCategoryContent>;
};

export type MutationUpdateCategoryPatternAliasArgs = {
    id: Scalars["Int"];
    input: UpdateCategoryAliasContent;
};

export type Query = {
    __typename?: "Query";
    bookmark?: Maybe<Bookmark>;
    bookmarks: Array<Bookmark>;
    bookmarksForUrl: Array<Bookmark>;
    categories: Array<Category>;
    category?: Maybe<Category>;
    isBookmarked?: Maybe<Scalars["Boolean"]>;
    tags: Array<Tag>;
    users: Array<UserCategory>;
};

export type QueryBookmarkArgs = {
    id: Scalars["Int"];
};

export type QueryBookmarksArgs = {
    categoryId: Scalars["Int"];
    orderBy?: Maybe<Scalars["JSON"]>;
    skip?: Maybe<Scalars["Int"]>;
    take?: Maybe<Scalars["Int"]>;
    where?: Maybe<Scalars["JSON"]>;
};

export type QueryBookmarksForUrlArgs = {
    url: Scalars["String"];
};

export type QueryCategoriesArgs = {
    skip?: Maybe<Scalars["Int"]>;
    take?: Maybe<Scalars["Int"]>;
};

export type QueryCategoryArgs = {
    id: Scalars["Int"];
};

export type QueryIsBookmarkedArgs = {
    url: Scalars["String"];
};

export type QueryTagsArgs = {
    categoryId: Scalars["Int"];
    skip?: Maybe<Scalars["Int"]>;
    take?: Maybe<Scalars["Int"]>;
    where?: Maybe<Scalars["JSON"]>;
};

export type QueryUsersArgs = {
    categoryId: Scalars["Int"];
};

export type Tag = {
    __typename?: "Tag";
    bookmark: Bookmark;
    category: Category;
    categoryId: Scalars["Int"];
    createdAt: Scalars["Date"];
    createdBy: User;
    createdByCurrentUser: Scalars["Boolean"];
    createdById: Scalars["Int"];
    id: Scalars["Int"];
    modifiedAt: Scalars["Date"];
    name: Scalars["String"];
};

export type UpdateBookmarkContent = {
    aliases?: Maybe<Array<Scalars["String"]>>;
    description?: Maybe<Scalars["String"]>;
    tags?: Maybe<Array<Scalars["String"]>>;
    title?: Maybe<Scalars["String"]>;
    url?: Maybe<Scalars["String"]>;
};

export type UpdateCategoryAliasContent = {
    canonical?: Maybe<Scalars["String"]>;
    match?: Maybe<Scalars["String"]>;
    origin?: Maybe<Scalars["String"]>;
};

export type UpdateCategoryContent = {
    title?: Maybe<Scalars["String"]>;
};

export type User = {
    __typename?: "User";
    createdAt: Scalars["Date"];
    email: Scalars["String"];
    id: Scalars["Int"];
    modifiedAt: Scalars["Date"];
};

export type UserCategory = {
    __typename?: "UserCategory";
    active: Scalars["Boolean"];
    admin: Scalars["Boolean"];
    createdAt: Scalars["Date"];
    id: Scalars["Int"];
    modifiedAt: Scalars["Date"];
    user: User;
};

export type BookmarksVariables = Exact<{
    categoryId: Scalars["Int"];
    bookmarksSkip?: Maybe<Scalars["Int"]>;
    bookmarksTake?: Maybe<Scalars["Int"]>;
    bookmarksWhere?: Maybe<Scalars["JSON"]>;
    bookmarksOrderBy?: Maybe<Scalars["JSON"]>;
}>;

export type Bookmarks = {
    __typename?: "Query";
    bookmarks: Array<{
        __typename?: "Bookmark";
        id: number;
        title: string;
        url: string;
        description?: string | null | undefined;
        createdAt: any;
        category: { __typename?: "Category"; id: number };
        tags: Array<{
            __typename?: "Tag";
            createdByCurrentUser: boolean;
            name: string;
        }>;
        aliases: Array<{ __typename?: "BookmarkAlias"; url: string }>;
    }>;
};

export type BookmarksForUrlVariables = Exact<{
    url: Scalars["String"];
}>;

export type BookmarksForUrl = {
    __typename?: "Query";
    bookmarksForUrl: Array<{
        __typename?: "Bookmark";
        id: number;
        title: string;
        url: string;
        description?: string | null | undefined;
        createdAt: any;
        category: { __typename?: "Category"; id: number };
        tags: Array<{
            __typename?: "Tag";
            name: string;
            createdByCurrentUser: boolean;
        }>;
        aliases: Array<{ __typename?: "BookmarkAlias"; url: string }>;
    }>;
};

export type GetBookmarkVariables = Exact<{
    id: Scalars["Int"];
}>;

export type GetBookmark = {
    __typename?: "Query";
    bookmark?:
        | {
              __typename?: "Bookmark";
              title: string;
              url: string;
              description?: string | null | undefined;
              createdAt: any;
          }
        | null
        | undefined;
};

export type BookmarkTagsVariables = Exact<{
    id: Scalars["Int"];
}>;

export type BookmarkTags = {
    __typename?: "Query";
    bookmark?:
        | {
              __typename?: "Bookmark";
              tags: Array<{
                  __typename?: "Tag";
                  id: number;
                  name: string;
                  createdByCurrentUser: boolean;
              }>;
          }
        | null
        | undefined;
};

export type AddBookmarkVariables = Exact<{
    input: CreateBookmarkContent;
}>;

export type AddBookmark = {
    __typename?: "Mutation";
    addBookmark?: { __typename?: "Bookmark"; id: number } | null | undefined;
};

export type RemoveBookmarkVariables = Exact<{
    id: Scalars["Int"];
}>;

export type RemoveBookmark = {
    __typename?: "Mutation";
    removeBookmark?: any | null | undefined;
};

export type UpdateBookmarkVariables = Exact<{
    id: Scalars["Int"];
    input: UpdateBookmarkContent;
}>;

export type UpdateBookmark = {
    __typename?: "Mutation";
    updateBookmark?: any | null | undefined;
};

export type CategoriesVariables = Exact<{ [key: string]: never }>;

export type Categories = {
    __typename?: "Query";
    categories: Array<{ __typename?: "Category"; id: number; name: string }>;
};

export type GetCategoryVariables = Exact<{
    id: Scalars["Int"];
}>;

export type GetCategory = {
    __typename?: "Query";
    category?:
        | {
              __typename?: "Category";
              name: string;
              isAdmin: boolean;
              rules: Array<{
                  __typename?: "CategoryPatternAlias";
                  id: number;
                  match: string;
                  canonical: string;
                  origin: string;
              }>;
              users: Array<{
                  __typename?: "UserCategory";
                  id: number;
                  active: boolean;
                  admin: boolean;
                  user: { __typename?: "User"; email: string };
              }>;
          }
        | null
        | undefined;
};

export type AddCategoryVariables = Exact<{
    name: Scalars["String"];
}>;

export type AddCategory = {
    __typename?: "Mutation";
    addCategory?:
        | { __typename?: "Category"; id: number; name: string }
        | null
        | undefined;
};

export type LeaveCategoryVariables = Exact<{
    id: Scalars["Int"];
}>;

export type LeaveCategory = {
    __typename?: "Mutation";
    leaveCategory?: any | null | undefined;
};

export type AddCategoryPatternAliasVariables = Exact<{
    categoryId: Scalars["Int"];
    input: CreateCategoryAliasContent;
}>;

export type AddCategoryPatternAlias = {
    __typename?: "Mutation";
    addCategoryPatternAlias?: any | null | undefined;
};

export type RemoveCategoryPatternAliasVariables = Exact<{
    id: Scalars["Int"];
}>;

export type RemoveCategoryPatternAlias = {
    __typename?: "Mutation";
    removeCategoryPatternAlias?: any | null | undefined;
};

export type UpdateCategoryPatternAliasVariables = Exact<{
    id: Scalars["Int"];
    input: UpdateCategoryAliasContent;
}>;

export type UpdateCategoryPatternAlias = {
    __typename?: "Mutation";
    updateCategoryPatternAlias?: any | null | undefined;
};

export type TagsVariables = Exact<{
    categoryId: Scalars["Int"];
    tagsWhere?: Maybe<Scalars["JSON"]>;
}>;

export type Tags = {
    __typename?: "Query";
    tags: Array<{ __typename?: "Tag"; name: string }>;
};

export type AddTagVariables = Exact<{
    bookmarkId: Scalars["Int"];
    name: Scalars["String"];
}>;

export type AddTag = {
    __typename?: "Mutation";
    addTag?: any | null | undefined;
};

export type RemoveTagVariables = Exact<{
    bookmarkId: Scalars["Int"];
    name: Scalars["String"];
}>;

export type RemoveTag = {
    __typename?: "Mutation";
    removeTag?: any | null | undefined;
};

export type UsersVariables = Exact<{
    categoryId: Scalars["Int"];
}>;

export type Users = {
    __typename?: "Query";
    users: Array<{
        __typename?: "UserCategory";
        id: number;
        active: boolean;
        admin: boolean;
        user: { __typename?: "User"; email: string };
    }>;
};

export type AddUsersVariables = Exact<{
    categoryId: Scalars["Int"];
    emails: Array<Scalars["String"]> | Scalars["String"];
}>;

export type AddUsers = {
    __typename?: "Mutation";
    addUsers?: any | null | undefined;
};

export type RemoveUserVariables = Exact<{
    categoryId: Scalars["Int"];
    id: Scalars["Int"];
}>;

export type RemoveUser = {
    __typename?: "Mutation";
    removeUser?: any | null | undefined;
};

export const BookmarksDocument = `
    query bookmarks($categoryId: Int!, $bookmarksSkip: Int, $bookmarksTake: Int, $bookmarksWhere: JSON, $bookmarksOrderBy: JSON) {
  bookmarks(
    categoryId: $categoryId
    skip: $bookmarksSkip
    take: $bookmarksTake
    where: $bookmarksWhere
    orderBy: $bookmarksOrderBy
  ) {
    id
    title
    url
    description
    createdAt
    category {
      id
    }
    tags {
      createdByCurrentUser
      name
    }
    aliases {
      url
    }
  }
}
    `;
export const useBookmarks = <TData = Bookmarks, TError = Error>(
    variables: BookmarksVariables,
    options?: UseQueryOptions<Bookmarks, TError, TData>
) =>
    useQuery<Bookmarks, TError, TData>(
        ["bookmarks", variables],
        useAuthenticatedFetcher<Bookmarks, BookmarksVariables>(
            BookmarksDocument
        ).bind(null, variables),
        options
    );
useBookmarks.getKey = (variables: BookmarksVariables) => [
    "bookmarks",
    variables,
];

export const BookmarksForUrlDocument = `
    query bookmarksForUrl($url: String!) {
  bookmarksForUrl(url: $url) {
    id
    title
    url
    description
    createdAt
    category {
      id
    }
    tags {
      name
      createdByCurrentUser
    }
    aliases {
      url
    }
  }
}
    `;
export const useBookmarksForUrl = <TData = BookmarksForUrl, TError = Error>(
    variables: BookmarksForUrlVariables,
    options?: UseQueryOptions<BookmarksForUrl, TError, TData>
) =>
    useQuery<BookmarksForUrl, TError, TData>(
        ["bookmarksForUrl", variables],
        useAuthenticatedFetcher<BookmarksForUrl, BookmarksForUrlVariables>(
            BookmarksForUrlDocument
        ).bind(null, variables),
        options
    );
useBookmarksForUrl.getKey = (variables: BookmarksForUrlVariables) => [
    "bookmarksForUrl",
    variables,
];

export const GetBookmarkDocument = `
    query getBookmark($id: Int!) {
  bookmark(id: $id) {
    title
    url
    description
    createdAt
  }
}
    `;
export const useGetBookmark = <TData = GetBookmark, TError = Error>(
    variables: GetBookmarkVariables,
    options?: UseQueryOptions<GetBookmark, TError, TData>
) =>
    useQuery<GetBookmark, TError, TData>(
        ["getBookmark", variables],
        useAuthenticatedFetcher<GetBookmark, GetBookmarkVariables>(
            GetBookmarkDocument
        ).bind(null, variables),
        options
    );
useGetBookmark.getKey = (variables: GetBookmarkVariables) => [
    "getBookmark",
    variables,
];

export const BookmarkTagsDocument = `
    query bookmarkTags($id: Int!) {
  bookmark(id: $id) {
    tags {
      id
      name
      createdByCurrentUser
    }
  }
}
    `;
export const useBookmarkTags = <TData = BookmarkTags, TError = Error>(
    variables: BookmarkTagsVariables,
    options?: UseQueryOptions<BookmarkTags, TError, TData>
) =>
    useQuery<BookmarkTags, TError, TData>(
        ["bookmarkTags", variables],
        useAuthenticatedFetcher<BookmarkTags, BookmarkTagsVariables>(
            BookmarkTagsDocument
        ).bind(null, variables),
        options
    );
useBookmarkTags.getKey = (variables: BookmarkTagsVariables) => [
    "bookmarkTags",
    variables,
];

export const AddBookmarkDocument = `
    mutation addBookmark($input: CreateBookmarkContent!) {
  addBookmark(input: $input) {
    id
  }
}
    `;
export const useAddBookmark = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<
        AddBookmark,
        TError,
        AddBookmarkVariables,
        TContext
    >
) =>
    useMutation<AddBookmark, TError, AddBookmarkVariables, TContext>(
        useAuthenticatedFetcher<AddBookmark, AddBookmarkVariables>(
            AddBookmarkDocument
        ),
        options
    );
export const RemoveBookmarkDocument = `
    mutation removeBookmark($id: Int!) {
  removeBookmark(id: $id)
}
    `;
export const useRemoveBookmark = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<
        RemoveBookmark,
        TError,
        RemoveBookmarkVariables,
        TContext
    >
) =>
    useMutation<RemoveBookmark, TError, RemoveBookmarkVariables, TContext>(
        useAuthenticatedFetcher<RemoveBookmark, RemoveBookmarkVariables>(
            RemoveBookmarkDocument
        ),
        options
    );
export const UpdateBookmarkDocument = `
    mutation updateBookmark($id: Int!, $input: UpdateBookmarkContent!) {
  updateBookmark(bookmarkId: $id, input: $input)
}
    `;
export const useUpdateBookmark = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<
        UpdateBookmark,
        TError,
        UpdateBookmarkVariables,
        TContext
    >
) =>
    useMutation<UpdateBookmark, TError, UpdateBookmarkVariables, TContext>(
        useAuthenticatedFetcher<UpdateBookmark, UpdateBookmarkVariables>(
            UpdateBookmarkDocument
        ),
        options
    );
export const CategoriesDocument = `
    query categories {
  categories {
    id
    name
  }
}
    `;
export const useCategories = <TData = Categories, TError = Error>(
    variables?: CategoriesVariables,
    options?: UseQueryOptions<Categories, TError, TData>
) =>
    useQuery<Categories, TError, TData>(
        variables === undefined ? ["categories"] : ["categories", variables],
        useAuthenticatedFetcher<Categories, CategoriesVariables>(
            CategoriesDocument
        ).bind(null, variables),
        options
    );
useCategories.getKey = (variables?: CategoriesVariables) =>
    variables === undefined ? ["categories"] : ["categories", variables];

export const GetCategoryDocument = `
    query getCategory($id: Int!) {
  category(id: $id) {
    name
    rules {
      id
      match
      canonical
      origin
    }
    users {
      id
      active
      admin
      user {
        email
      }
    }
    isAdmin
  }
}
    `;
export const useGetCategory = <TData = GetCategory, TError = Error>(
    variables: GetCategoryVariables,
    options?: UseQueryOptions<GetCategory, TError, TData>
) =>
    useQuery<GetCategory, TError, TData>(
        ["getCategory", variables],
        useAuthenticatedFetcher<GetCategory, GetCategoryVariables>(
            GetCategoryDocument
        ).bind(null, variables),
        options
    );
useGetCategory.getKey = (variables: GetCategoryVariables) => [
    "getCategory",
    variables,
];

export const AddCategoryDocument = `
    mutation addCategory($name: String!) {
  addCategory(name: $name) {
    id
    name
  }
}
    `;
export const useAddCategory = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<
        AddCategory,
        TError,
        AddCategoryVariables,
        TContext
    >
) =>
    useMutation<AddCategory, TError, AddCategoryVariables, TContext>(
        useAuthenticatedFetcher<AddCategory, AddCategoryVariables>(
            AddCategoryDocument
        ),
        options
    );
export const LeaveCategoryDocument = `
    mutation leaveCategory($id: Int!) {
  leaveCategory(id: $id)
}
    `;
export const useLeaveCategory = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<
        LeaveCategory,
        TError,
        LeaveCategoryVariables,
        TContext
    >
) =>
    useMutation<LeaveCategory, TError, LeaveCategoryVariables, TContext>(
        useAuthenticatedFetcher<LeaveCategory, LeaveCategoryVariables>(
            LeaveCategoryDocument
        ),
        options
    );
export const AddCategoryPatternAliasDocument = `
    mutation addCategoryPatternAlias($categoryId: Int!, $input: CreateCategoryAliasContent!) {
  addCategoryPatternAlias(categoryId: $categoryId, input: $input)
}
    `;
export const useAddCategoryPatternAlias = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<
        AddCategoryPatternAlias,
        TError,
        AddCategoryPatternAliasVariables,
        TContext
    >
) =>
    useMutation<
        AddCategoryPatternAlias,
        TError,
        AddCategoryPatternAliasVariables,
        TContext
    >(
        useAuthenticatedFetcher<
            AddCategoryPatternAlias,
            AddCategoryPatternAliasVariables
        >(AddCategoryPatternAliasDocument),
        options
    );
export const RemoveCategoryPatternAliasDocument = `
    mutation removeCategoryPatternAlias($id: Int!) {
  removeCategoryPatternAlias(id: $id)
}
    `;
export const useRemoveCategoryPatternAlias = <
    TError = Error,
    TContext = unknown
>(
    options?: UseMutationOptions<
        RemoveCategoryPatternAlias,
        TError,
        RemoveCategoryPatternAliasVariables,
        TContext
    >
) =>
    useMutation<
        RemoveCategoryPatternAlias,
        TError,
        RemoveCategoryPatternAliasVariables,
        TContext
    >(
        useAuthenticatedFetcher<
            RemoveCategoryPatternAlias,
            RemoveCategoryPatternAliasVariables
        >(RemoveCategoryPatternAliasDocument),
        options
    );
export const UpdateCategoryPatternAliasDocument = `
    mutation updateCategoryPatternAlias($id: Int!, $input: UpdateCategoryAliasContent!) {
  updateCategoryPatternAlias(id: $id, input: $input)
}
    `;
export const useUpdateCategoryPatternAlias = <
    TError = Error,
    TContext = unknown
>(
    options?: UseMutationOptions<
        UpdateCategoryPatternAlias,
        TError,
        UpdateCategoryPatternAliasVariables,
        TContext
    >
) =>
    useMutation<
        UpdateCategoryPatternAlias,
        TError,
        UpdateCategoryPatternAliasVariables,
        TContext
    >(
        useAuthenticatedFetcher<
            UpdateCategoryPatternAlias,
            UpdateCategoryPatternAliasVariables
        >(UpdateCategoryPatternAliasDocument),
        options
    );
export const TagsDocument = `
    query tags($categoryId: Int!, $tagsWhere: JSON) {
  tags(categoryId: $categoryId, where: $tagsWhere, take: 20) {
    name
  }
}
    `;
export const useTags = <TData = Tags, TError = Error>(
    variables: TagsVariables,
    options?: UseQueryOptions<Tags, TError, TData>
) =>
    useQuery<Tags, TError, TData>(
        ["tags", variables],
        useAuthenticatedFetcher<Tags, TagsVariables>(TagsDocument).bind(
            null,
            variables
        ),
        options
    );
useTags.getKey = (variables: TagsVariables) => ["tags", variables];

export const AddTagDocument = `
    mutation addTag($bookmarkId: Int!, $name: String!) {
  addTag(bookmarkId: $bookmarkId, name: $name)
}
    `;
export const useAddTag = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<AddTag, TError, AddTagVariables, TContext>
) =>
    useMutation<AddTag, TError, AddTagVariables, TContext>(
        useAuthenticatedFetcher<AddTag, AddTagVariables>(AddTagDocument),
        options
    );
export const RemoveTagDocument = `
    mutation removeTag($bookmarkId: Int!, $name: String!) {
  removeTag(bookmarkId: $bookmarkId, name: $name)
}
    `;
export const useRemoveTag = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<
        RemoveTag,
        TError,
        RemoveTagVariables,
        TContext
    >
) =>
    useMutation<RemoveTag, TError, RemoveTagVariables, TContext>(
        useAuthenticatedFetcher<RemoveTag, RemoveTagVariables>(
            RemoveTagDocument
        ),
        options
    );
export const UsersDocument = `
    query users($categoryId: Int!) {
  users(categoryId: $categoryId) {
    id
    user {
      email
    }
    active
    admin
  }
}
    `;
export const useUsers = <TData = Users, TError = Error>(
    variables: UsersVariables,
    options?: UseQueryOptions<Users, TError, TData>
) =>
    useQuery<Users, TError, TData>(
        ["users", variables],
        useAuthenticatedFetcher<Users, UsersVariables>(UsersDocument).bind(
            null,
            variables
        ),
        options
    );
useUsers.getKey = (variables: UsersVariables) => ["users", variables];

export const AddUsersDocument = `
    mutation addUsers($categoryId: Int!, $emails: [String!]!) {
  addUsers(categoryId: $categoryId, emails: $emails)
}
    `;
export const useAddUsers = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<AddUsers, TError, AddUsersVariables, TContext>
) =>
    useMutation<AddUsers, TError, AddUsersVariables, TContext>(
        useAuthenticatedFetcher<AddUsers, AddUsersVariables>(AddUsersDocument),
        options
    );
export const RemoveUserDocument = `
    mutation removeUser($categoryId: Int!, $id: Int!) {
  removeUser(categoryId: $categoryId, id: $id)
}
    `;
export const useRemoveUser = <TError = Error, TContext = unknown>(
    options?: UseMutationOptions<
        RemoveUser,
        TError,
        RemoveUserVariables,
        TContext
    >
) =>
    useMutation<RemoveUser, TError, RemoveUserVariables, TContext>(
        useAuthenticatedFetcher<RemoveUser, RemoveUserVariables>(
            RemoveUserDocument
        ),
        options
    );
