import { Box, Center, Divider, Flex, Grid, Heading } from "@chakra-ui/layout";
import Layout from "components/Layout";
import { useMeQuery, usePostsQuery } from "generated/graphql";
import { NextPage } from "next";
import { Button } from "@chakra-ui/button";
import moment from "moment";
import { useState } from "react";
import NextLink from "next/link";
import { isServer } from "utils/isServer";
import PostItemSkeleton from "components/PostItemSkeleton";
import { withApollo } from "utils/withApollo";
import { useColorModeValue } from "@chakra-ui/color-mode";

const DEFAULT_VARIABLES = {
    limit: 10
};

const Index: NextPage = () => {
    const titleTextColor = useColorModeValue("primary.500", "white");
    const [variables, setVariables] = useState(DEFAULT_VARIABLES);
    const { data: meData } = useMeQuery({ skip: isServer() });
    const { data, loading, fetchMore } = usePostsQuery({
        variables,
        notifyOnNetworkStatusChange: true
    });

    const increaseCursor = () => ({ ...variables, cursor: data.posts.posts[data.posts.posts.length - 1].id });

    return (
        <Layout variant="regular">
            <Flex align="center" direction="column">
                <Heading fontSize={["2.5rem", "4rem"]} color={titleTextColor}>
                    Memo
                </Heading>
                {meData?.me ? (
                    <NextLink href="create-post">
                        <Button variant="outline" mt={8} ml="auto">
                            📝 Create Post
                        </Button>
                    </NextLink>
                ) : null}
            </Flex>
            <Grid templateColumns="repeat(1, 1fr)" gap={6} mt={8}>
                {!data && loading ? (
                    <>
                        {Array.from({ length: 3 }, (_, key) => (
                            <PostItemSkeleton key={key} />
                        ))}
                    </>
                ) : (
                    data?.posts.posts.map(p =>
                        !p ? null : (
                            <NextLink key={p.id} href={`post/${p.id}`}>
                                <Box w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} cursor="pointer">
                                    <Box fontWeight="semibold" lineHeight="tight" isTruncated>
                                        {p.title}
                                    </Box>

                                    <Box color="gray.500" fontSize="sm" lineHeight="tight" isTruncated>
                                        {p.contentSnippet}
                                    </Box>
                                    <Flex color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" mt={4}>
                                        <Center>
                                            <Box>{"💛 written by. ".toUpperCase() + p.author?.name}</Box>
                                            <Divider orientation="vertical" ml={2} mr={2} height={3} />
                                            <Box>{moment(parseInt(p.createdAt)).format("YYYY.MM.DD A h:mm")}</Box>
                                            <Divider orientation="vertical" ml={2} mr={2} height={3} />
                                            <Box>😍 {p.likes}</Box>
                                            <Box ml={2}>👿 {p.dislikes}</Box>
                                        </Center>
                                    </Flex>
                                </Box>
                            </NextLink>
                        )
                    )
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

export default withApollo({ ssr: true })(Index);
