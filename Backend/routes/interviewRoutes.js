import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview
} from "../controllers/interviewController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createInterview);
router.get("/", getInterviews);
router.get("/:id", getInterviewById);
router.patch("/:id", updateInterview);
router.delete("/:id", deleteInterview);

export default router;