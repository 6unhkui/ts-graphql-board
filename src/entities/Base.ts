import { Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export abstract class Base {
    @Field(() => String)
    @Property({ type: "date" })
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: "date", onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field(() => String, { nullable: true })
    @Property({ type: "date", nullable: true })
    deletedAt?: Date;

    @Field(() => Boolean)
    @Property({ type: "tinyint", default: 0 })
    isDelete = 0;

    delete() {
        this.deletedAt = new Date();
        this.isDelete = 1;
    }
}
