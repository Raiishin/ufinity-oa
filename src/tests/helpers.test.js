const { isEmailValid } = require("../helpers/index.js");

describe("Testing Helper Functions", () => {
	test("isEmailValid() - Valid Input", () => {
		const testEmail = "example@example.com";
		expect(isEmailValid(testEmail)).toMatchInlineSnapshot(`true`);
	});

	test("isEmailValid() - Invalid Input", () => {
		const testEmail = "invalid_email@example";
		expect(isEmailValid(testEmail)).toMatchInlineSnapshot(`false`);
	});
});
