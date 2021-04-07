import { Box } from "@chakra-ui/layout";
import { Skeleton, SkeletonText } from "@chakra-ui/skeleton";
import React from "react";

interface PostItemSkeletonProps {}

const PostItemSkeleton: React.FC<PostItemSkeletonProps> = ({}) => {
    return (
        <Box w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" p={6}>
            <Skeleton height="20px" />
            <SkeletonText mt={4} noOfLines={2} spacing={4} />
            <Skeleton height="8px" mt={4} width="25%" />
        </Box>
    );
};

export default PostItemSkeleton;
