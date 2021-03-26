import { User } from "./../entities/User";
import { InputType, Field, ObjectType } from "type-graphql";

@InputType()
export class RegisterInput {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    name: string;
}

@InputType()
export class LoginInput {
    @Field()
    email: string;

    @Field()
    password: string;
}

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

@ObjectType()
export class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field({ nullable: true })
    user?: User;
}
