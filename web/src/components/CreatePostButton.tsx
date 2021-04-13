import React from "react";
import { AddIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/button";
import NextLink from "next/link";

interface CreatePostButtonProps {}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({}) => {
    return (
        <NextLink href="create-post">
            <IconButton size="lg" aria-label="Create Post" icon={<AddIcon />} borderRadius="full" />
        </NextLink>
    );
};

export default CreatePostButton;
