require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./src/database/index.js");
const AdminRoutes = require("./src/routes/admin.js");

const app = express();
const appPort = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use("/api/admin", AdminRoutes); //to use the routes

app.listen(appPort, async () => {
	console.log("Application Started at: " + appPort);

	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
});
