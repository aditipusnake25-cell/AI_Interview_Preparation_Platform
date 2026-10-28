import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import Interview from "../models/Interview.js";

const getAIClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from the .env file");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
};

const generateAIResponse = async (prompt) => {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  return response.text || "";
};

const parseAIJSON = (text) => {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("AI returned an invalid response");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
};

export const generateQuestions = async (req, res) => {
  try {
    const {
      role,
      experienceLevel,
      topics = [],
      numberOfQuestions = 5,
      count,
      interviewId
    } = req.body;

    const totalQuestions = Number(count ?? numberOfQuestions);

    if (!role?.trim() || !experienceLevel) {
      return res.status(400).json({
        message: "Role and experience level are required"
      });
    }

    if (!["Beginner", "Intermediate", "Advanced"].includes(experienceLevel)) {
      return res.status(400).json({
        message: "Invalid experience level"
      });
    }

    if (
      !Number.isInteger(totalQuestions) ||
      totalQuestions < 1 ||
      totalQuestions > 10
    ) {
      return res.status(400).json({
        message: "Choose between 1 and 10 questions"
      });
    }

    if (!Array.isArray(topics)) {
      return res.status(400).json({
        message: "Topics must be an array"
      });
    }

    let interview = null;

    if (interviewId) {
      if (!mongoose.isValidObjectId(interviewId)) {
        return res.status(400).json({
          message: "Invalid interview ID"
        });
      }

      interview = await Interview.findOne({
        _id: interviewId,
        user: req.user.id
      });

      if (!interview) {
        return res.status(404).json({
          message: "Interview not found"
        });
      }
    }

    const prompt = `
You are an expert technical interviewer.

Generate exactly ${totalQuestions} interview questions.

Job role: ${role.trim()}
Experience level: ${experienceLevel}
Topics: ${topics.length ? topics.join(", ") : "Relevant skills for the role"}

Requirements:
- Match the difficulty to the experience level.
- Include practical questions relevant to the job.
- Avoid duplicate questions.
- Keep questions clear and concise.
- Return only valid JSON with this structure:
{
  "questions": [
    {
      "question": "Question text",
      "category": "Technical"
    }
  ]
}
`;

    const aiText = await generateAIResponse(prompt);
    const parsed = parseAIJSON(aiText);

    if (
      !Array.isArray(parsed.questions) ||
      parsed.questions.length !== totalQuestions ||
      parsed.questions.some(
        (item) =>
          typeof item.question !== "string" ||
          !item.question.trim()
      )
    ) {
      throw new Error("AI did not return the requested questions");
    }

    const questions = parsed.questions.map((item) => ({
      question: item.question.trim(),
      category:
        typeof item.category === "string" && item.category.trim()
          ? item.category.trim()
          : "Technical"
    }));

    if (interview) {
      interview.questions = questions;
      interview.status = "in-progress";
      await interview.save();
    }

    return res.status(200).json({ questions });
  } catch (error) {
    console.error("Generate questions error:", error.message);

    return res.status(500).json({
      message: "Unable to generate questions. Check your Gemini API configuration."
    });
  }
};

export const evaluateAnswer = async (req, res) => {
  try {
    const {
      question,
      answer,
      role,
      experienceLevel,
      topics = [],
      interviewId
    } = req.body;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      return res.status(400).json({
        message: "Question and answer are required"
      });
    }

    if (answer.trim().length > 10000) {
      return res.status(400).json({
        message: "Answer must be 10000 characters or fewer"
      });
    }

    let interview = null;
    let savedQuestion = null;

    if (interviewId) {
      if (!mongoose.isValidObjectId(interviewId)) {
        return res.status(400).json({
          message: "Invalid interview ID"
        });
      }

      interview = await Interview.findOne({
        _id: interviewId,
        user: req.user.id
      });

      if (!interview) {
        return res.status(404).json({
          message: "Interview not found"
        });
      }

      savedQuestion = interview.questions.find(
        (item) => item.question === question
      );

      if (!savedQuestion) {
        return res.status(400).json({
          message: "Question does not belong to this interview"
        });
      }
    }

    const prompt = `
You are an experienced interviewer and answer evaluator.

Evaluate the candidate's answer fairly and constructively.

Role: ${role || interview?.role || "Not specified"}
Experience level: ${experienceLevel || interview?.experienceLevel || "Not specified"}
Relevant topics: ${
      Array.isArray(topics) ? topics.join(", ") : ""
    }

Question: ${question}

Candidate's answer: ${answer}

Return only valid JSON in this exact structure:
{
  "score": 7,
  "feedback": "Clear overall feedback",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "suggestedAnswer": "A strong sample answer"
}

Rules:
- Score must be a number from 0 to 10.
- Assess accuracy, relevance, clarity and completeness.
- Do not give a high score to an empty or irrelevant answer.
- Keep feedback constructive and specific.
- Return JSON only.
`;

    const aiText = await generateAIResponse(prompt);
    const result = parseAIJSON(aiText);

    const score = Number(result.score);

    if (
      !Number.isFinite(score) ||
      score < 0 ||
      score > 10 ||
      typeof result.feedback !== "string" ||
      typeof result.suggestedAnswer !== "string"
    ) {
      throw new Error("AI returned an invalid evaluation");
    }

    const evaluation = {
      score,
      feedback: result.feedback,
      strengths: Array.isArray(result.strengths)
        ? result.strengths.filter((item) => typeof item === "string")
        : [],
      improvements: Array.isArray(result.improvements)
        ? result.improvements.filter((item) => typeof item === "string")
        : [],
      suggestedAnswer: result.suggestedAnswer
    };

    if (interview && savedQuestion) {
      savedQuestion.userAnswer = answer.trim();
      savedQuestion.score = evaluation.score;
      savedQuestion.feedback = evaluation.feedback;
      savedQuestion.strengths = evaluation.strengths;
      savedQuestion.improvements = evaluation.improvements;
      savedQuestion.suggestedAnswer = evaluation.suggestedAnswer;

      const answeredQuestions = interview.questions.filter(
        (item) => item.userAnswer.trim()
      );

      interview.averageScore = answeredQuestions.length
        ? Number(
            (
              answeredQuestions.reduce(
                (sum, item) => sum + item.score,
                0
              ) / answeredQuestions.length
            ).toFixed(2)
          )
        : 0;

      interview.status =
        answeredQuestions.length === interview.questions.length
          ? "completed"
          : "in-progress";

      await interview.save();
    }

    return res.status(200).json(evaluation);
  } catch (error) {
    console.error("Evaluate answer error:", error.message);

    return res.status(500).json({
      message: "Unable to evaluate answer. Please try again."
    });
  }
};