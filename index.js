import express from "express";
import cors from "cors";
import mysql from "mysql";

import config from "./src/config/index.js";

import AdminRoutes from "./src/routes/admin.js";

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

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

app.use(express.json());

app.listen(port, function () {
	console.log("Application Started at: " + port);
});

app.use("/api/admin", AdminRoutes); //to use the routes

con.connect((err) => {
	try {
		if (err) throw err;
		console.log("Connected!");

		// Set up SQL table
		const createStudentTable =
			"CREATE TABLE if not exists student (email VARCHAR(255), is_active BOOLEAN)";
		con.query(createStudentTable, (err, result) => {
			if (err) throw err;
			console.log("student Table created");
		});

		const createRegistrationLogTable =
			"CREATE TABLE if not exists registration_log (teacher_email VARCHAR(255), student_email VARCHAR(255), is_registered BOOLEAN)";
		con.query(createRegistrationLogTable, (err, result) => {
			if (err) throw err;
			console.log("registration_log Table created");
		});

		console.log("Database is ready to go!");
	} catch (error) {
		console.log(error);
	}
});
