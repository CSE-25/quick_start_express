export const authConfig = {
    PORT: process.env.PORT || 8080,
    DB: {
        HOST: process.env.DB_HOST || "127.0.0.1",
        PORT: process.env.DB_PORT || 27017,
        NAME: process.env.DB_NAME || "auth_db",
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || "default_secret",
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    },
    router: {
        AUTH_PREFIX: "/api/auth",
    },
};
