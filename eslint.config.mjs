// import globals from "globals";
// import tseslint from "typescript-eslint";

// export default [
// 	{ files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
// 	{ languageOptions: { globals: globals.browser } },
// 	overrides: [
// 		{
// 			files: ["**/*.ts"],
// 			rules: {
// 				"@typescript-eslint/no-explicit-any": "off",
// 				"@typescript-eslint/ban-types": "off",
// 				"@typescript-eslint/no-unused-vars": "off",
// 			},
// 		},
// 	],
// 	...tseslint.configs.recommended,
// ];
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
