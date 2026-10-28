import Interview from "../models/Interview.js";
import mongoose from "mongoose";

const validLevels = ["Beginner", "Intermediate", "Advanced"];

export const createInterview = async (req, res) => {
  try {
    const { role, experienceLevel, topics = [] } = req.body;

    if (!role?.trim() || !experienceLevel) {
      return res.status(400).json({
        message: "Role and experience level are required"
      });
    }

    if (!validLevels.includes(experienceLevel)) {
      return res.status(400).json({
        message: "Invalid experience level"
      });
    }

    if (!Array.isArray(topics) || topics.length > 15) {
      return res.status(400).json({
        message: "Topics must be an array containing at most 15 items"
      });
    }

    const interview = await Interview.create({
      user: req.user.id,
      role: role.trim(),
      experienceLevel,
      topics: topics
        .filter((topic) => typeof topic === "string")
        .map((topic) => topic.trim())
        .filter(Boolean)
    });

    return res.status(201).json({
      message: "Interview created successfully",
      interview
    });
  } catch (error) {
    console.error("Create interview error:", error.message);

    return res.status(500).json({
      message: "Unable to create interview"
    });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({ interviews });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve interviews"
    });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid interview ID"
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    return res.status(200).json({ interview });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve interview"
    });
  }
};

export const updateInterview = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid interview ID"
      });
    }

    const { role, experienceLevel, topics, status } = req.body;
    const updates = {};

    if (role !== undefined) {
      if (typeof role !== "string" || !role.trim()) {
        return res.status(400).json({
          message: "Role cannot be empty"
        });
      }
      updates.role = role.trim();
    }

    if (experienceLevel !== undefined) {
      if (!validLevels.includes(experienceLevel)) {
        return res.status(400).json({
          message: "Invalid experience level"
        });
      }
      updates.experienceLevel = experienceLevel;
    }

    if (topics !== undefined) {
      if (!Array.isArray(topics) || topics.length > 15) {
        return res.status(400).json({
          message: "Topics must be an array containing at most 15 items"
        });
      }

      updates.topics = topics
        .filter((topic) => typeof topic === "string")
        .map((topic) => topic.trim())
        .filter(Boolean);
    }

    if (status !== undefined) {
      if (!["created", "in-progress", "completed"].includes(status)) {
        return res.status(400).json({
          message: "Invalid interview status"
        });
      }
      updates.status = status;
    }

    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    return res.status(200).json({
      message: "Interview updated successfully",
      interview
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update interview"
    });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid interview ID"
      });
    }

    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      });
    }

    return res.status(200).json({
      message: "Interview deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete interview"
    });
  }
};