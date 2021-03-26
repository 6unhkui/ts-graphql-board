import { Reaction } from "./../entities/Reaction";
import { isAuth } from "./../utils/middleware/isAuth";
import { Query, Resolver, Ctx, Arg, Int, Mutation, UseMiddleware, FieldResolver, Root } from "type-graphql";
import { MyContext } from "../types";
import { getConnection, Transaction } from "typeorm";
import { Post, User } from "src/entities";

@Resolver(Reaction)
export class ReactionResolver {
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async reaction(
        @Arg("postId", () => Int) postId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        const { userId } = req.session;
        // value 값은 -1 ~ 1 범위 안에 있어야 함
        if (value < -1 || value > 1) {
            return false;
        }
        const isLike = value === 1;

        const reaction = await Reaction.findOne({ where: { user: { id: userId }, post: { id: postId } } });

        try {
            if (!reaction) {
                // 1. 해당 글에 대해 처음 리액션을 했을 때 -> Reaction 테이블에 데이터 X
                await getConnection().transaction(async tm => {
                    await tm.query(
                        `
                            INSERT INTO reaction ("userId", "postId", value)
                            VALUES ($1,$2,$3);
                    `,
                        [userId, postId, value]
                    ),
                        await tm.query(
                            `
                            UPDATE post
                            SET likes = likes + $1, dislikes = dislikes + $2
                            WHERE id = $3;
                        `,
                            [isLike ? 1 : 0, isLike ? 0 : 1, postId]
                        );
                });
            } else if (reaction && reaction.value !== value) {
                // 2. 이전에 리액션을 한 상태이고, 리액션이 이전과 다를 경우

                let [like, dislike] = [0, 0];
                // 값이 바뀌었기 때문에 이전 값은 -1 해줘야 함
                if (reaction.value === 1) {
                    // 이전 값이 좋아요면 좋아요 값을 -1
                    like = -1;
                } else if (reaction.value === -1) {
                    // 이전 값이 싫어요면 싫어요 값을 -1
                    dislike = -1;
                }

                if (value !== 0) {
                    // 2-1. 반대 값을 누른 경우 (like -> dislike | dislike -> like)
                    if (value === 1) like = 1;
                    else if (value === -1) dislike = 1;
                } else {
                    // 2-2. 값을 취소한 경우 (like -> none | dislike -> none)
                }

                await getConnection().transaction(async tm => {
                    await tm.query(
                        `
                        UPDATE reaction
                        SET value = $1
                        WHERE "userId" = $2 AND "postId" = $3;
                    `,
                        [value, userId, postId]
                    ),
                        await tm.query(
                            `
                            UPDATE post
                            SET likes = likes + $1, dislikes = dislikes + $2
                            WHERE id = $3;
                        `,
                            [like, dislike, postId]
                        );
                });
            }
        } catch (err) {
            return false;
        }

        return true;
    }
}
