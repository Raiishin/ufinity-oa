const { DataTypes } = require("sequelize");

const Student = (sequelize) => {
	const student = sequelize.define("students", {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
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

	return student;
};

module.exports = Student;
