import { Router } from "express";
import { getWorkflowsByTask } from "../controller/workflow.controller";

export const workflowRouter = Router();

workflowRouter.get("/:taskId/workflows", getWorkflowsByTask);
