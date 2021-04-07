import { isAuth } from "./../utils/middleware/isAuth";
import { User, Reaction } from "./../entities";
import { Query, Resolver, Ctx, Arg, Int, Mutation, UseMiddleware, FieldResolver, Root } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { PaginatedPosts, PostInput } from "../dtos/post";
import { getConnection } from "typeorm";

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    contentSnippet(@Root() root: Post): string {
        return root.content.slice(0, 150);
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => Int, { nullable: true }) cursor: number | null,
        @Ctx() { req }: MyContext
    ): Promise<PaginatedPosts> {
        // limit 갯수보다 1개 더 조회해서 그 개수가 조회한 데이터 개수보다 크면
        // => hasMore : true
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const selectReactionSubQuery = req.session.userId
            ? `(SELECT value FROM reaction WHERE "userId" = ${req.session.userId} AND "postId" = p.id) "reactionStatus"`
            : 'null as "reactionStatus"';

        const fromCursorSubQuery = cursor
            ? cursor - 1
            : `
            SELECT id
            FROM post
            ORDER by id desc 
            LIMIT 1
        `;

        const posts = await getConnection().query(
            `
            SELECT p.*,
                   json_build_object('id', u.id, 'name', u."name" , 'email', u.email ) author,
                   ${selectReactionSubQuery}
            FROM post p
            LEFT OUTER JOIN public.user u ON u.id = p."authorId" AND u."isDelete" = 0
            WHERE p."isDelete" = 0 AND p.id <= (${fromCursorSubQuery})
            ORDER BY p.id DESC
            LIMIT ${realLimitPlusOne}
            `
        );

        return { posts: posts.slice(0, realLimit), hasMore: posts.length === realLimitPlusOne };
    }

    @Query(() => Post, { nullable: true })
    async post(@Arg("id", () => Int) id: number, @Ctx() { req }: MyContext): Promise<Post | undefined> {
        const post = await Post.findOne({ where: { id, isDelete: 0 } });

        if (post && req.session.userId) {
            const reaction = await Reaction.findOne({ where: { user: { id: req.session.userId }, post: { id } } });
            if (reaction) {
                return { ...post, reactionStatus: reaction.value } as Post;
            }
        }
        return post;
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(@Arg("input") input: PostInput, @Ctx() { req }: MyContext): Promise<Post | null> {
        const user = await User.findOne({ id: req.session.userId });
        if (!user) {
            return null;
        }

        return await Post.create({ ...input, author: user }).save();
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("id", () => Int) id: number,
        @Arg("title", { nullable: true }) title: string,
        @Arg("content", { nullable: true }) content: string,
        @Ctx() { req }: MyContext
    ): Promise<Post | null> {
        const post = await Post.findOne(id);
        if (!post) {
            return null;
        }

        if (post.author.id !== req.session.userId) {
            throw new Error("not authenticated");
        }

        if (typeof title !== "undefined") {
            await Post.update({ id }, { title, content });
        }

        return post;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(@Arg("id", () => Int) id: number, @Ctx() { req }: MyContext): Promise<boolean> {
        const post = await Post.findOne(id);
        if (!post) {
            return false;
        }

        if (post.author.id !== req.session.userId) {
            throw new Error("not authenticated");
        }

        post.delete();
        await Post.update({ id }, post);

        // Reaction 테이블도 삭제함
        await Reaction.delete({ post: { id } });

        return true;
    }
}
