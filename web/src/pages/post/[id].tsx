import React from "react";
import { Box, Center, Divider, Flex, Heading } from "@chakra-ui/layout";
import { Skeleton, SkeletonText } from "@chakra-ui/skeleton";
import Layout from "components/Layout";
import { RegularPostFragment, usePostQuery, useMeQuery } from "generated/graphql";
import moment from "moment";
import { Button } from "@chakra-ui/button";
import EditDeletePostButtons from "components/EditDeletePostButtons";
import { HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import ReactionSection from "components/ReactionSection";
import { isServer } from "utils/isServer";
import { useGetIntIdFromUrl } from "hooks/useGetIntIdFromUrl";
import { withApollo } from "utils/withApollo";
import { Image } from "@chakra-ui/image";
import SEO from "components/SEO";
import { useRouter } from "next/router";
import Emoji from "components/Emoji";

interface PostProps {}

const Post: React.FC<PostProps> = ({}) => {
    const router = useRouter();
    const intId = useGetIntIdFromUrl();
    const { data: meData } = useMeQuery({ skip: isServer() });
    const { data, loading } = usePostQuery({ variables: { id: intId } });

    return (
        <Layout variant="regular">
            <SEO
                title={data?.post?.title}
                description={data?.post?.contentSnippet}
                image={data?.post?.images.length > 0 ? { url: data?.post?.images[0].url } : null}
                path={router.asPath}
            />
            {loading || !data?.post ? (
                <Box w="100%" p={6}>
                    <Skeleton height="50px" mb={4} />
                    <Skeleton height="8px" width="50%" m={"auto"} />
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
                            <Box>
                                <Emoji mr={2}>💛</Emoji>
                                {"written by. ".toUpperCase() + data?.post?.author?.name}
                            </Box>
                            <Divider orientation="vertical" ml={2} mr={2} height={3} />
                            {typeof data?.post?.createdAt === "string" ? (
                                <Box>{moment(parseInt(data?.post?.createdAt)).format("YYYY.MM.DD A h:mm")}</Box>
                            ) : null}
                        </Center>
                    </Box>

                    <Divider mt={4} mb={6} />

                    {data?.post?.images?.map((image, i) => (
                        <Image key={i} src={image.url} alt="image" mb={2} loading="eager" />
                    ))}

                    <Box minHeight={"30vh"} mb={4}>
                        {data?.post?.content}
                    </Box>

                    <ReactionSection post={data?.post as RegularPostFragment} disabled={meData ? !meData.me : true} />

                    <Divider mt={4} mb={6} />

                    <Flex>
                        <NextLink href="/">
                            <Button leftIcon={<HamburgerIcon />} variant="solid" size="sm">
                                리스트
                            </Button>
                        </NextLink>

                        {meData?.me?.id === data?.post?.author?.id ? <EditDeletePostButtons id={intId} /> : null}
                    </Flex>
                </Box>
            )}
        </Layout>
    );
};

export default withApollo({ ssr: true })(Post);
