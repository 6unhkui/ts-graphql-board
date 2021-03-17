import { Collection, Entity, LoadStrategy, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Base as BaseEntity } from "./Base";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ unique: true })
    account!: string;

    @Property()
    password!: string;

    @Field()
    @Property()
    name!: string;

    @OneToMany(() => Post, post => post.author, LoadStrategy.JOINED)
    posts = new Collection<Post>(this);
}
