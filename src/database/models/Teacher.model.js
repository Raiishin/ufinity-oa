const { DataTypes } = require("sequelize");

const Teacher = (sequelize) => {
	const teacher = sequelize.define("teachers", {
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

	return teacher;
};

module.exports = Teacher;
