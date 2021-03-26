declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_PORT: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    REDIS_URL: string;
    WEB_URL: string;
    SESSION_SECRET: string;
  }
}