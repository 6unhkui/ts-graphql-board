import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;

    constructor(field: string, message: string) {
        this.field = field;
        this.message = message;
    }
}
