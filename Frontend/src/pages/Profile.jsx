import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, ShieldCheck, UserRound } from "lucide-react";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getProfile();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="page-container profile-page">
      <div className="page-intro">
        <span className="eyebrow"><UserRound size={14} /> ACCOUNT</span>
        <h1>Your profile</h1>
        <p>Your account details and practice space.</p>
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading your profile…</div>
      ) : user ? (
        <div className="profile-layout">
          <section className="profile-card">
            <div className="profile-cover" />
            <div className="profile-identity">
              <span className="profile-avatar">{(user.name || "M").trim().charAt(0).toUpperCase()}</span>
              <div>
                <h2>{user.name}</h2>
                <p>MockMind member</p>
              </div>
            </div>
            <div className="profile-details">
              <div className="profile-detail">
                <span className="detail-icon"><UserRound size={17} /></span>
                <div><small>Full name</small><strong>{user.name}</strong></div>
              </div>
              <div className="profile-detail">
                <span className="detail-icon"><Mail size={17} /></span>
                <div><small>Email address</small><strong>{user.email}</strong></div>
              </div>
              <div className="profile-detail">
                <span className="detail-icon"><ShieldCheck size={17} /></span>
                <div><small>Account status</small><strong>Authenticated</strong></div>
              </div>
            </div>
          </section>

          <aside className="profile-aside">
            <div className="profile-next-step">
              <span className="preview-icon"><ArrowRight size={20} /></span>
              <h2>Keep your momentum.</h2>
              <p>Start a new interview practice session and keep building confidence.</p>
              <Link to="/create-interview" className="primary-button">Start practicing <ArrowRight size={17} /></Link>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

export default Profile;
