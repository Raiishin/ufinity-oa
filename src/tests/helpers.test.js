const {
	registerNewStudentsSchema,
	retrieveCommonStudentsSchema,
	suspendStudentSchema,
	canReceiveTeacherNotificationSchema,
} = require("../helpers/validator.js");

describe("Testing Validator Schemas", () => {
	test("registerNewStudentsSchema() - Valid Input", () => {
		try {
			const parsedSchema = registerNewStudentsSchema.parse({
				teacher: "teacherken@gmail.com",
				students: ["studentjon10@gmail.com", "studentjon11@gmail.com", "studentjon13@gmail.com"],
			});

			expect(parsedSchema).toMatchInlineSnapshot(`
{
  "students": [
    "studentjon10@gmail.com",
    "studentjon11@gmail.com",
    "studentjon13@gmail.com",
  ],
  "teacher": "teacherken@gmail.com",
}
`);
		} catch (error) {
			expect(error).toMatchInlineSnapshot();
		}
	});

	test("registerNewStudentsSchema() - Invalid Emails", () => {
		try {
			const parsedSchema = registerNewStudentsSchema.parse({
				teacher: "teacherkengmail.com",
				students: ["studentjon10@gmailcom"],
			});

			expect(parsedSchema).toMatchInlineSnapshot();
		} catch (error) {
			expect(error).toMatchInlineSnapshot(`
[ZodError: [
  {
    "validation": "email",
    "code": "invalid_string",
    "message": "Invalid email",
    "path": [
      "teacher"
    ]
  },
  {
    "validation": "email",
    "code": "invalid_string",
    "message": "Invalid email",
    "path": [
      "students",
      0
    ]
  }
]]
`);
		}
	});

	test("retrieveCommonStudentsSchema() - Valid Input with 1 Email", () => {
		try {
			const parsedSchema = retrieveCommonStudentsSchema.parse({ teacher: "teacherken@gmail.com" });

			expect(parsedSchema).toMatchInlineSnapshot(`
{
  "teacher": [
    "teacherken@gmail.com",
  ],
}
`);
		} catch (error) {
			expect(error).toMatchInlineSnapshot();
		}
	});

	test("retrieveCommonStudentsSchema() - Valid Input with 3 Emails", () => {
		try {
			const parsedSchema = retrieveCommonStudentsSchema.parse({
				teacher: ["teacherken@gmail.com", "teacherken2@gmail.com", "teacherken3@gmail.com"],
			});

			expect(parsedSchema).toMatchInlineSnapshot(`
{
  "teacher": [
    "teacherken@gmail.com",
    "teacherken2@gmail.com",
    "teacherken3@gmail.com",
  ],
}
`);
		} catch (error) {
			expect(error).toMatchInlineSnapshot();
		}
	});

	test("retrieveCommonStudentsSchema() - Invalid Input", () => {
		try {
			const parsedSchema = retrieveCommonStudentsSchema.parse({ teacher: ["teacherkengmail.com"] });

			expect(parsedSchema).toMatchInlineSnapshot();
		} catch (error) {
			expect(error).toMatchInlineSnapshot(`
[ZodError: [
  {
    "validation": "email",
    "code": "invalid_string",
    "message": "Invalid email",
    "path": [
      "teacher",
      0
    ]
  }
]]
`);
		}
	});

	test("suspendStudentSchema() - Valid Input", () => {
		try {
			const parsedSchema = suspendStudentSchema.parse({ student: "studentjon@gmail.com" });

			expect(parsedSchema).toMatchInlineSnapshot(`
{
  "student": "studentjon@gmail.com",
}
`);
		} catch (error) {
			expect(error).toMatchInlineSnapshot();
		}
	});

	test("suspendStudentSchema() - Invalid Input", () => {
		try {
			const parsedSchema = suspendStudentSchema.parse({ student: "studentjon@gmailcom" });

			expect(parsedSchema).toMatchInlineSnapshot();
		} catch (error) {
			expect(error).toMatchInlineSnapshot(`
[ZodError: [
  {
    "validation": "email",
    "code": "invalid_string",
    "message": "Invalid email",
    "path": [
      "student"
    ]
  }
]]
`);
		}
	});

	test("canReceiveTeacherNotificationSchema() - Valid Input", () => {
		try {
			const parsedSchema = canReceiveTeacherNotificationSchema.parse({
				teacher: "teacherken@gmail.com",
				notification:
					"Hello students! @studentagnes@gmail.com @studentmiche@gmail.com @studentjon10@gmail.com",
			});

			expect(parsedSchema).toMatchInlineSnapshot(`
{
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com @studentjon10@gmail.com",
  "teacher": "teacherken@gmail.com",
}
`);
		} catch (error) {
			expect(error).toMatchInlineSnapshot();
		}
	});

	test("canReceiveTeacherNotificationSchema() - Invalid Input", () => {
		try {
			const parsedSchema = canReceiveTeacherNotificationSchema.parse({
				teacher: "1",
				notification: 1,
			});

			expect(parsedSchema).toMatchInlineSnapshot();
		} catch (error) {
			expect(error).toMatchInlineSnapshot(`
[ZodError: [
  {
    "validation": "email",
    "code": "invalid_string",
    "message": "Invalid email",
    "path": [
      "teacher"
    ]
  },
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "number",
    "path": [
      "notification"
    ],
    "message": "Expected string, received number"
  }
]]
`);
		}
	});
});
