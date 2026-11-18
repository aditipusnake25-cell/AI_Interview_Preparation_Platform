import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BrainCircuit, Sparkles, Check, WandSparkles } from "lucide-react";
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
    <div className="page-container">
      <div className="page-intro">
        <span className="eyebrow"><Sparkles size={14} /> PERSONALIZED PRACTICE</span>
        <h1>Build your practice session</h1>
        <p>Tell us what you’re preparing for. We’ll shape the questions around you.</p>
      </div>

      <div className="setup-layout">
        <form className="form-card setup-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-section-title">
          <span className="section-index">01</span>
          <div><h2>Set your direction</h2><p>Choose a role and experience level.</p></div>
        </div>

        <label htmlFor="role">Target job role <span className="required-mark">*</span></label>
        <input
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="e.g. Full-Stack Developer Intern"
          required
          maxLength={100}
        />

        <div className="field-grid">
        <div>
        <label htmlFor="experienceLevel">Experience level</label>
        <select id="experienceLevel" name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        </div>

        <div>
        <label htmlFor="topics">Skills or topics</label>
        <input
          id="topics"
          name="topics"
          value={form.topics}
          onChange={handleChange}
          placeholder="JavaScript, React, Node.js, MongoDB"
        />
        <span className="field-hint">Separate topics with commas. You can leave this blank.</span>
        </div>
        </div>

        <div className="form-section-title form-section-spaced">
          <span className="section-index">02</span>
          <div><h2>Make it your own</h2><p>Choose how many questions to practice.</p></div>
        </div>

        <label htmlFor="count">Session length</label>
        <select id="count" name="count" value={form.count} onChange={handleChange}>
          <option value="5">5 questions</option>
          <option value="7">7 questions</option>
          <option value="10">10 questions</option>
        </select>

        <button type="submit" className="primary-button full-width" disabled={loading}>
          {loading ? "Preparing your interview..." : <><WandSparkles size={18} /> Generate my questions <ArrowRight size={18} /></>}
        </button>

        <p className="form-note">Your questions will be generated based on your role and selected experience level.</p>
      </form>
      <aside className="setup-aside">
        <div className="setup-preview">
          <span className="preview-icon"><BrainCircuit size={23} /></span>
          <span className="eyebrow">SESSION PREVIEW</span>
          <h2>Your next interview, tailored.</h2>
          <p>MockMind will use your choices to prepare a focused set of questions for your practice.</p>
          <div className="preview-details">
            <div><Check size={16} /><span>Questions tailored to your role</span></div>
            <div><Check size={16} /><span>Feedback after every answer</span></div>
            <div><Check size={16} /><span>Actionable suggestions to improve</span></div>
          </div>
        </div>
        <div className="privacy-note"><Sparkles size={17} /><span>Your session is connected to your account and ready whenever you are.</span></div>
      </aside>
      </div>
    </div>
  );
}

export default CreateInterview;