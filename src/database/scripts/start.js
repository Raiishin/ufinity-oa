require("dotenv").config();
const { Sequelize } = require("sequelize");

const Student = require("../models/Student.model.js");
const Teacher = require("../models/Teacher.model.js");
const RegistrationLog = require("../models/RegistrationLog.model.js");
const configJson = require("../../config/config.json");

const { database, username, password, host, dialect, port } = configJson[process.env.environment];

const sequelize = new Sequelize(database, username, password, { host, dialect, port });

const start = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");

		const studentModel = Student(sequelize);
		const teacherModel = Teacher(sequelize);
		const registrationLogModel = RegistrationLog(sequelize);

		studentModel.hasMany(registrationLogModel);
		teacherModel.hasMany(registrationLogModel);
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
