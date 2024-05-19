import { z } from "zod";

export const createreplySchema = z.object({
	body: z.object({
		reply: z.string({ required_error: "Please leave a reply on the comment" }),
		comment: z.string().optional(),
		replier: z.string().optional(),
		post: z.string().optional(),
	}),
	params: z.object({
		commentId: z.string({
			required_error: "Please provide the id of the comment",
		}),
		postId: z.string({
			required_error: "Please provide the id of the Post",
		}),
	}),
});

export const editReplySchema = z.object({
	body: z.object({
		reply: z.string({
			required_error: "Please provide the reply",
		}),
	}),
	params: z.object({
		replyId: z.string({
			required_error: "Please provide the id of the reply",
		}),
	}),
});

export const deleteReplySchema = z.object({
	params: z.object({
		replyId: z.string({
			required_error: "Please provide the id of the reply",
		}),
	}),
});

export type createreplyInputs = z.infer<typeof createreplySchema>;
export type editReplyInputs = z.infer<typeof editReplySchema>;
export type deleteReplyInputs = z.infer<typeof deleteReplySchema>["params"];
