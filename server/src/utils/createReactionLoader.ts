import { getConnection } from "typeorm";
import DataLoader from "dataloader";
import { Reaction, User } from "../entities";

// [{postId : 5, userId: 10}]
// then return [{postId : 5, userId: 10, value : 1}]
export const createReactionLoader = (): DataLoader<{ postId: number; userId: number }, Reaction | null> =>
    new DataLoader<{ postId: number; userId: number }, Reaction | null>(async keys => {
        const inQuery = keys.reduce(
            (acc, key) => {
                acc["userIds"].push(key.userId);
                acc["postIds"].push(key.postId);
                return acc;
            },
            { userIds: [] as number[], postIds: [] as number[] }
        );

        const reactions = await getConnection()
            .getRepository(Reaction)
            .createQueryBuilder("reaction")
            .where("reaction.userId IN (:...userIds) AND reaction.postId IN (:...postIds)", inQuery)
            .getMany();
        const reactionIdsToReaction = reactions.reduce((acc, reaction) => {
            acc[`${reaction.user.id}|${reaction.post.id}`] = reaction;
            return acc;
        }, {} as Record<string, Reaction>);

        return keys.map(key => reactionIdsToReaction[`${key.userId}|${key.postId}`]);
    });
