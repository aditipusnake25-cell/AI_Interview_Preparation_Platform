import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react";
import api from "../services/api";

function MockInterview() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentInterview") || "null");
    } catch {
      return null;
    }
  });

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session || !session.questions?.length) {
      navigate("/create-interview", { replace: true });
    }
  }, [session, navigate]);

  if (!session || !session.questions?.length) {
    return null;
  }

  const index = session.currentIndex || 0;
  const question = session.questions[index];
  const total = session.questions.length;
  const progress = ((index + 1) / total) * 100;

  const submitAnswer = async (event) => {
    event.preventDefault();
    setError("");

    if (answer.trim().length < 5) {
      setError("Please enter an answer with at least 5 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await api.evaluateAnswer({
        question: question.question,
        answer: answer.trim(),
        role: session.role,
        experienceLevel: session.experienceLevel,
        topics: session.topics
      });

      setFeedback(result.evaluation || result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    const answers = [
      ...(session.answers || []),
      {
        question: question.question,
        answer: answer.trim(),
        evaluation: feedback
      }
    ];

    const updatedSession = { ...session, answers };

    if (index + 1 >= total) {
      localStorage.setItem("currentInterview", JSON.stringify(updatedSession));
      localStorage.setItem("lastInterviewResult", JSON.stringify(updatedSession));
      navigate("/result");
      return;
    }

    updatedSession.currentIndex = index + 1;
    localStorage.setItem("currentInterview", JSON.stringify(updatedSession));
    setSession(updatedSession);
    setAnswer("");
    setFeedback(null);
    setError("");
  };

  return (
    <div className="page-container narrow-container">
      <div className="mock-topline">
        <button className="back-button" onClick={() => navigate("/create-interview")}>
          <ArrowLeft size={17} /> Exit practice
        </button>
        <span className="question-counter">Question {index + 1} of {total}</span>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="mock-heading">
        <p className="eyebrow">{session.role} · {session.experienceLevel}</p>
        <h1>Mock interview</h1>
        <p>Take your time and answer as if you were speaking to an interviewer.</p>
      </div>

      <section className="question-card">
        <span className="question-number">QUESTION {index + 1}</span>
        <h2>{question.question}</h2>
        {question.category && <span className="topic-chip">{question.category}</span>}

        {!feedback ? (
          <form onSubmit={submitAnswer}>
            {error && <div className="error-message">{error}</div>}

            <label htmlFor="answer">Your answer</label>
            <textarea
              id="answer"
              rows={8}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Write your answer here..."
              required
            />

            <div className="answer-footer">
              <span>{answer.trim().length} characters</span>
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Evaluating..." : <>Evaluate answer <Send size={17} /></>}
              </button>
            </div>
          </form>
        ) : (
          <div className="feedback-panel">
            <div className="feedback-score">
              <span>AI score</span>
              <strong>{feedback.score ?? "—"}<small>/10</small></strong>
            </div>

            <h3>Feedback</h3>
            <p>{feedback.feedback || "No feedback was returned."}</p>

            {feedback.strengths?.length > 0 && (
              <>
                <h3>What you did well</h3>
                <ul>{feedback.strengths.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </>
            )}

            {feedback.improvements?.length > 0 && (
              <>
                <h3>Areas to improve</h3>
                <ul>{feedback.improvements.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </>
            )}

            {feedback.suggestedAnswer && (
              <>
                <h3>Suggested answer</h3>
                <p className="suggested-answer">{feedback.suggestedAnswer}</p>
              </>
            )}

            <button className="primary-button full-width" onClick={nextQuestion}>
              {index + 1 === total ? "View results" : "Next question"}
              {index + 1 === total ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default MockInterview;