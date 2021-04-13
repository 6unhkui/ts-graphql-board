import { __prod__ } from "./constants";
import { ConnectionOptions } from "typeorm";
import { Base, Post, User, Reaction, Image } from "./entities";
import path from "path";

export default {
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Base, Post, User, Reaction, Image],
    migrations: [path.join(__dirname, "./migrations/*")],
    synchronize: true,
    logging: !__prod__
} as ConnectionOptions;
