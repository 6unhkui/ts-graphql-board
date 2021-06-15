import { Redis } from "ioredis";
import { Session } from "express-session";
import { Request, Response } from "express";

export interface MyContext {
    req: Request & { session?: Session & { userId?: number } };
    res: Response;
    redis: Redis;
}
