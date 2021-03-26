import dotenv from "dotenv-safe";
dotenv.config();

import "reflect-metadata";
import { createReactionLoader } from "./utils/createReactionLoader";
import { MyContext } from "./types";
import { COOKIE_NAME, __prood__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver, UserResolver, ReactionResolver } from "./resolvers";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import ormconfig from "./ormconfig";
import { createUserLoader } from "./utils/createUserLoader";

const main = async () => {
    console.log(process.env.DB_PASSWORD, process.env.REDIS_URL, ormconfig, process.env.SESSION_SECRET);
    const conn = await createConnection(ormconfig);
    // await conn.runMigrations();

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);

    app.use(
        cors({
            origin: process.env.WEB_URL,
            credentials: true
        })
    );

    app.set("proxy", 1);

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
            secret: process.env.SESSION_SECRET || "wekpaslpcmlskldapw",
            resave: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver, ReactionResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({
            req,
            res,
            redis,
            userLoader: createUserLoader(),
            reactionLoader: createReactionLoader()
        })
    });
    createUserLoader;
    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(parseInt(process.env.WEB_URL || "4000"), () => {
        console.log("server started on localhost:4000");
    });
};

main().catch(err => {
    console.error(err);
});
