export const appConfig = {
    PORT: process.env.SERVER_PORT || 8080,
    dbConfig: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "password",
        options: {
            host: process.env.DB_HOST || "localhost",
            dialect: "postgres",
            multipleStatements: true,
        },
    },
};
