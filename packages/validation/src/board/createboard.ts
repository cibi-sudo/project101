import {z} from "zod";

export const createBoardSchema = z.object({
    title : z.string().min(6,{ message: "Title must be at least 6 characters long" })
});

export type createBoardSchemaType = z.infer<typeof createBoardSchema>;