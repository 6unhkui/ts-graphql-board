import { User } from "./../entities/User";
import { Query, Resolver, Ctx, Arg, Int, Mutation } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class UserResolver {
    @Query(() => [User])
    users(@Ctx() { em }: MyContext): Promise<User[]> {
        return em.find(User, {});
    }

    @Mutation(() => User)
    async createUser(@Arg("name") name: string, @Ctx() { em }: MyContext): Promise<User> {
        const user = em.create(User, { name });
        await em.persistAndFlush(user);
        return user;
    }
}
