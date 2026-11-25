
import './App.css'

function App() {
  return (
    <>
      <nav className="navbar">
       <a className="logo" href="/">job<span>signal.</span></a>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="/about">About</a>
          <a href="#features">Features</a>
        </div>
        <div className="nav-actions">
          <a href="/login" className="login-btn">Log in</a>
          <button className="start-btn">Get started ↗</button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">✳ YOUR NEXT CAREER MOVE STARTS HERE</span>
            <h1>Find the right job.<br />
              <span>Not just another job.</span>
            </h1>
            <p>
              Discover exciting startup opportunities, understand
              your job fit with AI, and find companies worth growing with.
            </p>
            <div className="hero-buttons">
              <button className="start-btn large">Explore opportunities ↗</button>
              <a className="learn-link" href="#about">Discover Job Signal ↓</a>
            </div>
            <div className="trust-line">
              <span>✦</span> Smarter discovery. Better opportunities.
            </div>
          </div>

          <div className="visual">
            <div className="floating-label label-top">✦ AI-powered matching</div>
            <div className="preview-card">
              <div className="preview-header">
                <div>
                  <small>YOUR JOB DISCOVERY</small>
                  <h3>Opportunities for you</h3>
                </div>
                <span className="live-dot">● Live preview</span>
              </div>
              <div className="profile-match">
                <div className="avatar">JD</div>
                <div>
                  <strong>Your profile</strong>
                  <small>Backend Developer · Python</small>
                </div>
                <span className="match-tag">Profile ready</span>
              </div>
              <div className="job-preview">
                <div className="company-icon orange">S</div>
                <div className="job-info">
                  <strong>Backend Engineer</strong>
                  <small>Startup company · Remote</small>
                </div>
                <div className="score">
                  <strong>94%</strong>
                  <small>Match</small>
                </div>
              </div>
              <div className="job-preview">
                <div className="company-icon yellow">A</div>
                <div className="job-info">
                  <strong>Python Developer</strong>
                  <small>Technology · Hybrid</small>
                </div>
                <div className="score">
                  <strong>87%</strong>
                  <small>Match</small>
                </div>
              </div>
              <div className="job-preview">
                <div className="company-icon green">N</div>
                <div className="job-info">
                  <strong>Junior Software Engineer</strong>
                  <small>AI startup · Remote</small>
                </div>
                <div className="score">
                  <strong>82%</strong>
                  <small>Match</small>
                </div>
              </div>
              <div className="preview-footer">Your next opportunity is out there. ✨</div>
            </div>
            <div className="floating-label label-bottom">↗ Discover growing startups</div>
          </div>
        </section>

        <section className="intro" id="about">
          <span className="eyebrow">A BETTER WAY TO JOB HUNT</span>
          <h2>Stop searching everywhere.<br />
            <span>Start discovering intelligently.</span>
          </h2>
          <p>
            Job Signal brings startup jobs, AI-powered resume matching
            and funding insights together in one place, helping you
            focus on opportunities that actually fit.
          </p>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT YOU GET</span>
              <h2>Your job search,<br />made smarter.</h2>
            </div>
            <p>Everything you need to discover opportunities and make your next career move.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card feature-highlight">
              <div className="feature-icon">✳</div>
              <h3>AI Resume Matching</h3>
              <p>Understand how your skills and experience align with each opportunity.</p>
              <span className="card-link">Find your fit ↗</span>
            </article>
            <article className="feature-card">
              <div className="feature-icon">⌕</div>
              <h3>Startup Job Discovery</h3>
              <p>Explore relevant opportunities from growing companies in one place.</p>
              <span className="card-link">Explore jobs ↗</span>
            </article>
            <article className="feature-card">
              <div className="feature-icon">↗</div>
              <h3>Funding Intelligence</h3>
              <p>Discover recently funded startups and keep an eye on emerging teams.</p>
              <span className="card-link">Discover startups ↗</span>
            </article>
            <article className="feature-card">
              <div className="feature-icon">♡</div>
              <h3>Personalized Alerts</h3>
              <p>Save interesting roles and receive updates about relevant opportunities.</p>
              <span className="card-link">Stay updated ↗</span>
            </article>
          </div>
        </section>

        <section className="cta">
          <span className="eyebrow">YOUR NEXT CHAPTER</span>
          <h2>Make your next move<br />a meaningful one.</h2>
          <p>Find opportunities that match your ambition.</p>
          <button className="start-btn large">Get started ↗</button>
        </section>
      </main>

      <footer>
        <a className="logo" href="/">job<span>signal.</span></a>
        <p>Discover smarter. Grow further.</p>
        <small>© 2026 Job Signal. All rights reserved.</small>
      </footer>
    </>
  )
}

export default App
