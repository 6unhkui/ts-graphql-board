import { withApollo as createWithApollo } from "next-apollo";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { PaginatedPosts } from "generated/graphql";
import { NextPageContext } from "next";
import { isServer } from "./isServer";
import { createUploadLink } from "apollo-upload-client";

const apolloClient = (ctx: NextPageContext) => {
    let cookie = "";
    if (isServer()) {
        cookie = ctx?.req?.headers?.cookie;
    }

    return new ApolloClient({
        link: createUploadLink({
            uri: process.env.NEXT_PUBLIC_API_URL as string,
            credentials: "include",
            headers: {
                cookie
            }
        }),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        posts: {
                            keyArgs: [],
                            merge(existing: PaginatedPosts | undefined, incoming: PaginatedPosts): PaginatedPosts {
                                return {
                                    ...incoming,
                                    posts: [...(existing?.posts || []), ...incoming.posts]
                                };
                            }
                        }
                    }
                }
            }
        })
    });
};

export const withApollo = createWithApollo(apolloClient);
