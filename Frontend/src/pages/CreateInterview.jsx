import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import api from "../services/api";

function CreateInterview() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "",
    experienceLevel: "Beginner",
    topics: "",
    count: "5"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const topics = form.topics
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean)
        .slice(0, 15);

      const interviewData = await api.createInterview({
        role: form.role.trim(),
        experienceLevel: form.experienceLevel,
        topics
      });

      const interview = interviewData.interview || interviewData;

      const questionData = await api.generateQuestions({
        role: form.role.trim(),
        experienceLevel: form.experienceLevel,
        topics,
        count: Number(form.count)
      });

      const questions = questionData.questions || [];

      if (!interview._id || questions.length === 0) {
        throw new Error("The interview or questions could not be created. Please try again.");
      }

      const session = {
        interviewId: interview._id,
        role: form.role.trim(),
        experienceLevel: form.experienceLevel,
        topics,
        questions,
        answers: [],
        currentIndex: 0,
        startedAt: new Date().toISOString()
      };

      localStorage.setItem("currentInterview", JSON.stringify(session));
      navigate("/mock-interview");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container narrow-container">
      <div className="page-heading">
        <span className="heading-icon"><BrainCircuit size={25} /></span>
        <p className="eyebrow">PERSONALIZED PRACTICE</p>
        <h1>Create your interview</h1>
        <p>Choose your target role and let AI prepare relevant interview questions.</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <label htmlFor="role">Target job role</label>
        <input
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="e.g. Full-Stack Developer Intern"
          required
          maxLength={100}
        />

        <label htmlFor="experienceLevel">Experience level</label>
        <select id="experienceLevel" name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <label htmlFor="topics">Skills or topics</label>
        <input
          id="topics"
          name="topics"
          value={form.topics}
          onChange={handleChange}
          placeholder="JavaScript, React, Node.js, MongoDB"
        />
        <span className="field-hint">Separate topics with commas. You can leave this blank.</span>

        <label htmlFor="count">Number of questions</label>
        <select id="count" name="count" value={form.count} onChange={handleChange}>
          <option value="5">5 questions</option>
          <option value="7">7 questions</option>
          <option value="10">10 questions</option>
        </select>

        <button type="submit" className="primary-button full-width" disabled={loading}>
          {loading ? "Preparing your interview..." : <><Sparkles size={18} /> Generate AI questions <ArrowRight size={18} /></>}
        </button>

        <p className="form-note">Your questions will be generated based on your role and selected experience level.</p>
      </form>
    </div>
  );
}

export default CreateInterview;