import { MyContext } from "./types";
import { __prood__ } from "./constatns";
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver, UserResolver } from "./resolvers";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: "qid", // 브라우저에 저장되는 cookie 이름
            store: new RedisStore({
                client: redisClient,
                disableTTL: true,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 364 * 10, // 10 years
                httpOnly: true,
                sameSite: "lax", // csrf
                secure: __prood__ // cookie only works in https
            },
            saveUninitialized: false,
            secret: "dklsklwkcsdsaodpsoapdslweldaspcsasas",
            resave: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("server started on localhost:4000");
    });
};

main().catch(err => {
    console.error(err);
});
