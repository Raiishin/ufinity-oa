const { isNull } = require("lodash");

const sequelize = require("../database/index.js");
const Student = require("../database/models/Student.model.js")(sequelize);
const Teacher = require("../database/models/Teacher.model.js")(sequelize);
const RegistrationLog = require("../database/models/RegistrationLog.model.js")(sequelize);

const {
	registerNewStudentsSchema,
	retrieveCommonStudentsSchema,
	suspendStudentSchema,
	canReceiveTeacherNotificationSchema,
} = require("../helpers/validator.js");

Student.hasMany(RegistrationLog, { as: "logs" });
Teacher.hasMany(RegistrationLog, { as: "logs" });

RegistrationLog.belongsTo(Student, { foreignKey: "studentId" });
RegistrationLog.belongsTo(Teacher, { foreignKey: "teacherId" });

const registerNewStudents = async (req, res) => {
	try {
		// Validate req.body
		const { teacher: teacherEmail, students } = registerNewStudentsSchema.parse(req.body);

		// Check if teacher exists
		let teacher = await Teacher.findOne({ where: { email: teacherEmail } });

		// ASSUMPTION: If the teacher does not exist, we will create an entry in the db
		if (isNull(teacher)) {
			teacher = await Teacher.create({ email: teacherEmail, isActive: true });
		}

		for (let i = 0; i < students.length; i++) {
			const studentEmail = students[i];

			// Check if student exists
			let student = await Student.findOne({ where: { email: studentEmail } });

			if (isNull(student)) {
				student = await Student.create({ email: studentEmail, isActive: true });
			} else {
				student.isActive = true;
				await student.save();
			}

			// Check if registrationLog exists
			let registrationLog = await RegistrationLog.findOne({
				where: { studentId: student.dataValues.id, teacherId: teacher.dataValues.id },
			});

			if (isNull(registrationLog)) {
				registrationLog = await RegistrationLog.create({
					studentId: student.dataValues.id,
					teacherId: teacher.dataValues.id,
					isRegistered: true,
				});
			} else {
				registrationLog.isRegistered = true;
				await registrationLog.save();
			}
		}

		return res.json({ message: "Success" });
	} catch (error) {
		return res.json({ message: error.message });
	}
};

const retrieveCommonStudents = async (req, res) => {
	try {
		// Validate req.query
		const { teacher: teacherEmails } = retrieveCommonStudentsSchema.parse(req.query);

		const queries = teacherEmails.map(async (teacherEmail) => {
			const result = await RegistrationLog.findAll({
				attributes: [],
				include: [
					{ model: Student, attributes: ["email"] },
					{ model: Teacher, attributes: [], where: { email: teacherEmail } },
				],
				where: { isRegistered: true },
			});

			return result.map((entry) => entry.dataValues.student.dataValues.email);
		});

		// Execute the queries in parallel
		const results = await Promise.all(queries);

		const teacherStudentObj = {};

		for (let i = 0; i < teacherEmails.length; i++) {
			const teacherEmail = teacherEmails[i];
			teacherStudentObj[teacherEmail] = results[i];
		}

		// Sort out the common students
		const commonStudents = Object.values(teacherStudentObj).reduce((acc, curr) => {
			return acc.filter((value) => curr.includes(value));
		});

		return res.json({ students: commonStudents });
	} catch (error) {
		return res.json({ message: error.message });
	}
};

const suspendStudent = async (req, res) => {
	try {
		// Validate req.body
		const { student: studentEmail } = suspendStudentSchema.parse(req.body);

		// Check if student exists
		const student = await Student.findOne({ where: { email: studentEmail } });

		// If student does not exist, return error message
		if (isNull(student)) {
			return res.status(400).send({ message: "Student does not exist." });
		}

		// If student is already inactive, return error message
		if (!student.dataValues.isActive) {
			return res.status(400).send({ message: "Student has already been suspended." });
		}

		student.isActive = false;
		await student.save();

		return res.json({ message: `Student ${studentEmail} has been successfully suspended.` });
	} catch (error) {
		return res.json({ message: error.message });
	}
};

const canReceiveTeacherNotification = async (req, res) => {
	try {
		// Validate req.body
		const { teacher: teacherEmail, notification } = canReceiveTeacherNotificationSchema.parse(
			req.body
		);

		const recipients = [];

		// Check if thare are any emails mentioned in the notification, indicated by "@"
		if (notification.includes("@")) {
			// Emails mentioned will receive regardless if they are registered with the teacher or not
			const splitNotification = notification.split(" @");

			// 1st element in splitNotification is the message being sent
			for (let i = 1; i < splitNotification.length; i++) {
				const studentEmail = splitNotification[i];

				// Check if student exists
				const student = await Student.findOne({ where: { email: studentEmail, isActive: true } });

				if (!isNull(student)) {
					recipients.push(studentEmail);
				}
			}
		}

		const result = await RegistrationLog.findAll({
			attributes: [],
			include: [
				{ model: Student, attributes: ["email"], where: { isActive: true } },
				{ model: Teacher, attributes: [], where: { email: teacherEmail } },
			],
			where: { isRegistered: true },
		});

		const studentEmails = result.map((entry) => entry.student.email);

		// Dedupe any repeated emails
		const uniqueStudentEmails = [...new Set(recipients.concat(studentEmails))];

		return res.json({ recipients: uniqueStudentEmails });
	} catch (error) {
		return res.json({ message: error.message });
	}
};

module.exports = {
	registerNewStudents,
	retrieveCommonStudents,
	suspendStudent,
	canReceiveTeacherNotification,
};
