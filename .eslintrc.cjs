/* eslint-env node */
module.exports = {
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	root: true,
	overrides: [
		{
			files: ["*.ts", "*.tsx", ".js"], // Adjust the pattern as needed
			rules: {
				"@typescript-eslint/no-explicit-any": "off",
			},
		},
	],
};
