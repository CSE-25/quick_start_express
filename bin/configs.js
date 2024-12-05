export const metadata = {
  command: "qse",
  name: "Quick Start Express",
  version: "v1.0.4-beta",
  description:
    "A simple CLI tool to generate Express servers from multiple available templates.",
  oneLineDescription: "A simple Express.js server generator CLI tool.",
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

export const templates = {
  basic: {
    name: "basic",
    dependencies: [
      {
        name: "express",
        version: "^4.17.1",
      },
    ],
  },
  express_pg_sequelize: {
    name: "express_pg_sequelize",
    dependencies: [
      {
        name: "express",
        version: "^4.17.1",
      },
      {
        name: "pg",
        version: "^8.6.0",
      },
      {
        name: "pg-hstore",
        version: "^2.3.4",
      },
      {
        name: "sequelize",
        version: "^6.6.5",
      },
      {
        name: "dotenv",
        version: "^16.4.1",
      },
    ],
  },
  express_mysql: {
    name: "express_mysql",
    dependencies: [
      {
        name: "express",
        version: "^4.17.1",
      },
      {
        name: "cors",
        version: "^2.8.5",
      },
      {
        name: "fs",
        version: "^0.0.1-security",
      },
      {
        name: "helmet",
        version: "^8.0.0",
      },
      {
        name: "mysql2",
        version: "^3.11.3",
      },
    ],
  },
  express_mongo_ts: {
    name: "express_mongo_ts",
    dependencies: [
      {
        "name": "@types/bcrypt",
        "version": "^5.0.2"
      },
      {
        "name": "@types/cookie-parser",
        "version": "^1.4.7"
      },
      {
        "name": "@types/cors",
        "version": "^2.8.17"
      },
      {
        "name": "@types/dotenv",
        "version": "^8.2.3"
      },
      {
        "name": "@types/express",
        "version": "^5.0.0"
      },
      {
        "name": "@types/mongoose",
        "version": "^5.11.97"
      },
      {
        "name": "@types/morgan",
        "version": "^1.9.9"
      },
      {
        "name": "@types/node",
        "version": "^22.9.0"
      },
      {
        "name": "bcrypt",
        "version": "^5.1.1"
      },
      {
        "name": "cookie-parser",
        "version": "^1.4.7"
      },
      {
        "name": "cors",
        "version": "^2.8.5"
      },
      {
        "name": "dotenv",
        "version": "^16.4.5"
      },
      {
        "name": "env-var",
        "version": "^7.5.0"
      },
      {
        "name": "express",
        "version": "^4.21.1"
      },
      {
        "name": "helmet",
        "version": "^8.0.0"
      },
      {
        "name": "http-errors",
        "version": "^2.0.0"
      },
      {
        "name": "mongoose",
        "version": "^8.8.1"
      },
      {
        "name": "morgan",
        "version": "^1.10.0"
      },
      {
        "name": "nodemon",
        "version": "^3.1.7"
      },
      {
        "name": "ts-node",
        "version": "^10.9.2"
      },
      {
        "name": "typescript",
        "version": "^5.6.3"
      }
    ]
  },
};
