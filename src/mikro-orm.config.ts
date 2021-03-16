import { __prood__ } from "./constatns";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  user: "inkyung",
  password: "pass",
  dbName: "board",
  type: "postgresql",
  debug: !__prood__,
} as Parameters<typeof MikroORM.init>[0];
