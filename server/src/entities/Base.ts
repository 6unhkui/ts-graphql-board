import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export abstract class Base extends BaseEntity {
    @Field(() => String)
    @CreateDateColumn()
    createdAt = new Date();

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = new Date();

    @Field(() => String, { nullable: true })
    @Column({ type: "date", nullable: true })
    deletedAt?: Date;

    @Field(() => Boolean)
    @Column({ type: "smallint", default: 0 })
    isDelete = 0;

    delete(): void {
        this.deletedAt = new Date();
        this.isDelete = 1;
    }
}
