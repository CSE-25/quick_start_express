export const metadata = {
    command: "qse",
    name: "Quick Start Express",
    version: "v2.0.0",
    description:
        "A simple CLI tool to generate Express servers from multiple available templates.",
    oneLineDescription:
        "Welcome to QSE: A simple Express.js server generator CLI tool.",
};

export const commands = {
    version: {
        command: "-v, --version",
        description: "Prints current qse version",
    },
    init: {
        command: "init",
        description: "Initialize a new Express server.",
        options: [
            {
                flags: "-t, --template <template>",
                description: "Specify template to use",
            },
            {
                flags: "-n, --name <name>",
                description: "Specify the name of the package",
            },
            {
                flags: "--docker-compose",
                description: "Generate a Docker Compose file in the project.",
            },
            {
                flags: "--remove-nodemon",
                description: "Disable hot-reload support using nodemon",
            },
            {
                flags: "--remove-deps",
                description: "Do not install the dependencies",
            },
            {
                flags: "--add-cache-service",
                description: "Add a cache service to the Docker Compose file.",
            },
        ],
    },
    list: {
        command: "list",
        description: "List all available commands and options.",
    },
    clear: {
        command: "clear",
        description: "Clear the directory.",
    },
};

/**
 * Template Properties:
 * - name (string): Unique identifier for the template.
 * - isUrl (boolean): Indicates whether the template requires URL-based DB_HOST.
 * - needDB (boolean): Specifies if the template included a database service.
 * - dbPort (string): The port mapping for the database service in "host:container" format.
 * - dbName (string): Type of database used in the temaplate (e.g., "Postgres", "MySQL").
 * - serverPort (string): Port mapping for the application server in "host:container" format.
 * - dbDockerImage (string): Docker image to use for the database service.
 * - dbDataPath (string): Path of the directory inside which the database container stores its persistent data.
 **/
export const templates = {
    basic: {
        name: "basic",
        isUrl: false,
        needDB: false,
        serverPort: "8080:8080",
    },
    basic_ts: {
        name: "basic_ts",
        isUrl: false,
        needDB: false,
        serverPort: "8080:8080",
    },
    express_pg: {
        name: "express_pg",
        isUrl: false,
        needDB: true,
        dbPort: "5432:5432",
        dbName: "Postgres",
        serverPort: "8080:8080",
        dbDockerImage: "postgres:latest",
        dbDataPath: "/var/lib/postgresql/data",
    },
    express_pg_sequelize: {
        name: "express_pg_sequelize",
        isUrl: false,
        needDB: true,
        dbPort: "5432:5432",
        dbName: "Postgres",
        serverPort: "8080:8080",
        dbDockerImage: "postgres:latest",
        dbDataPath: "/var/lib/postgresql/data",
    },
    express_mongo: {
        name: "express_mongo",
        isUrl: true,
        needDB: true,
        dbPort: "27017:27017",
        dbName: "MongoDB",
        serverPort: "8080:8080",
        dbDockerImage: "mongo:latest",
        dbDataPath: "/data/db",
    },
    express_mysql: {
        name: "express_mysql",
        isUrl: false,
        needDB: true,
        dbPort: "3306:3306",
        dbName: "MySQL",
        serverPort: "8080:8080",
        dbDockerImage: "mysql:latest",
        dbDataPath: "/var/lib/mysql",
    },
    express_pg_prisma: {
        name: "express_pg_prisma",
        isUrl: true,
        needDB: true,
        dbPort: "5432:5432",
        dbName: "Postgres",
        serverPort: "8080:8080",
        dbDockerImage: "postgres:latest",
        dbDataPath: "/var/lib/postgresql/data",
    },
    express_oauth_microsoft: {
        isUrl: false,
        needDB: false,
        name: "express_oauth_microsoft",
        serverPort: "8080:8080",
    },
    express_oauth_google: {
        isUrl: false,
        needDB: false,
        name: "express_oauth_google",
        serverPort: "8080:8080",
    },
};
