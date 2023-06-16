const { isArray } = require("lodash");
const { z } = require("zod");

const validEmailSchema = z.string().email();

const registerNewStudentsSchema = z
	.object({
		teacher: validEmailSchema,
		students: z.array(validEmailSchema),
	})
	.strict();

const retrieveCommonStudentsSchema = z
	.object({
		// If there is only 1, teacher will be a string
		// If there is more than 1, teacher will be an array
		// As such, we'll check if it's in an array or string, and handle it accordingly
		teacher: z.preprocess((data) => (isArray(data) ? data : [data]), z.array(validEmailSchema)),
	})
	.strict();

const suspendStudentSchema = z.object({ student: validEmailSchema }).strict();

const canReceiveTeacherNotificationSchema = z
	.object({ teacher: validEmailSchema, notification: z.string() })
	.strict();

module.exports = {
	registerNewStudentsSchema,
	retrieveCommonStudentsSchema,
	suspendStudentSchema,
	canReceiveTeacherNotificationSchema,
};
