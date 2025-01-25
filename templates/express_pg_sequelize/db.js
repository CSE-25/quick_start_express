import { Sequelize } from "sequelize";
import { appConfig } from "./config/appConfig.js";

// Initialize Sequelize
const sequelize = new Sequelize(
    appConfig.dbConfig.database,
    appConfig.dbConfig.username,
    appConfig.dbConfig.password,
    appConfig.dbConfig.options,
);

// Export the Sequelize instance
export default sequelize;
