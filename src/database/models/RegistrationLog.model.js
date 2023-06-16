const { DataTypes } = require("sequelize");

const RegistrationLog = (sequelize) => {
	const registrationLog = sequelize.define("registration_logs", {
		isRegistered: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		studentId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		teacherId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: true,
			type: DataTypes.DATE,
		},
	});

	return registrationLog;
};

module.exports = RegistrationLog;
