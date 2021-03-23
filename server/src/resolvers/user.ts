import { FORGET_PASSWORD_PREFIX } from "./../constants";
import { validateRegister } from "./../utils/validate";
import { User } from "./../entities/User";
import { Resolver, Ctx, Arg, Mutation, Query } from "type-graphql";
import { MyContext } from "../types";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";
import { UserResponse, RegisterDTO, FieldError, LoginDTO } from "../dtos/User";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPassword: string,
        @Ctx() { em, redis, req }: MyContext
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

        const user = await em.findOne(User, { id: parseInt(userId) });

        if (!user) {
            return {
                errors: [new FieldError("token", "user no longer exists")]
            };
        }

        // 비밀번호를 변경하고 Flush 한다.
        user.password = await argon2.hash(newPassword);
        await em.persistAndFlush(user);

        // Redis에 있는 key 값을 지운다.
        await redis.del(key);

        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => Boolean)
    async forgotPassword(@Arg("email") email: string, @Ctx() { em, redis }: MyContext): Promise<boolean> {
        const user = await em.findOne(User, { email });
        if (!user) {
            // 계정(이메일)이 DB에 없을 경우
            return true;
        }

        const token = v4();
        await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24 * 3);

        await sendEmail(
            email,
            "[ts-graphql-board] Change Password",
            `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
        );

        return true;
    }

    @Query(() => User, { nullable: true })
    async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
        // 로그인을 하지 않았을 경우
        if (!req.session.userId) {
            return null;
        }

        const user = await em.findOne(User, { id: req.session.userId });
        return user;
    }

    @Mutation(() => UserResponse)
    async register(@Arg("options") options: RegisterDTO, @Ctx() { em, req }: MyContext): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return {
                errors
            };
        }

        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {
            email: options.email,
            password: hashedPassword,
            name: options.name
        });

        try {
            await em.persistAndFlush(user);
        } catch (err) {
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
    async login(@Arg("options") options: LoginDTO, @Ctx() { em, req }: MyContext): Promise<UserResponse> {
        const user = await em.findOne(User, { email: options.email });
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
