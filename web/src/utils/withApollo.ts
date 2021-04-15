import { withApollo as createWithApollo } from "next-apollo";
import { InMemoryCache } from "@apollo/client";
import { ApolloClient } from "@apollo/client";
import { PaginatedPosts } from "generated/graphql";
import { NextPageContext } from "next";
import { isServer } from "./isServer";
import { createUploadLink } from "apollo-upload-client";
import { __prod__ } from "../constants";

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
        connectToDevTools: !__prod__,
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        posts: {
                            keyArgs: false,
                            merge(existing: PaginatedPosts | undefined, incoming: PaginatedPosts, options): PaginatedPosts {
                                // cursor 값이 존재하는 경우
                                // => 다음 페이지의 데이터를 불러오는 경우
                                if (options.variables?.cursor) {
                                    return {
                                        ...incoming,
                                        posts: [...(existing?.posts || []), ...incoming.posts]
                                    };
                                }

                                return { ...incoming };
                            }
                        }
                    }
                }
            }
        })
    });
};

export const withApollo = createWithApollo(apolloClient);
