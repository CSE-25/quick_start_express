const CONCURRENCY_LIMIT = 4;
export const appConfig = {
    PORT: 5000,
    db: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME,
        multipleStatements: true,
    },
    pool_db: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: CONCURRENCY_LIMIT,
        queueLimit: 0,
    },
    router: {
        SAMPLE_PREFIX: "/api/sample",
    },
};
