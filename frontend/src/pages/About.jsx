import { ArrowLeft, Target, Rocket, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../App.css'

function About() {
  return (
    <div className="about-page">
      <nav className="navbar">
        <Link to="/" className="logo">job.signal.</Link>
        <Link to="/" className="nav-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      <section className="about-hero">
        <span className="eyebrow">ABOUT JOB SIGNAL</span>
        <h1>Good opportunities shouldn't be hard to find.</h1>
        <p>
          Job Signal helps job seekers discover opportunities at growing
          startups that match their skills, experience, and ambitions.
        </p>
      </section>

      <section className="about-values">
        <div>
          <Target size={28} />
          <h3>Our Mission</h3>
          <p>Make startup job discovery more relevant and accessible.</p>
        </div>
        <div>
          <Rocket size={28} />
          <h3>Our Approach</h3>
          <p>Use intelligent matching to connect people with the right roles.</p>
        </div>
        <div>
          <Users size={28} />
          <h3>Who It's For</h3>
          <p>People who want to grow with ambitious startups.</p>
        </div>
      </section>
    </div>
  )
}

export default About