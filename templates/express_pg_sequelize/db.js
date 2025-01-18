import { Sequelize } from "sequelize";

// Initialize Sequelize
const sequelize = new Sequelize("database_name", "username", "password", {
    host: "localhost",
    dialect: "postgres",
});

// Export the Sequelize instance
export default sequelize;
