import { User } from "./../entities/User";
import { Resolver, Ctx, Arg, Mutation, InputType, Field, ObjectType, Query } from "type-graphql";
import { MyContext } from "../types";
import argon2 from "argon2";

@InputType()
class RegisterDTO {
    @Field()
    account: string;

    @Field()
    password: string;

    @Field()
    name: string;
}

@InputType()
class LoginDTO {
    @Field()
    account: string;

    @Field()
    password: string;
}

@ObjectType()
class FieldError {
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
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field({ nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
        // you are not logged in
        if (!req.session.userId) {
            return null;
        }

        const user = await em.findOne(User, { id: req.session.userId });
        return user;
    }

    @Mutation(() => UserResponse)
    async register(@Arg("options") options: RegisterDTO, @Ctx() { em, req }: MyContext): Promise<UserResponse> {
        if (options.account.length <= 2) {
            return {
                errors: [new FieldError("account", "length must be greater than 2")]
            };
        }

        if (options.password.length <= 3) {
            return {
                errors: [new FieldError("password", "length must be greater than 3")]
            };
        }

        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            account: options.account,
            password: hashedPassword,
            name: options.name
        });

        try {
            await em.persistAndFlush(user);
        } catch (err) {
            // duplicate account error
            if (err.code === "23505") {
                return {
                    errors: [new FieldError("account", "account already token")]
                };
            }
        }

        // store user id session
        // this will set a cookie on the user
        // keep them logged in
        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => UserResponse)
    async login(@Arg("options") options: LoginDTO, @Ctx() { em, req }: MyContext): Promise<UserResponse> {
        const user = await em.findOne(User, { account: options.account });
        if (!user) {
            return {
                errors: [new FieldError("account", "that account dosen't exist")]
            };
        }

        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [new FieldError("password", "incorrect password")]
            };
        }

        // store user id session
        req.session.userId = user.id;

        return {
            user
        };
    }
}
