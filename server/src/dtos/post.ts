import { Post } from "./../entities/Post";
import { Field, InputType, Int, ObjectType } from "type-graphql";

@InputType()
export class PostInput {
    @Field()
    title: string;

    @Field()
    content: string;

    @Field(() => [String], { nullable: true })
    images?: string[];
}

@InputType()
export class UpdatePostInput {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field(() => [String], { nullable: true })
    images?: string[];

    @Field(() => [String], { nullable: true })
    deleteImages?: string[];
}

@ObjectType()
export class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];

    @Field()
    hasMore: boolean;
}
