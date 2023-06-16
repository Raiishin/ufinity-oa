"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"students",
			[
				{
					email: "studentjeremy@gmail.com",
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					email: "studentnancy@gmail.com",
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					email: "studentharry@gmail.com",
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					email: "studentpotter@gmail.com",
					isActive: false,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					email: "studentjim@gmail.com",
					isActive: false,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("students", null, {});
	},
};
