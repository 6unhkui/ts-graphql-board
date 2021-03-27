import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import { RegularPostFragment, useReactionMutation } from "generated/graphql";
import React, { useState } from "react";

interface ReactionSectionProps {
    post: RegularPostFragment;
}

const ReactionSection: React.FC<ReactionSectionProps> = ({ post }) => {
    const [{ fetching, operation }, reaction] = useReactionMutation();

    return (
        <Center>
            <Button
                variant={post.reactionStatus === 1 ? "solid" : "outline"}
                mr={2}
                onClick={() => {
                    reaction({
                        postId: post.id,
                        value: post.reactionStatus === 1 ? 0 : 1
                    });
                }}
                loading={fetching && operation?.variables?.value === 1}
            >
                😍 Like {post?.likes}
            </Button>
            <Button
                variant={post.reactionStatus === -1 ? "solid" : "outline"}
                onClick={() => {
                    reaction({
                        postId: post.id,
                        value: post.reactionStatus === -1 ? 0 : -1
                    });
                }}
                loading={fetching && operation?.variables?.value === -1}
            >
                👿 Dislike {post?.dislikes}
            </Button>
        </Center>
    );
};

export default ReactionSection;
