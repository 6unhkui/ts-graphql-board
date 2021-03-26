import { __prood__ } from "./constants";
import { ConnectionOptions } from "typeorm";
import { Base, Post, User, Reaction } from "./entities";
import path from "path";

export default {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Base, Post, User, Reaction],
    migrations: [path.join(__dirname, "./src/migrations/*")],
    // synchronize: true,
    logging: !__prood__
} as ConnectionOptions;
