import { Reaction } from "./Reaction";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends Base {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Field()
    @Column()
    name!: string;

    @Field(() => Post)
    @OneToMany(() => Post, post => post.author)
    posts: Promise<Post[]>;

    @Field(() => Reaction, { nullable: true })
    @OneToMany(() => Reaction, reaction => reaction.user)
    reactions: Promise<Reaction[]>;
}
