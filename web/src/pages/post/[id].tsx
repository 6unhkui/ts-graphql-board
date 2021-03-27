import { Box, Center, Divider, Flex, Heading } from "@chakra-ui/layout";
import { Skeleton, SkeletonText } from "@chakra-ui/skeleton";
import Layout from "components/Layout";
import { RegularPostFragment, usePostQuery, useDeletePostMutation, useMeQuery } from "generated/graphql";
import { withUrqlClient } from "next-urql";
import React from "react";
import { createUrqlClient } from "utils/createUrqlClient";
import moment from "moment";
import { Button } from "@chakra-ui/button";
import EditDeletePostButtons from "components/EditDeletePostButtons";
import { HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import ReactionSection from "components/ReactionSection";
import { isServer } from "utils/isServer";
import { useGetIntIdFromUrl } from "hooks/useGetIntIdFromUrl";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
    const intId = useGetIntIdFromUrl();
    const [{ data: meData }] = useMeQuery({ pause: isServer() });
    const [{ data, fetching }] = usePostQuery({ variables: { id: intId } });

    return (
        <Layout variant="regular" title={data?.post?.title} description={data?.post?.contentSnippet}>
            {fetching || !data?.post ? (
                <Box w="100%" borderRadius="lg" overflow="hidden" p={6}>
                    <Skeleton height="50px" />
                    <Skeleton height="8px" mt={4} width="25%" />
                    <Divider mt={4} mb={6} />
                    <SkeletonText noOfLines={15} spacing={6} />
                </Box>
            ) : (
                <Box>
                    <Heading fontSize={"3rem"} textAlign={"center"}>
                        {data?.post?.title}
                    </Heading>
                    <Box mt={4} color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="sm">
                        <Center>
                            <Box>{"💛 written by. ".toUpperCase() + data?.post?.author?.name}</Box>
                            <Divider orientation="vertical" ml={2} mr={2} height={3} />
                            <Box>
                                {typeof data?.post?.createdAt === "string"
                                    ? moment(parseInt(data?.post?.createdAt)).format("YYYY.MM.DD A h:mm")
                                    : ""}
                            </Box>
                        </Center>
                    </Box>

                    <Divider mt={4} mb={6} />

                    <Box minHeight={"30vh"} mb={4}>
                        {data?.post?.content}
                    </Box>

                    {meData?.me ? <ReactionSection post={data?.post as RegularPostFragment} /> : null}

                    <Divider mt={4} mb={6} />

                    <Flex>
                        <NextLink href="/">
                            <Button leftIcon={<HamburgerIcon />} variant="solid" size="sm">
                                List
                            </Button>
                        </NextLink>

                        {meData?.me?.id === data?.post?.author?.id ? <EditDeletePostButtons id={intId} /> : null}
                    </Flex>
                </Box>
            )}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
