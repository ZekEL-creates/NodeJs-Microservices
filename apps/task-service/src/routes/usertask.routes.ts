import { Router } from "express";
import {
  createUserTask,
  deleteTask,
  getSingleTask,
  getUserTasks,
  updateTask,
} from "../controller/user.controller";
import { validateBody } from "shared";
import { taskSchema } from "../schemas/task.schemas";
import { deleteAdminTask, getTasks } from "../controller/admin.controller";
import { getSingleAdminTask } from "../service/admin.service";

export const taskRouter = Router();

//user task routes
taskRouter.post("/add-task", validateBody(taskSchema), createUserTask);
taskRouter.get("/", getUserTasks);
taskRouter.get("/:id", getSingleTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.patch("/:id", updateTask);

//admin task routes
taskRouter.get("/admin", getTasks);
taskRouter.get("/admin/:id", getSingleAdminTask);
taskRouter.delete("/admin/:id", deleteAdminTask);
