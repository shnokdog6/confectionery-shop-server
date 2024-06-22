declare global {
    interface EnvironmentVariables {
        POSTGRES_HOST: string;
        POSTGRES_PORT: number;
        POSTGRES_USERNAME: string;
        POSTGRES_PASSWORD: string;
        POSTGRES_DATABASE_NAME: string;
        REDIS_HOST: string;
        REDIS_PORT: number;
        JWT_ACCESS_KEY: string;
        JWT_REFRESH_KEY: string;
    }
}

export {};
