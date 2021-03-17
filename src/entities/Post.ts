import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { Base as BaseEntity } from "./Base";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field()
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ type: "text" })
    title!: string;

    @ManyToOne()
    author!: User;
}
