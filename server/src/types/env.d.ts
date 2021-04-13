declare namespace NodeJS {
    interface ProcessEnv {
        SERVER_PORT: string;
        DATABASE_URL: string;
        REDIS_URL: string;
        SESSION_SECRET: string;
        WEB_URL: string;
        NODEMAILER_USER: string;
        NODEMAILER_PASS: string;
        NODEMAILER_FROM_EMAIL: string;
        AWS_ACCESS_KEY_ID: string;
        AWS_SECRET_KEY: string;
        AWS_REGION: string;
        S3_BUCKET: string;
    }
}
