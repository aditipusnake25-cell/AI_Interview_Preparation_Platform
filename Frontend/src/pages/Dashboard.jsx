import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, Clock3, Plus, Target, Trophy } from "lucide-react";
import api from "../services/api";

function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
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

    loadInterviews();
  }, []);

  const completed = interviews.filter((item) => item.status === "completed").length;
  const scores = interviews
    .filter((item) => item.status === "completed")
    .map((item) => Number(item.averageScore) || 0);

  const averageScore = scores.length
    ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
    : "—";

  return (
    <div className="page-container">
      <section className="welcome-banner">
        <div>
          <p className="eyebrow light-eyebrow">YOUR PERSONAL INTERVIEW COACH</p>
          <h1>Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}!</h1>
          <p>Build confidence, practice your skills, and get ready for your next opportunity.</p>
          <Link to="/create-interview" className="banner-button">
            Start practicing <ArrowRight size={18} />
          </Link>
        </div>
        <div className="banner-art"><BrainCircuit size={105} strokeWidth={1.2} /></div>
      </section>

      {error && <div className="error-message">{error}</div>}

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon purple"><Target size={22} /></span>
          <p>Total interviews</p>
          <h2>{loading ? "..." : interviews.length}</h2>
          <span className="stat-caption">Practice sessions created</span>
        </article>

        <article className="stat-card">
          <span className="stat-icon green"><Trophy size={22} /></span>
          <p>Completed</p>
          <h2>{loading ? "..." : completed}</h2>
          <span className="stat-caption">Finished sessions</span>
        </article>

        <article className="stat-card">
          <span className="stat-icon orange"><Target size={22} /></span>
          <p>Average score</p>
          <h2>{loading ? "..." : averageScore}{averageScore !== "—" ? "/10" : ""}</h2>
          <span className="stat-caption">Across completed sessions</span>
        </article>
      </section>

      <section className="section-heading">
        <div>
          <h2>Your recent interviews</h2>
          <p>Review your practice sessions and keep improving.</p>
        </div>
        <Link to="/history" className="text-link">View history <ArrowRight size={16} /></Link>
      </section>

      {loading ? (
        <div className="empty-state">Loading your interviews...</div>
      ) : interviews.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><BrainCircuit size={32} /></span>
          <h3>Your journey starts here</h3>
          <p>You haven't created an interview yet. Start your first AI-powered practice session.</p>
          <Link to="/create-interview" className="primary-button">
            <Plus size={18} /> Create an interview
          </Link>
        </div>
      ) : (
        <div className="interview-list">
          {interviews.slice(0, 4).map((interview) => (
            <article className="interview-card" key={interview._id}>
              <span className="interview-card-icon"><BrainCircuit size={23} /></span>
              <div className="interview-card-content">
                <h3>{interview.role}</h3>
                <p>{interview.experienceLevel} · {new Date(interview.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`status-badge ${interview.status}`}>{interview.status}</span>
              <span className="score-label">
                {interview.status === "completed" ? `${interview.averageScore}/10` : "Not scored"}
              </span>
            </article>
          ))}
        </div>
      )}

      <section className="tip-card">
        <Clock3 size={22} />
        <div>
          <h3>Small practice sessions make a difference</h3>
          <p>Try answering each question aloud before reviewing the AI feedback.</p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;