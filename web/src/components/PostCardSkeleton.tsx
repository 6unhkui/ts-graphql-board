import React from "react";
import { Box } from "@chakra-ui/layout";
import { Skeleton, SkeletonText } from "@chakra-ui/skeleton";

interface PostCardSkeletonProps {}

const PostCardSkeleton: React.FC<PostCardSkeletonProps> = ({}) => {
    return (
        <Box w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6}>
            <Skeleton height="20px" />
            <SkeletonText mt={4} noOfLines={2} spacing={4} />
            <Skeleton height="8px" mt={4} width="25%" />
        </Box>
    );
};

export default PostCardSkeleton;
