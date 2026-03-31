import express from "express";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

// Create task
taskRouter.post("/", createTask);

// Update task
taskRouter.put("/:id", updateTask);

// Delete multiple tasks
taskRouter.post("/delete", deleteTask);

export default taskRouter;