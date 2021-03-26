import { Post } from "./../entities/Post";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class PostInput {
    @Field()
    title: string;

    @Field()
    content: string;
}

@ObjectType()
export class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];

    @Field()
    hasMore: boolean;
}
