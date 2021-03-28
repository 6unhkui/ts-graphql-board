declare namespace NodeJS {
    interface ProcessEnv {
        SERVER_PORT: string;
        DATABASE_URL: string;
        REDIS_URL: string;
        SESSION_SECRET: string;
        WEB_URL: string;
        NODEMAILER_USER: string;
        NODEMAILER_FROM_EMAIL: string;
        NODEMAILER_PASS: string;
    }
}
