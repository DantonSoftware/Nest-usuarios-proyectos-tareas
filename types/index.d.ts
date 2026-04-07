//NodeJS.ProcessEnv

export {};

declare namespace NodeJS {
    interface ProcessEnv{
        PORT: Number;
        DB_HOST: string;
        DB_PORT: number;
        DB_USER: string;
        DB_PASSWORD: string;
        DB_NAME: string;
        HASH_SALT: string;
        JWT_SECRET: string;
    }
}