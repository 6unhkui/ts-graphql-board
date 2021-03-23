import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
    posts: Array<Post>;
    post?: Maybe<Post>;
    me?: Maybe<User>;
};

export type QueryPostArgs = {
    id: Scalars["Int"];
};

export type Post = {
    __typename?: "Post";
    createdAt: Scalars["String"];
    updatedAt: Scalars["String"];
    deletedAt?: Maybe<Scalars["String"]>;
    isDelete: Scalars["Boolean"];
    id: Scalars["Float"];
    title: Scalars["String"];
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
};

export type MutationCreatePostArgs = {
    title: Scalars["String"];
};

export type MutationUpdatePostArgs = {
    title?: Maybe<Scalars["String"]>;
    id: Scalars["Float"];
};

export type MutationDeletePostArgs = {
    id: Scalars["Float"];
};

export type MutationChangePasswordArgs = {
    newPassword: Scalars["String"];
    token: Scalars["String"];
};

export type MutationForgotPasswordArgs = {
    email: Scalars["String"];
};

export type MutationRegisterArgs = {
    options: RegisterDto;
};

export type MutationLoginArgs = {
    options: LoginDto;
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

export type RegisterDto = {
    email: Scalars["String"];
    password: Scalars["String"];
    name: Scalars["String"];
};

export type LoginDto = {
    email: Scalars["String"];
    password: Scalars["String"];
};

export type RegularErrorFragment = { __typename?: "FieldError" } & Pick<FieldError, "field" | "message">;

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

export type ForgotPasswordMutationVariables = Exact<{
    email: Scalars["String"];
}>;

export type ForgotPasswordMutation = { __typename?: "Mutation" } & Pick<Mutation, "forgotPassword">;

export type LoginMutationVariables = Exact<{
    options: LoginDto;
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
    login: { __typename?: "UserResponse" } & RegularUserResponseFragment;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<Mutation, "logout">;

export type RegisterMutationVariables = Exact<{
    options: RegisterDto;
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
    register: { __typename?: "UserResponse" } & RegularUserResponseFragment;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: "Query" } & { me?: Maybe<{ __typename?: "User" } & RegularUserFragment> };

export type PostsQueryVariables = Exact<{ [key: string]: never }>;

export type PostsQuery = { __typename?: "Query" } & {
    posts: Array<{ __typename?: "Post" } & Pick<Post, "id" | "title" | "createdAt" | "updatedAt">>;
};

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
        field
        message
    }
`;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
        id
        email
        name
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

export function useChangePasswordMutation() {
    return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
}
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`;

export function useForgotPasswordMutation() {
    return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
}
export const LoginDocument = gql`
    mutation Login($options: LoginDTO!) {
        login(options: $options) {
            ...RegularUserResponse
        }
    }
    ${RegularUserResponseFragmentDoc}
`;

export function useLoginMutation() {
    return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const LogoutDocument = gql`
    mutation Logout {
        logout
    }
`;

export function useLogoutMutation() {
    return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
}
export const RegisterDocument = gql`
    mutation Register($options: RegisterDTO!) {
        register(options: $options) {
            ...RegularUserResponse
        }
    }
    ${RegularUserResponseFragmentDoc}
`;

export function useRegisterMutation() {
    return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
}
export const MeDocument = gql`
    query Me {
        me {
            ...RegularUser
        }
    }
    ${RegularUserFragmentDoc}
`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, "query"> = {}) {
    return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
}
export const PostsDocument = gql`
    query Posts {
        posts {
            id
            title
            createdAt
            updatedAt
        }
    }
`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, "query"> = {}) {
    return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
}
