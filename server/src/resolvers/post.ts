import { isAuth } from "./../utils/middleware/isAuth";
import { User, Reaction, Image } from "./../entities";
import { Query, Resolver, Ctx, Arg, Int, Mutation, UseMiddleware, FieldResolver, Root } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types/MyContext";
import { PaginatedPosts, PostInput, UpdatePostInput } from "../dtos/post";
import { getRepository } from "typeorm";

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    contentSnippet(@Root() root: Post): string {
        return root.content.slice(0, 150);
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Ctx() { req }: MyContext,
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => Int, { nullable: true }) cursor?: number,
        @Arg("keyword", { nullable: true }) keyword?: string
    ): Promise<PaginatedPosts> {
        // limit 갯수보다 1개 더 조회해서 그 개수가 조회한 데이터 개수보다 크면
        // => hasMore : true
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const selectReactionSubQuery = req.session.userId
            ? `(SELECT value FROM reaction WHERE "userId" = ${req.session.userId} AND "postId" = post.id) "reactionStatus"`
            : 'null as "reactionStatus"';

        const cursorSubQuery = cursor
            ? cursor - 1
            : `
            SELECT id
            FROM post
            ORDER by id desc 
            LIMIT 1
        `;

        const postLimitSubQuery = `
            SELECT id
            FROM post
            WHERE ${
                keyword ? `(post."title" LIKE '%${keyword}%' OR post."content" LIKE '%${keyword}%') AND` : ""
            } post.id <= (${cursorSubQuery}) AND post."isDelete" = 0
            ORDER BY id desc 
            LIMIT ${realLimitPlusOne}
        `;

        const posts = await getRepository(Post)
            .createQueryBuilder("post")
            .addSelect(selectReactionSubQuery)
            .leftJoinAndSelect("post.author", "author", "author.isDelete = 0")
            .leftJoinAndSelect("post.images", "images", "images.isDelete = 0")
            .where(`post.id IN (${postLimitSubQuery})`)
            .orderBy("post.id", "DESC")
            .addOrderBy("images.id", "ASC")
            .getMany();

        return { posts: posts.slice(0, realLimit) as Post[], hasMore: posts.length === realLimitPlusOne };
    }

    @Query(() => Post, { nullable: true })
    async post(@Arg("id", () => Int) id: number, @Ctx() { req }: MyContext): Promise<Post | undefined> {
        const post = await getRepository(Post)
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.author", "author", "author.isDelete = 0")
            .leftJoinAndSelect("post.images", "images", "images.isDelete = 0")
            .where("post.isDelete = 0 AND post.id = :id", { id })
            .getOne();

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
        const user = await User.findOne({ id: req.session.userId, isDelete: 0 });
        if (!user) {
            return null;
        }

        const post = await Post.create({ title: input.title, content: input.content, author: user }).save();
        if (input.images) {
            const images = await Promise.all(input.images.map(image => Image.create({ url: image, post }).save()));
            post.addImages(images);
        }

        return post;
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async updatePost(@Arg("input") input: UpdatePostInput, @Ctx() { req }: MyContext): Promise<Post | null> {
        const post = await Post.findOne(input.id);
        if (!post) {
            return null;
        }

        if (post.author.id !== req.session.userId) {
            throw new Error("not authenticated");
        }

        if (typeof input.title !== "undefined") {
            await Post.update({ id: input.id }, { title: input.title, content: input.content });
        }

        // 새로 등록한 이미지
        if (input.images) {
            const images = await Promise.all(input.images.map(image => Image.create({ url: image, post }).save()));
            post.addImages(images);
        }

        // 삭제한 이미지
        if (input.deleteImages) {
            await Promise.all(
                input.deleteImages.map(image => {
                    Image.update({ url: image }, { isDelete: 1 });
                })
            );
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

        // Reaction 테이블에서도 삭제함
        await Reaction.delete({ post: { id } });

        return true;
    }
}
