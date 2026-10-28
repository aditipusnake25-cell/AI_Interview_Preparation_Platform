import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  generateQuestions,
  evaluateAnswer
} from "../controllers/aiController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/generate-questions", generateQuestions);
router.post("/evaluate-answer", evaluateAnswer);

export default router;