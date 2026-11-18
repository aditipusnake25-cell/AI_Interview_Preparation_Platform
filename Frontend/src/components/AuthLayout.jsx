import { ArrowUpRight, BrainCircuit, Sparkles } from "lucide-react";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";

function AuthLayout({ theme, onThemeToggle, children }) {
  return (
    <main className="auth-layout">
      <section className="auth-story">
        <div className="auth-story-top">
          <BrandLogo className="auth-brand" to="/login" />
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
        <div className="auth-story-content">
          <span className="story-badge"><Sparkles size={15} /> YOUR AI INTERVIEW COACH</span>
          <h1>Show up ready for <span>what's next.</span></h1>
          <p>Practice with purpose, get thoughtful feedback, and build the confidence to make your next move.</p>
          <div className="story-callout">
            <div className="story-orbit"><BrainCircuit size={30} /></div>
            <div>
              <strong>A little practice goes a long way.</strong>
              <span>Make every answer a step forward.</span>
            </div>
            <ArrowUpRight size={18} />
          </div>
        </div>
        <div className="auth-story-footer">A calmer way to prepare for your next big moment.</div>
      </section>
      <section className="auth-panel">
        <div className="auth-mobile-theme">
          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
        <BrandLogo className="auth-panel-brand" to="/login" />
        {children}
      </section>
    </main>
  );
}

export default AuthLayout;
