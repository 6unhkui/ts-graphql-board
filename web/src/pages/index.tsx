import { Badge, Box, Center, Divider, Flex, Grid, Heading, Link } from "@chakra-ui/layout";
import Layout from "components/Layout";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "utils/createUrqlClient";
import { useMeQuery, usePostsQuery } from "generated/graphql";
import { NextPage } from "next";
import { Button } from "@chakra-ui/button";
import { Skeleton, SkeletonText } from "@chakra-ui/skeleton";
import moment from "moment";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { isServer } from "utils/isServer";

const Index: NextPage = () => {
    const [variables, setVariables] = useState({
        limit: 10,
        offset: 0
    });
    const [{ data: meData }] = useMeQuery({ pause: isServer() });
    const [{ data, fetching }] = usePostsQuery({ variables });
    useEffect(() => {
        setVariables({
            limit: 10,
            offset: 0
        });
    }, []);

    // if (!fetching && !data) {
    //     return <div>you got query failed for some reason</div>;
    // }

    return (
        <Layout variant="regular">
            <Flex align="center">
                <Heading fontSize={["2rem", "4rem"]}>Board App 😘</Heading>
                {meData?.me ? (
                    <NextLink href="create-post">
                        <Button variant="outline" mt={8} ml="auto">
                            📝 Create Post
                        </Button>
                    </NextLink>
                ) : null}
            </Flex>
            <Grid templateColumns="repeat(1, 1fr)" gap={6} mt={8}>
                {!data && fetching ? (
                    <Box w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6}>
                        <Skeleton height="20px" />
                        <SkeletonText mt={4} noOfLines={2} spacing={4} />
                        <Skeleton height="8px" mt={4} width="25%" />
                    </Box>
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
                        isLoading={fetching}
                        // variant="outline"
                        onClick={() => {
                            setVariables({ ...variables, offset: variables.offset + variables.limit });
                        }}
                    >
                        Load More
                    </Button>
                </Center>
            ) : null}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
