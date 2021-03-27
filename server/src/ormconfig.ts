import { __prood__ } from "./constants";
import { ConnectionOptions } from "typeorm";
import { Base, Post, User, Reaction } from "./entities";
import path from "path";

export default {
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Base, Post, User, Reaction],
    // migrations: [path.join(__dirname, "./migrations/*")],
    synchronize: true,
    logging: !__prood__
} as ConnectionOptions;
