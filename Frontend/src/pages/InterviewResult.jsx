import { Link, Navigate } from "react-router-dom";
import { Award, ArrowLeft, CheckCircle2, RotateCcw, Target } from "lucide-react";

function InterviewResult() {
  let session = null;

  try {
    session = JSON.parse(localStorage.getItem("lastInterviewResult") || "null");
  } catch {
    session = null;
  }

  if (!session) {
    return <Navigate to="/dashboard" replace />;
  }

  const answers = session.answers || [];
  const evaluations = answers.map((item) => item.evaluation).filter(Boolean);
  const scores = evaluations
    .map((item) => Number(item.score))
    .filter((score) => Number.isFinite(score));

  const average = scores.length
    ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
    : "—";

  const percentage = scores.length ? Math.round((Number(average) / 10) * 100) : 0;

  return (
    <div className="page-container narrow-container">
      <section className="result-hero">
        <div className="result-award"><Award size={36} /></div>
        <p className="eyebrow">PRACTICE SESSION COMPLETE</p>
        <h1>Great work!</h1>
        <p>You finished your mock interview for <strong>{session.role}</strong>.</p>

        <div className="result-score">
          <strong>{average}</strong>
          <span>/ 10 average score</span>
        </div>

        <div className="result-progress">
          <div style={{ width: `${percentage}%` }} />
        </div>

        <p className="result-summary">
          You answered {answers.length} question{answers.length === 1 ? "" : "s"}.
          {scores.length < answers.length ? " Some answers did not receive a score." : " Review the feedback to keep improving."}
        </p>
      </section>

      <section className="section-heading">
        <div>
          <h2>Answer review</h2>
          <p>Revisit your responses and AI feedback.</p>
        </div>
      </section>

      <div className="result-list">
        {answers.map((item, index) => (
          <article className="result-answer-card" key={`${item.question}-${index}`}>
            <div className="result-answer-top">
              <span className="question-number">QUESTION {index + 1}</span>
              <span className="result-answer-score">{item.evaluation?.score ?? "—"}/10</span>
            </div>

            <h3>{item.question}</h3>

            <p className="result-label">Your answer</p>
            <p>{item.answer || "No answer recorded."}</p>

            {item.evaluation?.feedback && (
              <>
                <p className="result-label">AI feedback</p>
                <p>{item.evaluation.feedback}</p>
              </>
            )}

            {item.evaluation?.suggestedAnswer && (
              <details>
                <summary>View suggested answer</summary>
                <p>{item.evaluation.suggestedAnswer}</p>
              </details>
            )}
          </article>
        ))}
      </div>

      <div className="result-actions">
        <Link to="/create-interview" className="primary-button"><RotateCcw size={17} /> Practice again</Link>
        <Link to="/history" className="secondary-button"><Target size={17} /> Interview history</Link>
        <Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> Dashboard</Link>
      </div>

      <div className="tip-card">
        <CheckCircle2 size={22} />
        <div>
          <h3>Keep learning from every answer</h3>
          <p>Practice explaining your reasoning clearly, and use feedback to improve your next response.</p>
        </div>
      </div>
    </div>
  );
}

export default InterviewResult;