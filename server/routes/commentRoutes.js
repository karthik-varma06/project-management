import express from "express";
import {
  addComment,
  getTaskComments,
} from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const commentRouter = express.Router();

// Protect all routes
commentRouter.use(protect);

// Add comment
commentRouter.post("/", addComment);

// Get comments for a task
commentRouter.get("/:taskId", getTaskComments);

export default commentRouter;