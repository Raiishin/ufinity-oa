import { Sequelize } from "sequelize";
import express from "express";
import cors from "cors";
import config from "./src/config/index.js";

import AdminRoutes from "./src/routes/admin.js";

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
	host: config.db.host,
	dialect: "mysql",
	port: config.db.port,
});

try {
	await sequelize.authenticate();
	console.log("Connection has been established successfully.");
} catch (error) {
	console.error("Unable to connect to the database:", error);
}

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

app.use(express.json());

app.listen(port, function () {
	console.log("Application Started at: " + port);
});

app.use("/api/admin", AdminRoutes); //to use the routes
