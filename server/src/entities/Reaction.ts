import { Post } from "./Post";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { Base } from "./Base";

@ObjectType()
@Entity()
export class Reaction extends Base {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Int, { defaultValue: 0 })
    @Column({ type: "smallint", default: 0, comment: "-1 : Dislike, 0 : None, 1 : like" })
    value: number;

    @Field(() => User)
    @ManyToOne(() => User, user => user.reactions)
    user!: User;

    @Field(() => Post)
    @ManyToOne(() => Post, post => post.reactions)
    post!: Post;

    like(): void {
        this.value = 1;
    }

    dislike(): void {
        this.value = -1;
    }
}
