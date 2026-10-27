import { z } from "zod/v3";

export const taskSchema = z.object({
  title: z.string().min(6, "Add title please"),
});

export type TaskInput = z.infer<typeof taskSchema>;
