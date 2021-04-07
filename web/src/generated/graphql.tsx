import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

export type Query = {
    __typename?: "Query";
    posts: PaginatedPosts;
    post?: Maybe<Post>;
    me?: Maybe<User>;
};

export type QueryPostsArgs = {
    cursor?: Maybe<Scalars["Int"]>;
    limit: Scalars["Int"];
};

export type QueryPostArgs = {
    id: Scalars["Int"];
};

export type PaginatedPosts = {
    __typename?: "PaginatedPosts";
    posts: Array<Post>;
    hasMore: Scalars["Boolean"];
};

export type Post = {
    __typename?: "Post";
    createdAt: Scalars["String"];
    updatedAt: Scalars["String"];
    deletedAt?: Maybe<Scalars["String"]>;
    isDelete: Scalars["Boolean"];
    id: Scalars["Float"];
    title: Scalars["String"];
    content: Scalars["String"];
    reactionStatus?: Maybe<Scalars["Int"]>;
    likes: Scalars["Float"];
    dislikes: Scalars["Float"];
    author?: Maybe<User>;
    reactions?: Maybe<Reaction>;
    contentSnippet: Scalars["String"];
};

export type User = {
    __typename?: "User";
    createdAt: Scalars["String"];
    updatedAt: Scalars["String"];
    deletedAt?: Maybe<Scalars["String"]>;
    isDelete: Scalars["Boolean"];
    id: Scalars["Float"];
    email: Scalars["String"];
    name: Scalars["String"];
    posts: Post;
    reactions?: Maybe<Reaction>;
};

export type Reaction = {
    __typename?: "Reaction";
    createdAt: Scalars["String"];
    updatedAt: Scalars["String"];
    deletedAt?: Maybe<Scalars["String"]>;
    isDelete: Scalars["Boolean"];
    id: Scalars["Float"];
    value?: Maybe<Scalars["Int"]>;
    user: User;
    post: Post;
};

export type Mutation = {
    __typename?: "Mutation";
    createPost: Post;
    updatePost: Post;
    deletePost: Scalars["Boolean"];
    changePassword: UserResponse;
    forgotPassword: Scalars["Boolean"];
    register: UserResponse;
    login: UserResponse;
    logout: Scalars["Boolean"];
    reaction: Scalars["Boolean"];
};

export type MutationCreatePostArgs = {
    input: PostInput;
};

export type MutationUpdatePostArgs = {
    content?: Maybe<Scalars["String"]>;
    title?: Maybe<Scalars["String"]>;
    id: Scalars["Int"];
};

export type MutationDeletePostArgs = {
    id: Scalars["Int"];
};

export type MutationChangePasswordArgs = {
    newPassword: Scalars["String"];
    token: Scalars["String"];
};

export type MutationForgotPasswordArgs = {
    email: Scalars["String"];
};

export type MutationRegisterArgs = {
    options: RegisterInput;
};

export type MutationLoginArgs = {
    options: LoginInput;
};

export type MutationReactionArgs = {
    value: Scalars["Int"];
    postId: Scalars["Int"];
};

export type PostInput = {
    title: Scalars["String"];
    content: Scalars["String"];
};

export type UserResponse = {
    __typename?: "UserResponse";
    errors?: Maybe<Array<FieldError>>;
    user?: Maybe<User>;
};

export type FieldError = {
    __typename?: "FieldError";
    field: Scalars["String"];
    message: Scalars["String"];
};

export type RegisterInput = {
    email: Scalars["String"];
    password: Scalars["String"];
    name: Scalars["String"];
};

export type LoginInput = {
    email: Scalars["String"];
    password: Scalars["String"];
};

export type RegularErrorFragment = { __typename?: "FieldError" } & Pick<FieldError, "field" | "message">;

export type RegularPostFragment = { __typename?: "Post" } & Pick<
    Post,
    "id" | "title" | "content" | "contentSnippet" | "likes" | "dislikes" | "createdAt" | "reactionStatus"
> & { author?: Maybe<{ __typename?: "User" } & RegularUserFragment> };

export type RegularUserResponseFragment = { __typename?: "UserResponse" } & {
    errors?: Maybe<Array<{ __typename?: "FieldError" } & RegularErrorFragment>>;
    user?: Maybe<{ __typename?: "User" } & RegularUserFragment>;
};

export type RegularUserFragment = { __typename?: "User" } & Pick<User, "id" | "email" | "name">;

export type ChangePasswordMutationVariables = Exact<{
    token: Scalars["String"];
    newPassword: Scalars["String"];
}>;

export type ChangePasswordMutation = { __typename?: "Mutation" } & {
    changePassword: { __typename?: "UserResponse" } & RegularUserResponseFragment;
};

export type CreatePostMutationVariables = Exact<{
    input: PostInput;
}>;

export type CreatePostMutation = { __typename?: "Mutation" } & { createPost: { __typename?: "Post" } & RegularPostFragment };

export type DeletePostMutationVariables = Exact<{
    id: Scalars["Int"];
}>;

export type DeletePostMutation = { __typename?: "Mutation" } & Pick<Mutation, "deletePost">;

export type ForgotPasswordMutationVariables = Exact<{
    email: Scalars["String"];
}>;

export type ForgotPasswordMutation = { __typename?: "Mutation" } & Pick<Mutation, "forgotPassword">;

export type LoginMutationVariables = Exact<{
    options: LoginInput;
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
    login: { __typename?: "UserResponse" } & RegularUserResponseFragment;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<Mutation, "logout">;

export type ReactionMutationVariables = Exact<{
    postId: Scalars["Int"];
    value: Scalars["Int"];
}>;

export type ReactionMutation = { __typename?: "Mutation" } & Pick<Mutation, "reaction">;

export type RegisterMutationVariables = Exact<{
    options: RegisterInput;
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
    register: { __typename?: "UserResponse" } & RegularUserResponseFragment;
};

export type UpdatePostMutationVariables = Exact<{
    id: Scalars["Int"];
    title: Scalars["String"];
    content: Scalars["String"];
}>;

export type UpdatePostMutation = { __typename?: "Mutation" } & { updatePost: { __typename?: "Post" } & RegularPostFragment };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: "Query" } & { me?: Maybe<{ __typename?: "User" } & RegularUserFragment> };

export type PostQueryVariables = Exact<{
    id: Scalars["Int"];
}>;

export type PostQuery = { __typename?: "Query" } & { post?: Maybe<{ __typename?: "Post" } & RegularPostFragment> };

export type PostsQueryVariables = Exact<{
    limit: Scalars["Int"];
    cursor?: Maybe<Scalars["Int"]>;
}>;

export type PostsQuery = { __typename?: "Query" } & {
    posts: { __typename?: "PaginatedPosts" } & Pick<PaginatedPosts, "hasMore"> & {
            posts: Array<{ __typename?: "Post" } & RegularPostFragment>;
        };
};

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
        id
        email
        name
    }
`;
export const RegularPostFragmentDoc = gql`
    fragment RegularPost on Post {
        id
        title
        content
        contentSnippet
        likes
        dislikes
        createdAt
        reactionStatus
        author {
            ...RegularUser
        }
    }
    ${RegularUserFragmentDoc}
`;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
        field
        message
    }
`;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
        errors {
            ...RegularError
        }
        user {
            ...RegularUser
        }
    }
    ${RegularErrorFragmentDoc}
    ${RegularUserFragmentDoc}
`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
        changePassword(token: $token, newPassword: $newPassword) {
            ...RegularUserResponse
        }
    }
    ${RegularUserResponseFragmentDoc}
`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(
    baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
}
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
        createPost(input: $input) {
            ...RegularPost
        }
    }
    ${RegularPostFragmentDoc}
`;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
}
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
        deletePost(id: $id)
    }
`;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
}
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(
    baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>
) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
}
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($options: LoginInput!) {
        login(options: $options) {
            ...RegularUserResponse
        }
    }
    ${RegularUserResponseFragmentDoc}
`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
        logout
    }
`;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const ReactionDocument = gql`
    mutation Reaction($postId: Int!, $value: Int!) {
        reaction(postId: $postId, value: $value)
    }
`;
export type ReactionMutationFn = Apollo.MutationFunction<ReactionMutation, ReactionMutationVariables>;

/**
 * __useReactionMutation__
 *
 * To run a mutation, you first call `useReactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reactionMutation, { data, loading, error }] = useReactionMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useReactionMutation(baseOptions?: Apollo.MutationHookOptions<ReactionMutation, ReactionMutationVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<ReactionMutation, ReactionMutationVariables>(ReactionDocument, options);
}
export type ReactionMutationHookResult = ReturnType<typeof useReactionMutation>;
export type ReactionMutationResult = Apollo.MutationResult<ReactionMutation>;
export type ReactionMutationOptions = Apollo.BaseMutationOptions<ReactionMutation, ReactionMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: RegisterInput!) {
        register(options: $options) {
            ...RegularUserResponse
        }
    }
    ${RegularUserResponseFragmentDoc}
`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $content: String!) {
        updatePost(id: $id, title: $title, content: $content) {
            ...RegularPost
        }
    }
    ${RegularPostFragmentDoc}
`;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, options);
}
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const MeDocument = gql`
    query Me {
        me {
            ...RegularUser
        }
    }
    ${RegularUserFragmentDoc}
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PostDocument = gql`
    query Post($id: Int!) {
        post(id: $id) {
            ...RegularPost
        }
    }
    ${RegularPostFragmentDoc}
`;

/**
 * __usePostQuery__
 *
 * To run a query within a React component, call `usePostQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePostQuery(baseOptions: Apollo.QueryHookOptions<PostQuery, PostQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<PostQuery, PostQueryVariables>(PostDocument, options);
}
export function usePostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostQuery, PostQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<PostQuery, PostQueryVariables>(PostDocument, options);
}
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostQueryResult = Apollo.QueryResult<PostQuery, PostQueryVariables>;
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: Int) {
        posts(limit: $limit, cursor: $cursor) {
            posts {
                ...RegularPost
            }
            hasMore
        }
    }
    ${RegularPostFragmentDoc}
`;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function usePostsQuery(baseOptions: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
}
export function usePostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>) {
    const options = { ...defaultOptions, ...baseOptions };
    return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
}
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<PostsQuery, PostsQueryVariables>;
