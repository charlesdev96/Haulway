"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputs = void 0;
const zod_1 = require("zod");
const validateInputs = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            const formattedError = {
                message: e.errors[0].message,
                path: e.errors[0].path.join("."),
            };
            return res.status(400).json(formattedError);
        }
        return res.status(400).send(e.errors);
    }
};
exports.validateInputs = validateInputs;
