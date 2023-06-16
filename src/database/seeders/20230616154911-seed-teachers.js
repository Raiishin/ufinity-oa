"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"teachers",
			[
				{
					email: "teacherjohn@gmail.com",
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					email: "teachertom@gmail.com",
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					email: "teachermary@gmail.com",
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					email: "teacherdoe@gmail.com",
					isActive: false,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					email: "teacherjerry@gmail.com",
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("teachers", null, {});
	},
};
