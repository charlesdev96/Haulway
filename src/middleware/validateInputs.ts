import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validateInputs =
	(schema: z.AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (e: any) {
			if (e instanceof ZodError) {
				const formattedError = {
					message: e.errors[0].message,
					path: e.errors[0].path.join("."),
				};
				return res.status(400).json(formattedError);
			}
			return res.status(400).send(e.errors);
		}
	};
