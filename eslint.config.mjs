export default {
	overrides: [
		{
			files: ["**/*.js"],
			languageOptions: { sourceType: "commonjs" },
		},
		{
			files: ["**/*.ts"],
			rules: {
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/ban-types": "off",
				"@typescript-eslint/no-unused-vars": "off",
			},
		},
	],
};
