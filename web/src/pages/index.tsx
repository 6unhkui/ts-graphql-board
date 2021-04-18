import { useCallback, useState } from "react";
import { Box, Center, Grid, Heading } from "@chakra-ui/layout";
import Layout from "components/Layout";
import { PostsQueryVariables, useMeQuery, usePostsQuery } from "generated/graphql";
import { NextPage } from "next";
import { Button } from "@chakra-ui/button";
import { isServer } from "utils/isServer";
import PostCardSkeleton from "components/PostCardSkeleton";
import { withApollo } from "utils/withApollo";
import PostCard from "components/PostCard";
import CreatePostButton from "components/CreatePostButton";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Search2Icon } from "@chakra-ui/icons";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { SITE_NAME } from "../constants";

const DEFAULT_VARIABLES = Object.freeze({
    limit: 10
});

const Index: NextPage = () => {
    const titleTextColor = useColorModeValue("primary.500", "white");
    const [variables, setVariables] = useState<PostsQueryVariables>(DEFAULT_VARIABLES);
    const { data: meData } = useMeQuery({ skip: isServer() });
    const { data, loading, fetchMore, refetch, client } = usePostsQuery({
        variables,
        notifyOnNetworkStatusChange: true
    });

    const variablesAfterCursorUpdate = () => ({ ...variables, cursor: data.posts.posts[data.posts.posts.length - 1].id });

    const onChangKeyword = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const keyword = e.target.value.trim();
            setVariables(variables => ({ ...variables, keyword }));
        },
        [setVariables]
    );

    const postsFetchMore = useCallback(
        (variables: PostsQueryVariables) => {
            setVariables(variables);

            fetchMore({
                variables: { ...variables }
            });
        },
        [fetchMore, setVariables]
    );

    return (
        <Layout variant="regular">
            {meData?.me ? (
                <Box position="fixed" zIndex={1} bottom={6} right={6}>
                    <CreatePostButton />
                </Box>
            ) : null}

            <Box align="center">
                <Heading fontSize={["2.5rem", "4rem"]} color={titleTextColor}>
                    {SITE_NAME}
                </Heading>
            </Box>

            <Box px={["0", "100px"]} mx="auto" mt={10}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none" children={<Search2Icon color="gray.300" mt="8px" />} />
                    <Input
                        placeholder="검색어를 입력해주세요."
                        size="lg"
                        borderColor="primary.500"
                        onChange={onChangKeyword}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                const param: PostsQueryVariables =
                                    !variables?.keyword || variables.keyword.length === 0
                                        ? DEFAULT_VARIABLES
                                        : { limit: variables.limit, keyword: variables.keyword };

                                postsFetchMore(param);
                            }
                        }}
                    />
                </InputGroup>
            </Box>

            <Grid templateColumns="repeat(1, 1fr)" gap={6} mt={8}>
                {!data && loading ? (
                    <>
                        {Array.from({ length: 3 }, (_, key) => (
                            <PostCardSkeleton key={key} />
                        ))}
                    </>
                ) : data?.posts.posts.length > 0 ? (
                    data?.posts.posts.map(post => (!post ? null : <PostCard key={post.id} {...post} />))
                ) : (
                    <Center mt={14} color="gray.500">
                        게시글이 존재하지 않습니다.
                    </Center>
                )}
            </Grid>

            {data && data?.posts.hasMore ? (
                <Center mt={10}>
                    <Button
                        isLoading={loading}
                        onClick={() => {
                            postsFetchMore(variablesAfterCursorUpdate());
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
