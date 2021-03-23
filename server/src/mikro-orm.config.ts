import { __prood__ } from "./constants";
import { Post, User, BaseEntity } from "./entities";
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
    entities: [BaseEntity, Post, User],
    debug: !__prood__
} as Parameters<typeof MikroORM.init>[0];
