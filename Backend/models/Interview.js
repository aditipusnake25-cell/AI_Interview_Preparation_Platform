import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "Technical"
    },
    userAnswer: {
      type: String,
      default: ""
    },
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    feedback: {
      type: String,
      default: ""
    },
    suggestedAnswer: {
      type: String,
      default: ""
    },
    strengths: {
      type: [String],
      default: []
    },
    improvements: {
      type: [String],
      default: []
    }
  },
  { _id: true }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true
    },
    topics: {
      type: [String],
      default: []
    },
    questions: {
      type: [answerSchema],
      default: []
    },
    status: {
      type: String,
      enum: ["created", "in-progress", "completed"],
      default: "created"
    },
    averageScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);