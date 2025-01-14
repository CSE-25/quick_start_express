import os from "os";

const CONCURRENCY_LIMIT = os.availableParallelism();

const appConfig = {
    PORT: 3000,
    db: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "postgres",
    },
    pool_db: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "postgres",
        max: CONCURRENCY_LIMIT,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    },
    router: {
        SAMPLE_PREFIX: "/api/sample",
    },
};

export { appConfig };
