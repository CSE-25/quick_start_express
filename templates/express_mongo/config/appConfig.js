import os from "os";

const CONCURRENCY_LIMIT = os.availableParallelism();

const appConfig = {
    PORT: process.env.SERVER_PORT || 8080,
    db: {
        connUrl: process.env.DB_CONN_URL || "mongodb://127.0.0.1:27017",
        dbname: process.env.DB_NAME || "test",
        options: {
            maxPoolSize: CONCURRENCY_LIMIT,
        },
    },
    router: {
        SAMPLE_PREFIX: "/api/sample",
    },
};

export { appConfig };
