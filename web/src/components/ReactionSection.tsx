import { ApolloCache } from "@apollo/client";
import { Button } from "@chakra-ui/button";
import { Center } from "@chakra-ui/layout";
import { ReactionMutation, RegularPostFragment, useReactionMutation } from "generated/graphql";
import gql from "graphql-tag";
import React, { useState } from "react";

interface ReactionSectionProps {
    post: RegularPostFragment;
    disabled: boolean;
}

const updateAfterReaction = (value: number, postId: number, cache: ApolloCache<ReactionMutation>) => {
    const data = cache.readFragment<{ id: number; likes: number; dislikes: number; reactionStatus: number }>({
        id: "Post:" + postId,
        fragment: gql`
            fragment _ on Post {
                id
                likes
                dislikes
                reactionStatus
            }
        `
    }) as any;

    if (data) {
        let [newLike, newDislike] = [data.likes as number, data.dislikes as number];
        const reactionStatus = data.reactionStatus as number;
        const isLike = value === 1;

        if (reactionStatus === 0) {
            // 1. 해당 글에 대해 이전 리액션이 없었을 때
            if (isLike) {
                // 이전 값이 좋아요면 좋아요 값을 -1
                newLike += 1;
            } else {
                // 이전 값이 싫어요면 싫어요 값을 -1
                newDislike += 1;
            }
        } else if (reactionStatus !== value) {
            // 2. 해당 글에 대해 이전과 다른 리액션을 취했을 때
            // 값이 바뀌었기 때문에 이전 값은 -1 해줘야 함
            if (reactionStatus === 1) {
                newLike -= 1;
            } else if (reactionStatus === -1) {
                newDislike -= 1;
            }

            // 2-1. 반대 값을 누른 경우 (like -> dislike | dislike -> like)
            if (value !== 0) {
                if (value === 1) newLike += 1;
                else if (value === -1) newDislike += 1;
            }
        }

        cache.writeFragment(
            {
                id: "Post:" + postId,
                fragment: gql`
                    fragment _ on Post {
                        likes
                        dislikes
                        reactionStatus
                    }
                `,
                data: { likes: newLike, dislikes: newDislike, reactionStatus: value }
            }
            // { id: post.id, likes: newLike, dislikes: newDislike, reactionStatus: value } as any
        );
    }
};

const ReactionSection: React.FC<ReactionSectionProps> = ({ post, disabled }) => {
    const [reaction, { loading }] = useReactionMutation();

    return (
        <Center>
            <Button
                disabled={disabled}
                variant={post.reactionStatus === 1 ? "solid" : "outline"}
                mr={2}
                onClick={() => {
                    const value = post.reactionStatus === 1 ? 0 : 1;
                    reaction({
                        variables: { postId: post.id, value },
                        update: cache => updateAfterReaction(value, post.id, cache)
                    });
                }}
                loading={loading}
            >
                😍 Like {post?.likes}
            </Button>
            <Button
                disabled={disabled}
                variant={post.reactionStatus === -1 ? "solid" : "outline"}
                onClick={() => {
                    const value = post.reactionStatus === -1 ? 0 : -1;
                    reaction({
                        variables: { postId: post.id, value },
                        update: cache => updateAfterReaction(value, post.id, cache)
                    });
                }}
                loading={loading}
            >
                👿 Dislike {post?.dislikes}
            </Button>
        </Center>
    );
};

export default ReactionSection;
