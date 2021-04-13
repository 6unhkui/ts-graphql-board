import { Box, Center, Grid } from "@chakra-ui/layout";
import Layout from "components/Layout";
import { useMeQuery, usePostsQuery } from "generated/graphql";
import { NextPage } from "next";
import { Button } from "@chakra-ui/button";
import { useState } from "react";
import { isServer } from "utils/isServer";
import PostCardSkeleton from "components/PostCardSkeleton";
import { withApollo } from "utils/withApollo";
import PostCard from "components/PostCard";
import CreatePostButton from "components/CreatePostButton";

const DEFAULT_VARIABLES = {
    limit: 10
};

const Index: NextPage = () => {
    const [variables, setVariables] = useState(DEFAULT_VARIABLES);
    const { data: meData } = useMeQuery({ skip: isServer() });
    const { data, loading, fetchMore } = usePostsQuery({
        variables,
        notifyOnNetworkStatusChange: true
    });

    const increaseCursor = () => ({ ...variables, cursor: data.posts.posts[data.posts.posts.length - 1].id });

    return (
        <Layout variant="regular">
            {meData?.me ? (
                <Box position="fixed" zIndex={1} bottom={6} right={6}>
                    <CreatePostButton />
                </Box>
            ) : null}

            <Grid templateColumns="repeat(1, 1fr)" gap={6} mt={8}>
                {!data && loading ? (
                    <>
                        {Array.from({ length: 3 }, (_, key) => (
                            <PostCardSkeleton key={key} />
                        ))}
                    </>
                ) : (
                    data?.posts.posts.map(p => (!p ? null : <PostCard key={p.id} {...p} />))
                )}
            </Grid>

            {data && data?.posts.hasMore ? (
                <Center mt={10}>
                    <Button
                        isLoading={loading}
                        onClick={() => {
                            fetchMore({
                                variables: increaseCursor()
                            }).then(() => {
                                // Update variables.cursor for the original query to include
                                // the newly added post items.
                                setVariables(increaseCursor());
                            });
                        }}
                    >
                        Load More
                    </Button>
                </Center>
            ) : null}
        </Layout>
    );
};

export default withApollo({ ssr: false })(Index);
