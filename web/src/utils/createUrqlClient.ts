import { isServer } from "./isServer";
import { DeletePostMutationVariables, ReactionMutationVariables, UpdatePostMutationVariables } from "./../generated/graphql";
import { dedupExchange, fetchExchange, gql, stringifyVariables } from "@urql/core";
import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import { ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from "generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import { Exchange } from "urql";
import Router from "next/router";

const errorExchange: Exchange = ({ forward }) => ops$ => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            if (error) {
                if (error?.message.includes("not authenticated")) {
                    Router.replace("/login");
                }
            }
        })
    );
};

const simplePagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;

        const allFields = cache.inspectFields(entityKey);
        const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }

        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isItInTheCache = cache.resolve(cache.resolve(entityKey, fieldKey) as string, "posts");
        info.partial = !isItInTheCache;

        let hasMore = true;
        const results = fieldInfos.reduce((acc: string[], fi) => {
            const key = cache.resolve(entityKey, fi.fieldKey) as string;
            const data = cache.resolve(key, "posts") as string[];
            const _hasMore = cache.resolve(key, "hasMore");
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }
            acc.push(...data);
            return acc;
        }, []);

        return {
            __typename: "PaginatedPosts",
            hasMore,
            posts: results
        };
    };
};

function invalidateAllPosts(cache: Cache) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter(info => (info.fieldName = "posts"));
    fieldInfos.forEach(fi => {
        cache.invalidate("Query", "posts", fi.arguments || {});
    });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = "";
    if (isServer()) {
        cookie = ctx?.req?.headers?.cookie;
    }

    return {
        url: process.env.NEXT_PUBLIC_API_URL as string,
        fetchOptions: {
            credentials: "include" as const,
            headers: cookie ? { cookie } : undefined
        },
        exchanges: [
            dedupExchange,
            cacheExchange({
                resolvers: {
                    Query: {
                        posts: simplePagination()
                    }
                },
                updates: {
                    Mutation: {
                        logout: (_result, args, cache, info) => {
                            betterUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, _result, () => ({
                                me: null
                            }));
                        },
                        login: (_result, args, cache, info) => {
                            betterUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
                                if (result.login.errors) {
                                    return query;
                                } else {
                                    return {
                                        me: result.login.user
                                    };
                                }
                            });
                            invalidateAllPosts(cache);
                        },
                        register: (_result, args, cache, info) => {
                            betterUpdateQuery<RegisterMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                (result, query) => {
                                    if (result.register.errors) {
                                        return query;
                                    } else {
                                        return {
                                            me: result.register.user
                                        };
                                    }
                                }
                            );
                        },
                        changePassword: (_result, args, cache, info) => {
                            betterUpdateQuery<ChangePasswordMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                (result, query) => {
                                    if (result.changePassword.errors) {
                                        return query;
                                    } else {
                                        return {
                                            me: result.changePassword.user
                                        };
                                    }
                                }
                            );
                        },
                        createPost: (_result, args, cache, info) => {
                            invalidateAllPosts(cache);
                        },
                        reaction: (_result, args, cache, info) => {
                            const { postId, value } = args as ReactionMutationVariables;
                            const data = cache.readFragment(
                                gql`
                                    fragment _ on Post {
                                        id
                                        likes
                                        dislikes
                                        reactionStatus
                                    }
                                `,
                                { id: postId }
                            ) as any;

                            if (data) {
                                let [newLike, newDislike] = [data.likes as number, data.dislikes as number];
                                const reactionStatus = data.reactionStatus as number;
                                const isLike = value === 1;

                                if (reactionStatus === 0) {
                                    // 1. 해당 글에 대해 이전 리액션이 없었을 때
                                    if (isLike) {
                                        // 이전 값이 좋아요면 좋아요 값을 -1
                                        newLike += 1;
                                    } else {
                                        // 이전 값이 싫어요면 싫어요 값을 -1
                                        newDislike += 1;
                                    }
                                } else if (reactionStatus !== value) {
                                    // 2. 해당 글에 대해 이전과 다른 리액션을 취했을 때
                                    // 값이 바뀌었기 때문에 이전 값은 -1 해줘야 함
                                    if (reactionStatus === 1) {
                                        newLike -= 1;
                                    } else if (reactionStatus === -1) {
                                        newDislike -= 1;
                                    }

                                    // 2-1. 반대 값을 누른 경우 (like -> dislike | dislike -> like)
                                    if (value !== 0) {
                                        if (value === 1) newLike += 1;
                                        else if (value === -1) newDislike += 1;
                                    }
                                }

                                cache.writeFragment(
                                    gql`
                                        fragment _ on Post {
                                            likes
                                            dislikes
                                            reactionStatus
                                        }
                                    `,
                                    { id: postId, likes: newLike, dislikes: newDislike, reactionStatus: value } as any
                                );
                            }
                        },
                        deletePost: (_result, args, cache, info) => {
                            cache.invalidate({ __typename: "Post", id: (args as DeletePostMutationVariables).id });
                        },
                        updatePost: (_result, args, cache, info) => {
                            cache.invalidate({ __typename: "Post", id: (args as UpdatePostMutationVariables).id });
                        }
                    }
                }
            }),
            errorExchange,
            ssrExchange,
            fetchExchange
        ]
    };
};
