import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, CalendarDays, Plus, Trash2 } from "lucide-react";
import api from "../services/api";

function History() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInterviews = async () => {
    try {
      const data = await api.getInterviews();
      setInterviews(Array.isArray(data) ? data : data.interviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const deleteInterview = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this interview?");
    if (!confirmed) return;

    try {
      await api.deleteInterview(id);
      setInterviews((previous) => previous.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="section-heading history-heading">
        <div>
          <p className="eyebrow">YOUR PROGRESS</p>
          <h1>Interview history</h1>
          <p>See the practice sessions you've created.</p>
        </div>
        <Link to="/create-interview" className="primary-button"><Plus size={18} /> New interview</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading interview history...</div>
      ) : interviews.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><CalendarDays size={32} /></span>
          <h3>No interviews yet</h3>
          <p>Create your first interview to start building your practice history.</p>
          <Link to="/create-interview" className="primary-button"><Plus size={18} /> Create interview</Link>
        </div>
      ) : (
        <div className="history-list">
          {interviews.map((interview) => (
            <article className="history-card" key={interview._id}>
              <span className="interview-card-icon"><BrainCircuit size={23} /></span>

              <div className="history-card-main">
                <h3>{interview.role}</h3>
                <p>{interview.experienceLevel}</p>
                {interview.topics?.length > 0 && (
                  <div className="chip-list">
                    {interview.topics.map((topic) => <span className="topic-chip" key={topic}>{topic}</span>)}
                  </div>
                )}
                <span className="history-date">
                  <CalendarDays size={14} /> {new Date(interview.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="history-card-side">
                <span className={`status-badge ${interview.status}`}>{interview.status}</span>
                <span className="score-label">
                  {interview.status === "completed" ? `${interview.averageScore}/10` : "—"}
                </span>
                <button
                  className="icon-button danger"
                  title="Delete interview"
                  aria-label={`Delete ${interview.role} interview`}
                  onClick={() => deleteInterview(interview._id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="history-footnote">
        <ArrowRight size={15} /> Sessions are associated with your logged-in account.
      </p>
    </div>
  );
}

export default History;