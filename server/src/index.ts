import { MyContext } from "./types";
import { COOKIE_NAME, __prood__ } from "./constants";
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver, UserResolver } from "./resolvers";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true
        })
    );

    app.use(
        session({
            name: COOKIE_NAME, // 브라우저에 저장되는 cookie 이름
            store: new RedisStore({
                client: redis,
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
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res, redis })
    });

    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(4000, () => {
        console.log("server started on localhost:4000");
    });
};

main().catch(err => {
    console.error(err);
});
