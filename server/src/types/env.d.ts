declare namespace NodeJS {
    interface ProcessEnv {
        SERVER_PORT: string;
        DATABASE_URL: string;
        REDIS_URL: string;
        SESSION_SECRET: string;
        WEB_URL: string;
    }
}
