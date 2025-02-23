import { templates } from "../configs.js";
import chalk from "chalk";
import { confirmationQuestion, selectionQuestion } from "./question/index.js";
import { askConfirmation, askSelection } from "./question/inquirer.js";

// const confirmQuestion = (confirmationQuestion(askConfirmation));
// const selectQuestion = selectionQuestion(askSelection);

export async function userPrompts(needDB) {
    let runtimeNeedDB = false;    

    if (needDB) {
        runtimeNeedDB = await askConfirmation(
            "Do you wish to containerize DB service? (Default: Yes)",
            true,
        );
    }

    const addCacheService = await askConfirmation(
        "Do you want to add a cache service? (Default: No)",
        false,
    );

    return { runtimeNeedDB, addCacheService };
}

async function promptCacheService(packageName) {
    // Predefined list of cache images.
    const cacheImages = [
        "redis:latest",
        "redis:6.2",
        "redis:7.0",
        "memcached:latest",
        "amazon/aws-elasticache:redis",
    ];

    const image = await askSelection(
        "Select the Docker image for the cache service:",
        cacheImages,
    );

    let ports;
    switch (image) {
        case "redis:latest":
        case "redis:6.2":
        case "redis:7.0":
            ports = ["6379:6379"];
            break;
        case "memcached:latest":
            ports = ["11211:11211"];
            break;
        case "amazon/aws-elasticache:redis":
            ports = ["6379:6379"];
            break;
        default:
            throw new Error("Cache Image not Found!");
    }

    return {
        name: `${packageName}_cache`,
        image: image,
        containerName: `${packageName}_cache_container`,
        ports: ports,
    };
}

export async function getServicesData(
    packageName,
    selectedTemplate,
    needDB,
    addCacheService,
) {
    const templateData = templates[selectedTemplate];
    const services = [];

    console.log(chalk.bold(chalk.green("Docker Compose Configuration")));

    // App service configuration.
    const appService = {
        name: packageName,
        containerName: `${packageName}_container`,
        build: true,
        ports: [templateData.serverPort],
    };

    // Database service configuration
    if (needDB) {
        const dbService = {
            name: `${packageName}_db`,
            image: templateData.dbDockerImage,
            containerName: `${packageName}_db_container`,
            ports: [templateData.dbPort],
        };
        services.push(dbService);
    }

    if (addCacheService) {
        services.push(await promptCacheService(packageName));
    }

    services.push(appService);
    console.log();
    return services;
}

// Generates the File content for docker-compose.yml using the services data
export function generateDockerComposeFile(
    needDB,
    services,
    packageName,
    selectedTemplate,
) {
    const templateData = templates[selectedTemplate];
    const compose = {
        version: "3.8",
        services: {},
        volumes: {},
    };

    let appServiceName = "";
    services.forEach((service) => {
        const serviceConfig = {
            container_name: service.containerName,
            ports: service.ports?.length > 0 ? service.ports : undefined,
            restart: "on-failure",
            env_file: [".env"],
        };

        // service.build is enabled only for app server.
        if (service.build) {
            serviceConfig.build = { context: "." };
            if (templateData.isUrl === false && needDB === true) {
                serviceConfig.environment = { DB_HOST: "host.docker.internal" };
            }
            appServiceName = service.name;
        } else {
            serviceConfig.image = service.image;
            if (service.name.endsWith("_db")) {
                if (templateData.dbName === "Postgres") {
                    serviceConfig.environment = {
                        POSTGRES_PASSWORD: "${DB_PASSWORD}",
                        POSTGRES_DATABASE: "${DB_NAME}",
                    };
                } else if (templateData.dbName === "MySQL") {
                    serviceConfig.environment = {
                        MYSQL_ROOT_PASSWORD: "${DB_PASSWORD}",
                        MYSQL_DATABASE: "${DB_NAME}",
                    };
                }
                const volumeName = `${service.name}_data`;
                serviceConfig.volumes = [
                    `${volumeName}:${templateData.dbDataPath}`,
                ];
                compose.volumes[volumeName] = {};
            }
        }
        compose.services[service.name] = serviceConfig;
    });

    if (appServiceName) {
        const dependencies = Object.keys(compose.services).filter(
            (name) => name !== appServiceName,
        );
        if (dependencies.length > 0) {
            compose.services[appServiceName].depends_on = dependencies;
        }
    }

    const yaml = `
name: ${packageName}
services:
${Object.entries(compose.services)
    .map(([name, config]) => {
        const build = config.build
            ? `      build:\n        context: ${config.build.context}`
            : `      image: ${config.image}`;
        const ports = config.ports
            ? `      ports:\n${config.ports
                  .map((port) => `        - "${port}"`)
                  .join("\n")}`
            : "";
        const envFile = config.env_file
            ? `      env_file:\n${config.env_file
                  .map((file) => `        - ${file}`)
                  .join("\n")}`
            : "";
        const dependsOn = config.depends_on
            ? `      depends_on:\n${config.depends_on
                  .map((dep) => `        - ${dep}`)
                  .join("\n")}`
            : "";
        const environment = config.environment
            ? `      environment:\n${Object.entries(config.environment)
                  .map(([key, value]) => `        ${key}: ${value}`)
                  .join("\n")}`
            : "";
        const volumes =
            config.volumes && needDB
                ? `      volumes:\n${config.volumes
                      .map((volume) => `        - ${volume}`)
                      .join("\n")}`
                : "";

        return `  ${name}:
${build}
      container_name: ${config.container_name}
${ports}
${envFile}
${environment}
${volumes}
${dependsOn}
      restart: ${config.restart}`;
    })
    .join("\n\n")}
${
    needDB
        ? `\nvolumes:\n${Object.keys(compose.volumes)
              .map((volume) => `  ${volume}:`)
              .join("\n")}`
        : ""
}`;

    return yaml.trim();
}
