import { useQuery, UseQueryOptions, useMutation, UseMutationOptions } from 'react-query';
import { fetchData } from './fetcher';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  __typename?: 'Bookmark';
  category: Category;
  categoryId: Scalars['Int'];
  createdAt: Scalars['Date'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  modifiedAt: Scalars['Date'];
  tags: Array<Tag>;
  title: Scalars['String'];
  url: Scalars['String'];
};

export type BookmarkAlias = {
  __typename?: 'BookmarkAlias';
  bookmark: Bookmark;
  createdAt: Scalars['Date'];
  id: Scalars['Int'];
  modifiedAt: Scalars['Date'];
  pattern: Scalars['String'];
};

export type BookmarkContent = {
  category: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['Date'];
  id: Scalars['Int'];
  modifiedAt: Scalars['Date'];
  name: Scalars['String'];
  users: Array<UserCategory>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addBookmark: Bookmark;
  addCategory?: Maybe<Category>;
  addTag?: Maybe<Scalars['Void']>;
  addUsers?: Maybe<Scalars['Void']>;
  batchUpdateHostName?: Maybe<Scalars['Void']>;
  leaveCategory?: Maybe<Scalars['Void']>;
  login: Scalars['String'];
  removeTag?: Maybe<Scalars['Void']>;
  removeUser?: Maybe<Scalars['Void']>;
};


export type MutationAddBookmarkArgs = {
  input?: Maybe<BookmarkContent>;
};


export type MutationAddCategoryArgs = {
  name: Scalars['String'];
};


export type MutationAddTagArgs = {
  bookmarkId: Scalars['Int'];
  name: Scalars['String'];
};


export type MutationAddUsersArgs = {
  categoryId: Scalars['Int'];
  emails: Array<Scalars['String']>;
};


export type MutationBatchUpdateHostNameArgs = {
  categoryId: Scalars['Int'];
  newName: Scalars['String'];
  oldName: Scalars['String'];
};


export type MutationLeaveCategoryArgs = {
  id: Scalars['Int'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRemoveTagArgs = {
  bookmarkId: Scalars['Int'];
  name: Scalars['String'];
};


export type MutationRemoveUserArgs = {
  categoryId: Scalars['Int'];
  id: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  bookmarks: Array<Bookmark>;
  bookmarksForUrl: Array<Bookmark>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  isBookmarked?: Maybe<Scalars['Boolean']>;
  tags: Array<Tag>;
  users: Array<UserCategory>;
};


export type QueryBookmarksArgs = {
  categoryId: Scalars['Int'];
  orderBy?: Maybe<Scalars['JSON']>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryBookmarksForUrlArgs = {
  url: Scalars['String'];
};


export type QueryCategoriesArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type QueryCategoryArgs = {
  id: Scalars['Int'];
};


export type QueryIsBookmarkedArgs = {
  url: Scalars['String'];
};


export type QueryTagsArgs = {
  categoryId: Scalars['Int'];
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  where?: Maybe<Scalars['JSON']>;
};


export type QueryUsersArgs = {
  categoryId: Scalars['Int'];
};

export type Tag = {
  __typename?: 'Tag';
  bookmark: Bookmark;
  category: Category;
  categoryId: Scalars['Int'];
  createdAt: Scalars['Date'];
  createdBy: User;
  createdByCurrentUser: Scalars['Boolean'];
  createdById: Scalars['Int'];
  id: Scalars['Int'];
  modifiedAt: Scalars['Date'];
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Date'];
  email: Scalars['String'];
  id: Scalars['Int'];
  modifiedAt: Scalars['Date'];
};

export type UserCategory = {
  __typename?: 'UserCategory';
  active: Scalars['Boolean'];
  admin: Scalars['Boolean'];
  createdAt: Scalars['Date'];
  id: Scalars['Int'];
  modifiedAt: Scalars['Date'];
  user: User;
};

export type BookmarksVariables = Exact<{
  categoryId: Scalars['Int'];
  bookmarksSkip?: Maybe<Scalars['Int']>;
  bookmarksTake?: Maybe<Scalars['Int']>;
  bookmarksWhere?: Maybe<Scalars['JSON']>;
  bookmarksOrderBy?: Maybe<Scalars['JSON']>;
}>;


export type Bookmarks = { __typename?: 'Query', bookmarks: Array<{ __typename?: 'Bookmark', id: number, title: string, url: string, description?: string | null | undefined, createdAt: any, tags: Array<{ __typename?: 'Tag', id: number, createdByCurrentUser: boolean, name: string }> }> };

export type BookmarksForUrlVariables = Exact<{
  url: Scalars['String'];
}>;


export type BookmarksForUrl = { __typename?: 'Query', bookmarksForUrl: Array<{ __typename?: 'Bookmark', id: number, category: { __typename?: 'Category', id: number, name: string } }> };

export type CategoriesVariables = Exact<{ [key: string]: never; }>;


export type Categories = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, name: string }> };

export type AddCategoryVariables = Exact<{
  name: Scalars['String'];
}>;


export type AddCategory = { __typename?: 'Mutation', addCategory?: { __typename?: 'Category', id: number, name: string } | null | undefined };

export type LeaveCategoryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type LeaveCategory = { __typename?: 'Mutation', leaveCategory?: any | null | undefined };

export type TagsVariables = Exact<{
  categoryId: Scalars['Int'];
  tagsWhere?: Maybe<Scalars['JSON']>;
}>;


export type Tags = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', name: string }> };

export type AddTagVariables = Exact<{
  bookmarkId: Scalars['Int'];
  name: Scalars['String'];
}>;


export type AddTag = { __typename?: 'Mutation', addTag?: any | null | undefined };

export type RemoveTagVariables = Exact<{
  bookmarkId: Scalars['Int'];
  name: Scalars['String'];
}>;


export type RemoveTag = { __typename?: 'Mutation', removeTag?: any | null | undefined };

export type UsersVariables = Exact<{
  categoryId: Scalars['Int'];
}>;


export type Users = { __typename?: 'Query', users: Array<{ __typename?: 'UserCategory', id: number, active: boolean, admin: boolean, user: { __typename?: 'User', email: string } }> };

export type AddUsersVariables = Exact<{
  categoryId: Scalars['Int'];
  emails: Array<Scalars['String']> | Scalars['String'];
}>;


export type AddUsers = { __typename?: 'Mutation', addUsers?: any | null | undefined };

export type RemoveUserVariables = Exact<{
  categoryId: Scalars['Int'];
  id: Scalars['Int'];
}>;


export type RemoveUser = { __typename?: 'Mutation', removeUser?: any | null | undefined };


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
    tags {
      id
      createdByCurrentUser
      name
    }
  }
}
    `;
export const useBookmarks = <
      TData = Bookmarks,
      TError = Error
    >(
      variables: BookmarksVariables, 
      options?: UseQueryOptions<Bookmarks, TError, TData>
    ) => 
    useQuery<Bookmarks, TError, TData>(
      ['bookmarks', variables],
      fetchData<Bookmarks, BookmarksVariables>(BookmarksDocument, variables),
      options
    );
useBookmarks.getKey = (variables: BookmarksVariables) => ['bookmarks', variables];

export const BookmarksForUrlDocument = `
    query bookmarksForUrl($url: String!) {
  bookmarksForUrl(url: $url) {
    id
    category {
      id
      name
    }
  }
}
    `;
export const useBookmarksForUrl = <
      TData = BookmarksForUrl,
      TError = Error
    >(
      variables: BookmarksForUrlVariables, 
      options?: UseQueryOptions<BookmarksForUrl, TError, TData>
    ) => 
    useQuery<BookmarksForUrl, TError, TData>(
      ['bookmarksForUrl', variables],
      fetchData<BookmarksForUrl, BookmarksForUrlVariables>(BookmarksForUrlDocument, variables),
      options
    );
useBookmarksForUrl.getKey = (variables: BookmarksForUrlVariables) => ['bookmarksForUrl', variables];

export const CategoriesDocument = `
    query categories {
  categories {
    id
    name
  }
}
    `;
export const useCategories = <
      TData = Categories,
      TError = Error
    >(
      variables?: CategoriesVariables, 
      options?: UseQueryOptions<Categories, TError, TData>
    ) => 
    useQuery<Categories, TError, TData>(
      variables === undefined ? ['categories'] : ['categories', variables],
      fetchData<Categories, CategoriesVariables>(CategoriesDocument, variables),
      options
    );
useCategories.getKey = (variables?: CategoriesVariables) => variables === undefined ? ['categories'] : ['categories', variables];

export const AddCategoryDocument = `
    mutation addCategory($name: String!) {
  addCategory(name: $name) {
    id
    name
  }
}
    `;
export const useAddCategory = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<AddCategory, TError, AddCategoryVariables, TContext>) => 
    useMutation<AddCategory, TError, AddCategoryVariables, TContext>(
      (variables?: AddCategoryVariables) => fetchData<AddCategory, AddCategoryVariables>(AddCategoryDocument, variables)(),
      options
    );
export const LeaveCategoryDocument = `
    mutation leaveCategory($id: Int!) {
  leaveCategory(id: $id)
}
    `;
export const useLeaveCategory = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<LeaveCategory, TError, LeaveCategoryVariables, TContext>) => 
    useMutation<LeaveCategory, TError, LeaveCategoryVariables, TContext>(
      (variables?: LeaveCategoryVariables) => fetchData<LeaveCategory, LeaveCategoryVariables>(LeaveCategoryDocument, variables)(),
      options
    );
export const TagsDocument = `
    query tags($categoryId: Int!, $tagsWhere: JSON) {
  tags(categoryId: $categoryId, where: $tagsWhere, take: 20) {
    name
  }
}
    `;
export const useTags = <
      TData = Tags,
      TError = Error
    >(
      variables: TagsVariables, 
      options?: UseQueryOptions<Tags, TError, TData>
    ) => 
    useQuery<Tags, TError, TData>(
      ['tags', variables],
      fetchData<Tags, TagsVariables>(TagsDocument, variables),
      options
    );
useTags.getKey = (variables: TagsVariables) => ['tags', variables];

export const AddTagDocument = `
    mutation addTag($bookmarkId: Int!, $name: String!) {
  addTag(bookmarkId: $bookmarkId, name: $name)
}
    `;
export const useAddTag = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<AddTag, TError, AddTagVariables, TContext>) => 
    useMutation<AddTag, TError, AddTagVariables, TContext>(
      (variables?: AddTagVariables) => fetchData<AddTag, AddTagVariables>(AddTagDocument, variables)(),
      options
    );
export const RemoveTagDocument = `
    mutation removeTag($bookmarkId: Int!, $name: String!) {
  removeTag(bookmarkId: $bookmarkId, name: $name)
}
    `;
export const useRemoveTag = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveTag, TError, RemoveTagVariables, TContext>) => 
    useMutation<RemoveTag, TError, RemoveTagVariables, TContext>(
      (variables?: RemoveTagVariables) => fetchData<RemoveTag, RemoveTagVariables>(RemoveTagDocument, variables)(),
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
export const useUsers = <
      TData = Users,
      TError = Error
    >(
      variables: UsersVariables, 
      options?: UseQueryOptions<Users, TError, TData>
    ) => 
    useQuery<Users, TError, TData>(
      ['users', variables],
      fetchData<Users, UsersVariables>(UsersDocument, variables),
      options
    );
useUsers.getKey = (variables: UsersVariables) => ['users', variables];

export const AddUsersDocument = `
    mutation addUsers($categoryId: Int!, $emails: [String!]!) {
  addUsers(categoryId: $categoryId, emails: $emails)
}
    `;
export const useAddUsers = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<AddUsers, TError, AddUsersVariables, TContext>) => 
    useMutation<AddUsers, TError, AddUsersVariables, TContext>(
      (variables?: AddUsersVariables) => fetchData<AddUsers, AddUsersVariables>(AddUsersDocument, variables)(),
      options
    );
export const RemoveUserDocument = `
    mutation removeUser($categoryId: Int!, $id: Int!) {
  removeUser(categoryId: $categoryId, id: $id)
}
    `;
export const useRemoveUser = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveUser, TError, RemoveUserVariables, TContext>) => 
    useMutation<RemoveUser, TError, RemoveUserVariables, TContext>(
      (variables?: RemoveUserVariables) => fetchData<RemoveUser, RemoveUserVariables>(RemoveUserDocument, variables)(),
      options
    );