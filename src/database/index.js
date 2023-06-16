const { Sequelize } = require("sequelize");

const configJson = require("../config/config.json");
const { database, username, password, host, dialect, port } = configJson[process.env.environment];
const sequelize = new Sequelize(database, username, password, { host, dialect, port });

module.exports = sequelize;
