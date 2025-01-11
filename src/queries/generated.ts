import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useAuthenticatedFetcher } from './AuthProvider';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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

export type Activity = {
  __typename?: 'Activity';
  createdAt: Scalars['Date'];
  createdBy: User;
  createdById: Scalars['Int'];
  drama?: Maybe<Drama>;
  dramaId?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  message: Scalars['String'];
};

export type ActivityQueryResponse = {
  __typename?: 'ActivityQueryResponse';
  data: Array<Activity>;
  meta: PaginationInfo;
};

export type CreateDramaContent = {
  country?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  episodeCount?: InputMaybe<Scalars['Int']>;
  episodeDuration?: InputMaybe<Scalars['Int']>;
  finishedAiringAt?: InputMaybe<Scalars['Date']>;
  links?: InputMaybe<Array<Scalars['String']>>;
  startedAiringAt?: InputMaybe<Scalars['Date']>;
  status?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  title?: InputMaybe<Scalars['String']>;
  watched?: InputMaybe<Scalars['String']>;
};

export type CreateUserInput = {
  admin?: InputMaybe<Scalars['Boolean']>;
  email: Scalars['String'];
};

export type Drama = {
  __typename?: 'Drama';
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  createdBy: User;
  createdById: Scalars['Int'];
  currentUserWatched?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  episodeCount?: Maybe<Scalars['Int']>;
  episodeDuration?: Maybe<Scalars['Int']>;
  finishedAiringAt?: Maybe<Scalars['Date']>;
  groupedTags: Array<GroupedTag>;
  id: Scalars['Int'];
  lastModifiedAt: Scalars['Date'];
  lastModifiedBy: User;
  lastModifiedById: Scalars['Int'];
  links: Array<Link>;
  startedAiringAt?: Maybe<Scalars['Date']>;
  status: Scalars['String'];
  tags: Array<Tag>;
  title: Scalars['String'];
  watched: Array<Watched>;
};

export type DramasQueryResponse = {
  __typename?: 'DramasQueryResponse';
  data: Array<Drama>;
  meta: PaginationInfo;
};

export type GroupedTag = {
  __typename?: 'GroupedTag';
  count: Scalars['Int'];
  current: Scalars['Boolean'];
  name: Scalars['String'];
};

export type Link = {
  __typename?: 'Link';
  createdAt: Scalars['Date'];
  createdBy: User;
  createdById: Scalars['Int'];
  id: Scalars['Int'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addDrama?: Maybe<Drama>;
  addUser?: Maybe<User>;
  removeDrama?: Maybe<Scalars['Void']>;
  removeUser?: Maybe<Scalars['Void']>;
  updateDrama?: Maybe<Scalars['Void']>;
};


export type MutationAddDramaArgs = {
  input: CreateDramaContent;
};


export type MutationAddUserArgs = {
  email: Scalars['String'];
};


export type MutationRemoveDramaArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveUserArgs = {
  email: Scalars['String'];
};


export type MutationUpdateDramaArgs = {
  id: Scalars['Int'];
  input: CreateDramaContent;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  count: Scalars['Int'];
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
  total: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  activity: ActivityQueryResponse;
  currentUser: User;
  drama?: Maybe<Drama>;
  dramas: DramasQueryResponse;
  dump?: Maybe<Scalars['JSON']>;
  isDramaBookmarked?: Maybe<Scalars['Int']>;
  tags: Array<Tag>;
  users: Array<User>;
};


export type QueryActivityArgs = {
  orderBy?: InputMaybe<Scalars['JSON']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};


export type QueryDramaArgs = {
  id: Scalars['Int'];
};


export type QueryDramasArgs = {
  orderBy?: InputMaybe<Scalars['JSON']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};


export type QueryIsDramaBookmarkedArgs = {
  url: Scalars['String'];
};


export type QueryTagsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Scalars['JSON']>;
};

export type Tag = {
  __typename?: 'Tag';
  createdAt: Scalars['Date'];
  createdBy: User;
  createdByCurrentUser?: Maybe<Scalars['Boolean']>;
  createdById: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type UpdateLinkContent = {
  url: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  admin: Scalars['Boolean'];
  createdAt: Scalars['Date'];
  createdBy?: Maybe<User>;
  createdById?: Maybe<Scalars['Int']>;
  email: Scalars['String'];
  id: Scalars['Int'];
  modifiedAt: Scalars['Date'];
};

export type Watched = {
  __typename?: 'Watched';
  createdAt: Scalars['Date'];
  createdBy: User;
  createdById: Scalars['Int'];
  id: Scalars['Int'];
  lastModifiedAt: Scalars['Date'];
  status?: Maybe<Scalars['String']>;
};

export type FetchUsersVariables = Exact<{ [key: string]: never; }>;


export type FetchUsers = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: number, createdAt: any, email: string, admin: boolean, createdBy?: { __typename?: 'User', email: string } | null }> };

export type FetchCurrentUserVariables = Exact<{ [key: string]: never; }>;


export type FetchCurrentUser = { __typename?: 'Query', currentUser: { __typename?: 'User', id: number, createdAt: any, email: string, admin: boolean } };

export type AddUserVariables = Exact<{
  email: Scalars['String'];
}>;


export type AddUser = { __typename?: 'Mutation', addUser?: { __typename?: 'User', id: number } | null };

export type RemoveUserVariables = Exact<{
  email: Scalars['String'];
}>;


export type RemoveUser = { __typename?: 'Mutation', removeUser?: any | null };

export type FetchDramasVariables = Exact<{
  where?: InputMaybe<Scalars['JSON']>;
  take?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['JSON']>;
}>;


export type FetchDramas = { __typename?: 'Query', dramas: { __typename?: 'DramasQueryResponse', meta: { __typename?: 'PaginationInfo', total: number, count: number, skip?: number | null, take?: number | null }, data: Array<{ __typename?: 'Drama', title: string, lastModifiedAt: any, finishedAiringAt?: any | null, startedAiringAt?: any | null, country?: string | null, episodeCount?: number | null, episodeDuration?: number | null, id: number, description: string, createdAt: any, status: string, currentUserWatched?: string | null, tags: Array<{ __typename?: 'Tag', name: string, createdBy: { __typename?: 'User', email: string } }>, groupedTags: Array<{ __typename?: 'GroupedTag', name: string, count: number, current: boolean }>, createdBy: { __typename?: 'User', email: string }, lastModifiedBy: { __typename?: 'User', email: string }, links: Array<{ __typename?: 'Link', url: string, createdAt: any, title: string, createdBy: { __typename?: 'User', email: string, createdAt: any } }>, watched: Array<{ __typename?: 'Watched', status?: string | null, lastModifiedAt: any, createdBy: { __typename?: 'User', email: string } }> }> } };

export type AddDramaVariables = Exact<{
  input: CreateDramaContent;
}>;


export type AddDrama = { __typename?: 'Mutation', addDrama?: { __typename?: 'Drama', id: number } | null };

export type RemoveDramaVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveDrama = { __typename?: 'Mutation', removeDrama?: any | null };

export type UpdateDramaVariables = Exact<{
  id: Scalars['Int'];
  input: CreateDramaContent;
}>;


export type UpdateDrama = { __typename?: 'Mutation', updateDrama?: any | null };

export type IsDramaBookmarkedVariables = Exact<{
  url: Scalars['String'];
}>;


export type IsDramaBookmarked = { __typename?: 'Query', isDramaBookmarked?: number | null };

export type FetchActivityVariables = Exact<{
  where?: InputMaybe<Scalars['JSON']>;
  take?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['JSON']>;
}>;


export type FetchActivity = { __typename?: 'Query', activity: { __typename?: 'ActivityQueryResponse', data: Array<{ __typename?: 'Activity', id: number, message: string, createdAt: any, dramaId?: number | null, createdBy: { __typename?: 'User', email: string }, drama?: { __typename?: 'Drama', title: string } | null }>, meta: { __typename?: 'PaginationInfo', total: number, take?: number | null, count: number, skip?: number | null } } };

export type FetchTagsVariables = Exact<{ [key: string]: never; }>;


export type FetchTags = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', name: string }> };

export type DumpDataVariables = Exact<{ [key: string]: never; }>;


export type DumpData = { __typename?: 'Query', dump?: any | null };


export const FetchUsersDocument = `
    query fetchUsers {
  users {
    id
    createdAt
    createdBy {
      email
    }
    email
    admin
  }
}
    `;
export const useFetchUsers = <
      TData = FetchUsers,
      TError = Error
    >(
      variables?: FetchUsersVariables,
      options?: UseQueryOptions<FetchUsers, TError, TData>
    ) =>
    useQuery<FetchUsers, TError, TData>(
      variables === undefined ? ['fetchUsers'] : ['fetchUsers', variables],
      useAuthenticatedFetcher<FetchUsers, FetchUsersVariables>(FetchUsersDocument).bind(null, variables),
      options
    );

useFetchUsers.getKey = (variables?: FetchUsersVariables) => variables === undefined ? ['fetchUsers'] : ['fetchUsers', variables];
;

export const FetchCurrentUserDocument = `
    query fetchCurrentUser {
  currentUser {
    id
    createdAt
    email
    admin
  }
}
    `;
export const useFetchCurrentUser = <
      TData = FetchCurrentUser,
      TError = Error
    >(
      variables?: FetchCurrentUserVariables,
      options?: UseQueryOptions<FetchCurrentUser, TError, TData>
    ) =>
    useQuery<FetchCurrentUser, TError, TData>(
      variables === undefined ? ['fetchCurrentUser'] : ['fetchCurrentUser', variables],
      useAuthenticatedFetcher<FetchCurrentUser, FetchCurrentUserVariables>(FetchCurrentUserDocument).bind(null, variables),
      options
    );

useFetchCurrentUser.getKey = (variables?: FetchCurrentUserVariables) => variables === undefined ? ['fetchCurrentUser'] : ['fetchCurrentUser', variables];
;

export const AddUserDocument = `
    mutation addUser($email: String!) {
  addUser(email: $email) {
    id
  }
}
    `;
export const useAddUser = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<AddUser, TError, AddUserVariables, TContext>) =>
    useMutation<AddUser, TError, AddUserVariables, TContext>(
      ['addUser'],
      useAuthenticatedFetcher<AddUser, AddUserVariables>(AddUserDocument),
      options
    );
export const RemoveUserDocument = `
    mutation removeUser($email: String!) {
  removeUser(email: $email)
}
    `;
export const useRemoveUser = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveUser, TError, RemoveUserVariables, TContext>) =>
    useMutation<RemoveUser, TError, RemoveUserVariables, TContext>(
      ['removeUser'],
      useAuthenticatedFetcher<RemoveUser, RemoveUserVariables>(RemoveUserDocument),
      options
    );
export const FetchDramasDocument = `
    query fetchDramas($where: JSON, $take: Int, $skip: Int, $orderBy: JSON) {
  dramas(where: $where, take: $take, skip: $skip, orderBy: $orderBy) {
    meta {
      total
      count
      skip
      take
    }
    data {
      title
      tags {
        name
        createdBy {
          email
        }
      }
      groupedTags {
        name
        count
        current
      }
      createdBy {
        email
      }
      lastModifiedAt
      lastModifiedBy {
        email
      }
      finishedAiringAt
      startedAiringAt
      country
      episodeCount
      episodeDuration
      links {
        url
        createdAt
        title
        createdBy {
          email
          createdAt
        }
      }
      id
      description
      createdAt
      status
      watched {
        createdBy {
          email
        }
        status
        lastModifiedAt
      }
      currentUserWatched
    }
  }
}
    `;
export const useFetchDramas = <
      TData = FetchDramas,
      TError = Error
    >(
      variables?: FetchDramasVariables,
      options?: UseQueryOptions<FetchDramas, TError, TData>
    ) =>
    useQuery<FetchDramas, TError, TData>(
      variables === undefined ? ['fetchDramas'] : ['fetchDramas', variables],
      useAuthenticatedFetcher<FetchDramas, FetchDramasVariables>(FetchDramasDocument).bind(null, variables),
      options
    );

useFetchDramas.getKey = (variables?: FetchDramasVariables) => variables === undefined ? ['fetchDramas'] : ['fetchDramas', variables];
;

export const AddDramaDocument = `
    mutation addDrama($input: CreateDramaContent!) {
  addDrama(input: $input) {
    id
  }
}
    `;
export const useAddDrama = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<AddDrama, TError, AddDramaVariables, TContext>) =>
    useMutation<AddDrama, TError, AddDramaVariables, TContext>(
      ['addDrama'],
      useAuthenticatedFetcher<AddDrama, AddDramaVariables>(AddDramaDocument),
      options
    );
export const RemoveDramaDocument = `
    mutation removeDrama($id: Int!) {
  removeDrama(id: $id)
}
    `;
export const useRemoveDrama = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveDrama, TError, RemoveDramaVariables, TContext>) =>
    useMutation<RemoveDrama, TError, RemoveDramaVariables, TContext>(
      ['removeDrama'],
      useAuthenticatedFetcher<RemoveDrama, RemoveDramaVariables>(RemoveDramaDocument),
      options
    );
export const UpdateDramaDocument = `
    mutation updateDrama($id: Int!, $input: CreateDramaContent!) {
  updateDrama(id: $id, input: $input)
}
    `;
export const useUpdateDrama = <
      TError = Error,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateDrama, TError, UpdateDramaVariables, TContext>) =>
    useMutation<UpdateDrama, TError, UpdateDramaVariables, TContext>(
      ['updateDrama'],
      useAuthenticatedFetcher<UpdateDrama, UpdateDramaVariables>(UpdateDramaDocument),
      options
    );
export const IsDramaBookmarkedDocument = `
    query isDramaBookmarked($url: String!) {
  isDramaBookmarked(url: $url)
}
    `;
export const useIsDramaBookmarked = <
      TData = IsDramaBookmarked,
      TError = Error
    >(
      variables: IsDramaBookmarkedVariables,
      options?: UseQueryOptions<IsDramaBookmarked, TError, TData>
    ) =>
    useQuery<IsDramaBookmarked, TError, TData>(
      ['isDramaBookmarked', variables],
      useAuthenticatedFetcher<IsDramaBookmarked, IsDramaBookmarkedVariables>(IsDramaBookmarkedDocument).bind(null, variables),
      options
    );

useIsDramaBookmarked.getKey = (variables: IsDramaBookmarkedVariables) => ['isDramaBookmarked', variables];
;

export const FetchActivityDocument = `
    query fetchActivity($where: JSON, $take: Int, $skip: Int, $orderBy: JSON) {
  activity(where: $where, take: $take, skip: $skip, orderBy: $orderBy) {
    data {
      id
      message
      createdBy {
        email
      }
      createdAt
      dramaId
      drama {
        title
      }
    }
    meta {
      total
      take
      count
      skip
    }
  }
}
    `;
export const useFetchActivity = <
      TData = FetchActivity,
      TError = Error
    >(
      variables?: FetchActivityVariables,
      options?: UseQueryOptions<FetchActivity, TError, TData>
    ) =>
    useQuery<FetchActivity, TError, TData>(
      variables === undefined ? ['fetchActivity'] : ['fetchActivity', variables],
      useAuthenticatedFetcher<FetchActivity, FetchActivityVariables>(FetchActivityDocument).bind(null, variables),
      options
    );

useFetchActivity.getKey = (variables?: FetchActivityVariables) => variables === undefined ? ['fetchActivity'] : ['fetchActivity', variables];
;

export const FetchTagsDocument = `
    query fetchTags {
  tags(take: 100) {
    name
  }
}
    `;
export const useFetchTags = <
      TData = FetchTags,
      TError = Error
    >(
      variables?: FetchTagsVariables,
      options?: UseQueryOptions<FetchTags, TError, TData>
    ) =>
    useQuery<FetchTags, TError, TData>(
      variables === undefined ? ['fetchTags'] : ['fetchTags', variables],
      useAuthenticatedFetcher<FetchTags, FetchTagsVariables>(FetchTagsDocument).bind(null, variables),
      options
    );

useFetchTags.getKey = (variables?: FetchTagsVariables) => variables === undefined ? ['fetchTags'] : ['fetchTags', variables];
;

export const DumpDataDocument = `
    query dumpData {
  dump
}
    `;
export const useDumpData = <
      TData = DumpData,
      TError = Error
    >(
      variables?: DumpDataVariables,
      options?: UseQueryOptions<DumpData, TError, TData>
    ) =>
    useQuery<DumpData, TError, TData>(
      variables === undefined ? ['dumpData'] : ['dumpData', variables],
      useAuthenticatedFetcher<DumpData, DumpDataVariables>(DumpDataDocument).bind(null, variables),
      options
    );

useDumpData.getKey = (variables?: DumpDataVariables) => variables === undefined ? ['dumpData'] : ['dumpData', variables];
;
