import { User } from "./../entities/User";
import { InputType, Field, ObjectType } from "type-graphql";
import { FieldError } from "./error";

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

@InputType()
export class UpdateProfileInput {
    @Field()
    email: string;

    @Field({ nullable: true })
    password?: string;

    @Field()
    name: string;
}

@ObjectType()
export class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field({ nullable: true })
    user?: User;
}
