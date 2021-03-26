import { validateRegister } from "./../utils/validate";
import { User } from "./../entities/User";
import { Resolver, Ctx, Arg, Mutation, Query } from "type-graphql";
import { MyContext } from "../types";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX, WEB_URL } from "../constants";
import { UserResponse, RegisterInput, FieldError, LoginInput } from "../dtos/user";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { getConnection } from "typeorm";

@Resolver(User)
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { redis, req }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 3) {
            return {
                errors: [new FieldError("newPassword", "length must be greater than 3")]
            };
        }

        const key = FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [new FieldError("token", "token expired")]
            };
        }

        const userIdNum = parseInt(userId);
        const user = await User.findOne(userIdNum);

        if (!user) {
            return {
                errors: [new FieldError("token", "user no longer exists")]
            };
        }

        // 비밀번호를 변경하고 Flush 한다.
        await User.update({ id: userIdNum }, { password: await argon2.hash(newPassword) });

        // Redis에 있는 key 값을 지운다.
        await redis.del(key);

        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => Boolean)
    async forgotPassword(@Arg("email") email: string, @Ctx() { redis }: MyContext): Promise<boolean> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // 계정(이메일)이 DB에 없을 경우
            return true;
        }

        const token = v4();
        await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24 * 3);

        await sendEmail(
            email,
            "[ts-graphql-board] Change Password",
            `<a href="${WEB_URL}/change-password/${token}">Reset Password</a>`
        );

        return true;
    }

    @Query(() => User, { nullable: true })
    async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
        // 로그인을 하지 않았을 경우
        if (!req.session.userId) {
            return undefined;
        }

        const user = await User.findOne({ id: req.session.userId });
        return user;
    }

    @Mutation(() => UserResponse)
    async register(@Arg("options") options: RegisterInput, @Ctx() { req }: MyContext): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return {
                errors
            };
        }

        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    email: options.email,
                    password: hashedPassword,
                    name: options.name
                })
                .returning("*")
                .execute();
            console.log("result", result);
            user = result.raw[0];
        } catch (err) {
            console.log("error", err);
            // duplicate email error
            if (err.code === "23505") {
                return {
                    errors: [new FieldError("email", "email already token")]
                };
            }
        }

        // Session에 User id 값을 저장
        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => UserResponse)
    async login(@Arg("options") options: LoginInput, @Ctx() { req }: MyContext): Promise<UserResponse> {
        const user = await User.findOne({ where: { email: options.email } });
        if (!user) {
            return {
                errors: [new FieldError("email", "that email dosen't exist")]
            };
        }

        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [new FieldError("password", "incorrect password")]
            };
        }

        // Session에 User id 값을 저장
        req.session.userId = user.id;

        return {
            user
        };
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
        return new Promise(resolve =>
            req.session.destroy(err => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    resolve(false);
                    return;
                }

                resolve(true);
            })
        );
    }
}
