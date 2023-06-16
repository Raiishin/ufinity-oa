require("dotenv").config();

const sequelize = require("../index.js");

const Student = require("../models/Student.model.js");
const Teacher = require("../models/Teacher.model.js");
const RegistrationLog = require("../models/RegistrationLog.model.js");

const start = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");

		Student(sequelize);
		Teacher(sequelize);
		RegistrationLog(sequelize);
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}

	await sequelize
		.sync({ force: true })
		.then(() => {
			console.log("Tables created successfully!");
		})
		.catch((error) => {
			console.error("Unable to create table : ", error);
		});
};

module.exports = start();
