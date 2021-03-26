import { Reaction } from "./Reaction";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { Base } from "./Base";

@ObjectType()
@Entity()
export class Post extends Base {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column("text")
    title!: string;

    @Field()
    @Column("text")
    content!: string;

    @Field(() => Int, { defaultValue: 0, nullable: true })
    reactionStatus: number;

    @Field()
    @Column({ type: "int", default: 0 })
    likes!: number;

    @Field()
    @Column({ type: "int", default: 0 })
    dislikes!: number;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, user => user.posts, { eager: true })
    author!: User;

    @Field(() => Reaction, { nullable: true })
    @OneToMany(() => Reaction, reaction => reaction.post)
    reactions: Reaction[];
}
