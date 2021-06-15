import "reflect-metadata";
import "dotenv-safe/config";
import morgan from "morgan";
import hpp from "hpp";
import helmet from "helmet";
import { createReactionLoader } from "./utils/createReactionLoader";
import { MyContext } from "./types/MyContext";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver, UserResolver, ReactionResolver, ImageResolver } from "./resolvers";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { createConnection } from "typeorm";
import ormconfig from "./ormconfig";
import { createUserLoader } from "./utils/createUserLoader";
import { graphqlUploadExpress } from "graphql-upload";

const main = async () => {
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

    if (process.env.NODE_ENV === "production") {
        app.set("trust proxy", 1); // 리버스 프록시 허용
        app.use(morgan("combined"));
        app.use(hpp());
        app.use(helmet());
    } else {
        app.use(morgan("dev"));
    }

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
                secure: __prod__ // cookie only works in https
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET || "sadskasadsdqweccs",
            resave: false
        })
    );

    app.use(
        graphqlUploadExpress({
            maxFileSize: 5 * 1024 * 1024,
            maxFiles: 10
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver, ReactionResolver, ImageResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({
            req,
            res,
            redis
        }),
        uploads: false
    });

    apolloServer.applyMiddleware({
        app,
        cors: false
    });

    app.listen(parseInt(process.env.PORT || "4000"), () => {
        console.log("🚀 Server started on localhost:4000");
    });
};

main().catch(err => {
    console.error(err);
});
