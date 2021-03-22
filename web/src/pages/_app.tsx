import { AppProps } from "next/app";
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange, QueryInput, Cache } from "@urql/exchange-graphcache";
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from "generated/graphql";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";

function betterUpdateQuery<Result, Query>(cache: Cache, qi: QueryInput, result: any, fn: (r: Result, q: Query) => Query) {
    return cache.updateQuery(qi, data => fn(result, data as any) as any);
}

const client = createClient({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include"
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            updates: {
                Mutation: {
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
                    },
                    register: (_result, args, cache, info) => {
                        betterUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
                            if (result.register.errors) {
                                return query;
                            } else {
                                return {
                                    me: result.register.user
                                };
                            }
                        });
                    }
                }
            }
        }),
        fetchExchange
    ]
});

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <Provider value={client}>
            <ChakraProvider resetCSS theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </Provider>
    );
};

export default MyApp;
