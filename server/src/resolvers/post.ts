import { User } from "./../entities/User";
import { Query, Resolver, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, { nullable: true })
    post(@Arg("id", () => Int) id: number, @Ctx() { em }: MyContext): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    @Mutation(() => Post)
    async createPost(@Arg("title") title: string, @Ctx() { em, req }: MyContext): Promise<Post | null> {
        if (!req.session.userId) {
            return null;
        }

        const user = await em.findOne(User, { id: req.session.userId });
        if (!user) {
            return null;
        }

        const post = em.create(Post, {
            title,
            author: user
        });
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post)
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, { nullable: true }) title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null;
        }

        if (typeof title !== "undefined") {
            post.title = title;
            await em.persistAndFlush(post);
        }

        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(@Arg("id") id: number, @Ctx() { em }: MyContext): Promise<boolean> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return false;
        }

        post.delete();
        await em.persistAndFlush(post);

        return true;
    }
}
