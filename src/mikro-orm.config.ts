import { __prood__ } from "./constatns";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export default {
    type: "postgresql",
    host: "127.0.0.1",
    port: 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dbName: "board",
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/
    },
    entities: [Post],
    debug: !__prood__
} as Parameters<typeof MikroORM.init>[0];
