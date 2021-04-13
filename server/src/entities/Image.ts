import { Post } from "./Post";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Base } from "./Base";

@ObjectType()
@Entity()
export class Image extends Base {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    url!: string;

    @Field(() => Post)
    @ManyToOne(() => Post, post => post.images)
    post!: Post;
}
