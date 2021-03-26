import { Redis } from "ioredis";
import { Session } from "express-session";
import { Request, Response } from "express";
import { createUserLoader } from "./utils/createUserLoader";
import { createReactionLoader } from "./utils/createReactionLoader";

export type MyContext = {
    req: Request & { session?: Session & { userId?: number } };
    res: Response;
    redis: Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    reactionLoader: ReturnType<typeof createReactionLoader>;
};
