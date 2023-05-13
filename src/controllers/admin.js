import { isArray } from "lodash-es";
import config from "../config/index.js";
import mysql from "mysql";

const con = mysql.createConnection({
	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: "db",
	port: config.db.port,
});

// Sample student table
// | id | email | is_active |
// Example : | 1 | studentmary@gmail.com | 1 |
// Example : | 2 | studentjohn@gmail.com | 0 |

// Sample registration_log table
// | id | teacher_email | student_email | is_registered |
// Example : | 1 | teacher@email.com | student@email.com | 1 |
// Example : | 2 | teacher@email.com | student@email.com | 0 |

const registerNewStudents = async (req, res) => {
	const { teacher: teacherEmail, students } = req.body;

	try {
		// When this api is being called, studentEmails will likely be in a JSON string if the api is being called from an app
		// As such, we'll check if it's in an array or string, and handle it accordingly
		const studentEmails = !isArray(students) ? JSON.parse(students) : students;

		for (let i = 0; i < studentEmails.length; i++) {
			const studentEmail = studentEmails[i];

			await new Promise((resolve, reject) => {
				// Make SQL query to registration_log table
				const checkIfStudentExistsQuery = `SELECT * FROM student WHERE email = '${studentEmail}'`;
				con.query(checkIfStudentExistsQuery, (err, result) => {
					if (err) reject(err);

					// Check if student exists
					if (result.length === 0) {
						// If not, create new student
						const insertStudentQuery = `INSERT INTO student (email, is_active) VALUES ('${studentEmail}', TRUE)`;
						con.query(insertStudentQuery, (err, result) => {
							if (err) reject(err);
						});
					} else {
						const studentDetails = result[0];

						// Check if student is active
						if (!studentDetails.is_active) {
							// If student is not active, set is_active to TRUE
							const updateStudentQuery = `UPDATE student SET is_active = TRUE WHERE email = ${studentEmail}`;
							con.query(updateStudentQuery, (err, result) => {
								if (err) reject(err);
							});
						}
					}
				});

				const insertRegistrationLogQuery = `INSERT INTO registration_log (teacher_email, student_email, is_registered) VALUES ('${teacherEmail}', '${studentEmail}', TRUE)`;
				con.query(insertRegistrationLogQuery, (err, result) => {
					if (err) reject(err);
				});

				resolve();
			});
		}

		return res.json("Success");
	} catch (error) {
		return res.json({ message: error.message });
	}
};

const retrieveCommonStudents = async (req, res) => {
	const { teacher: teacherEmails } = req.query;

	try {
		// If there is only 1, teacher will be a string
		// If there is more than 1, teacher will be an array
		// As such, we'll check if it's in an array or string, and handle it accordingly
		const teacherEmailsArray = isArray(teacherEmails) ? teacherEmails : [teacherEmails];
		const teacherEmailsArrayString = teacherEmailsArray.map((email) => `'${email}'`).join(",");

		const result = await new Promise((resolve, reject) => {
			// Make SQL query to registration_log table
			const commonStudentsQuery = `SELECT student_email from registration_log WHERE teacher_email IN (${teacherEmailsArrayString}) AND is_registered = TRUE GROUP BY student_email HAVING COUNT(DISTINCT teacher_email) = ${teacherEmailsArray.length}`;
			con.query(commonStudentsQuery, (err, result) => {
				if (err) reject(err);
				else resolve(result);
			});
		});

		const commonStudents = result.map((entry) => entry.student_email);

		return res.json({ students: commonStudents });
	} catch (error) {
		return res.json({ message: error.message });
	}
};

const suspendStudent = async (req, res) => {
	const { student: studentEmail } = req.body;

	try {
		await new Promise((resolve, reject) => {
			// Make SQL query to registration_log table
			const checkIfStudentExistsQuery = `SELECT * FROM student WHERE email = '${studentEmail}'`;
			con.query(checkIfStudentExistsQuery, (err, result) => {
				if (err) reject(err);

				// Check if student exists
				if (result.length === 0) {
					// If no, throw error
					return res.json({ message: "Student does not exist." });
				} else {
					// Check if the student is already suspended
					if (result[0].is_active === 1) {
						// If yes, suspend student
						const updateStudentQuery = `UPDATE student SET is_active = FALSE WHERE email = '${studentEmail}'`;
						con.query(updateStudentQuery, (err, result) => {
							if (err) reject(err);
							resolve(result);
						});
					} else {
						return res.json({ message: "Student has already been suspended." });
					}
				}
			});
		});

		return res.json(`Student ${studentEmail} has been successfully suspended.`);
	} catch (error) {
		return res.json({ message: error.message });
	}
};

const canReceiveTeacherNotification = async (req, res) => {
	const { teacher: teacherEmail, notification } = req.body;

	const recipients = [];

	try {
		// Check if thare are any emails mentioned in the notification, indicated by "@"
		if (notification.includes("@")) {
			// Emails mentioned will receive regardless if they are registered with the teacher or not
			const splitNotification = notification.split(" @");

			// 1st element in splitNotification is the message being sent
			for (let i = 1; i < splitNotification.length; i++) {
				const studentEmail = splitNotification[i];
				recipients.push(studentEmail);
			}
		}

		const result = await new Promise((resolve, reject) => {
			const getRegisteredStudentsQuery = `SELECT DISTINCT(student_email) from registration_log WHERE teacher_email = '${teacherEmail}' AND is_registered = TRUE`;
			con.query(getRegisteredStudentsQuery, (err, result) => {
				if (err) throw reject(err);

				// Assuming the data structure is result = {student_email: []}
				const studentEmails = result.map((entry) => entry.student_email);
				resolve(studentEmails);
			});
		});

		// Dedupe any repeated emails
		const uniqueStudentEmails = [...new Set(recipients.concat(result))];

		return res.json({ recipients: uniqueStudentEmails });
	} catch (error) {
		return res.json({ message: error.message });
	}
};

export default {
	registerNewStudents,
	retrieveCommonStudents,
	suspendStudent,
	canReceiveTeacherNotification,
};
