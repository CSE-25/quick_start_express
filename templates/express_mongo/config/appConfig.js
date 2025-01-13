const CONCURRENCY_LIMIT = 4;

const appConfig = {
    PORT: 3000,
    db: {
        options: {
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 27017,
            dbname: process.env.DB_NAME || 'test',
            user: process.env.DB_USER || '',
            pass: process.env.DB_PASSWORD || '',
            maxPoolSize: CONCURRENCY_LIMIT,
        }
    },
    router: {
        SAMPLE_PREFIX: "/api/sample",
    },
}

export { appConfig }