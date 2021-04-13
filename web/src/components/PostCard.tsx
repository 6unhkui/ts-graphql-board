import React from "react";
import NextLink from "next/link";
import moment from "moment";
import { Box, Center, Divider, Flex } from "@chakra-ui/layout";
import { RegularPostFragment } from "generated/graphql";
import Emoji from "./Emoji";
import PostCardImages from "./PostCardImages";

moment.locale("ko");

interface PostCardProps {}

const PostCard: React.FC<PostCardProps & RegularPostFragment> = ({
    id,
    title,
    contentSnippet,
    author,
    createdAt,
    likes,
    dislikes,
    images
}) => {
    return (
        <>
            <Box w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" cursor="pointer">
                {images?.length > 0 ? <PostCardImages images={images} /> : null}

                <NextLink href={`post/${id}`} prefetch={false}>
                    <Box p={6}>
                        <Box fontWeight="semibold" lineHeight="tight" isTruncated>
                            {title}
                        </Box>

                        <Box color="gray.500" fontSize="sm" lineHeight="tight" isTruncated>
                            {contentSnippet}
                        </Box>
                        <Flex color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" mt={4}>
                            <Center>
                                <Box>
                                    <Emoji mr={8}>💛</Emoji>
                                    {"written by. ".toUpperCase() + author?.name}
                                </Box>
                                <Divider orientation="vertical" ml={2} mr={2} height={3} />
                                <Box>{moment(parseInt(createdAt)).format("YYYY.MM.DD A h:mm")}</Box>
                                <Divider orientation="vertical" ml={2} mr={2} height={3} />
                                <Box>
                                    <Emoji mr={6}>😍</Emoji> {likes}
                                </Box>
                                <Box ml={2}>
                                    <Emoji mr={6}>👿</Emoji> {dislikes}
                                </Box>
                            </Center>
                        </Flex>
                    </Box>
                </NextLink>
            </Box>
        </>
    );
};

export default PostCard;
