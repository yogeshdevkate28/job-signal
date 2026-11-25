
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
  LayoutDashboard,
  BriefcaseBusiness,
  UserRound,
  ClipboardList,
  Settings,
  LogOut,
  FileText,
  Sparkles,
  Mail,
  ChevronRight,
  Pencil,
  CheckCircle2,
  LoaderCircle,
  ExternalLink,
} from 'lucide-react'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('access_token')

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    skills: [],
    desired_roles: [],
    resume: null,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState(location.state?.message || '')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/profile/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setProfile({
          ...response.data,
          skills: response.data.skills || [],
          desired_roles: response.data.desired_roles || [],
        })
      } catch (err) {
        console.error('Profile API error:', err.response?.data || err.message)
        setError('Unable to load your profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate, token])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  const profileFields = [
    Boolean(profile.full_name?.trim()),
    Boolean(profile.resume),
    profile.skills.length > 0,
    profile.desired_roles.length > 0,
  ]

  const completion = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100
  )

  const firstName = profile.full_name?.trim().split(' ')[0] || 'there'

  const resumeUrl = profile.resume
    ? profile.resume.startsWith('http')
      ? profile.resume
      : `http://127.0.0.1:8000${profile.resume}`
    : null

  if (loading) {
    return (
      <div className="profile-loading">
        <LoaderCircle className="profile-spin" size={28} />
        <p>Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-layout-page">
      <aside className="profile-sidebar">
        <Link to="/dashboard" className="profile-brand">
          Job<span>Signal</span><small>.</small>
        </Link>

        <div className="profile-sidebar-label">WORKSPACE</div>

        <nav className="profile-sidebar-nav">
          <Link to="/dashboard" className="profile-nav-link">
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          <Link to="/jobs" className="profile-nav-link">
            <BriefcaseBusiness size={19} />
            Explore Jobs
          </Link>

          <Link to="/applications" className="profile-nav-link">
            <ClipboardList size={19} />
            My Applications
          </Link>

          <Link to="/profile" className="profile-nav-link active">
            <UserRound size={19} />
            My Profile
          </Link>
        </nav>

        <div className="profile-sidebar-bottom">
          <div className="profile-sidebar-label">ACCOUNT</div>

          <Link to="/profile/edit" className="profile-nav-link">
            <Settings size={19} />
            Edit Profile
          </Link>

          <button
            className="profile-nav-link profile-logout"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Logout
          </button>

          <div className="profile-sidebar-user">
            <div className="profile-sidebar-avatar">
              <UserRound size={21} />
            </div>
            <div>
              <strong>{profile.full_name || 'Job Seeker'}</strong>
              <span>Personal account</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="profile-main">
        <header className="profile-topbar">
          <div>
            <span className="profile-topbar-eyebrow">YOUR CAREER WORKSPACE</span>
            <h2>My Profile</h2>
          </div>

          <div className="profile-topbar-user">
            <span>{firstName}</span>
            <div>{firstName.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div className="profile-content">
          <div className="profile-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <ChevronRight size={14} />
            <strong>My Profile</strong>
          </div>

          <section className="profile-welcome">
            <div>
              <span className="profile-eyebrow">
                <Sparkles size={14} />
                YOUR PROFESSIONAL IDENTITY
              </span>

              <h1>Your professional profile<span>.</span></h1>

              <p>
                View your professional information, skills and career
                preferences in one place.
              </p>
            </div>

            <button
              className="profile-edit-button"
              onClick={() => navigate('/profile/edit')}
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </section>

          {error && (
            <div className="profile-alert profile-alert-error">
              {error}
            </div>
          )}

          {message && (
            <div className="profile-alert profile-alert-success">
              <CheckCircle2 size={17} />
              {message}
            </div>
          )}

          <section className="profile-overview">
            <div>
              <span className="profile-overview-label">PROFILE COMPLETION</span>

              <div className="profile-completion-number">
                {completion}% <span>complete</span>
              </div>

              <div className="profile-progress-track">
                <div
                  className="profile-progress-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <p>Complete all four sections to strengthen your profile.</p>
            </div>

            <div className="profile-completion-checklist">
              {profileFields.map((complete, index) => (
                <div key={index} className={complete ? 'complete' : ''}>
                  <CheckCircle2 size={16} />
                  {[
                    'Personal information',
                    'Resume uploaded',
                    'Skills added',
                    'Desired roles',
                  ][index]}
                </div>
              ))}
            </div>
          </section>

          <div className="profile-view-grid">
            <div className="profile-view-main">
              <section className="profile-card">
                <div className="profile-section-heading">
                  <div className="profile-section-icon personal-icon">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <h2>Personal information</h2>
                    <p>Your account details</p>
                  </div>
                </div>

                <div className="profile-detail-list">
                  <div className="profile-detail-item">
                    <span>Full name</span>
                    <strong>{profile.full_name || 'Not added yet'}</strong>
                  </div>

                  <div className="profile-detail-item">
                    <span>Email address</span>
                    <strong className="profile-detail-email">
                      <Mail size={16} />
                      {profile.email || 'Not available'}
                    </strong>
                  </div>
                </div>
              </section>

              <section className="profile-card">
                <div className="profile-section-heading">
                  <div className="profile-section-icon resume-icon">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2>Your resume</h2>
                    <p>Your uploaded professional CV</p>
                  </div>
                </div>

                {resumeUrl ? (
                  <div className="profile-resume-file">
                    <div className="profile-resume-icon">
                      <FileText size={24} />
                    </div>

                    <div className="profile-resume-info">
                      <strong>{profile.resume.split('/').pop()}</strong>
                      <span>Resume uploaded</span>
                    </div>

                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profile-resume-view"
                    >
                      View <ExternalLink size={15} />
                    </a>
                  </div>
                ) : (
                  <div className="profile-view-empty">
                    <FileText size={22} />
                    <span>No resume uploaded yet.</span>
                    <button onClick={() => navigate('/profile/edit')}>
                      Upload resume
                    </button>
                  </div>
                )}
              </section>

              <section className="profile-card">
                <div className="profile-section-heading">
                  <div className="profile-section-icon skills-icon">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <h2>Your skills</h2>
                    <p>Your professional skills and technologies</p>
                  </div>
                </div>

                <div className="profile-chip-list">
                  {profile.skills.length > 0 ? (
                    profile.skills.map(skill => (
                      <span className="profile-chip" key={skill}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="profile-empty-text">
                      No skills added yet.
                    </span>
                  )}
                </div>
              </section>

              <section className="profile-card">
                <div className="profile-section-heading">
                  <div className="profile-section-icon roles-icon">
                    <BriefcaseBusiness size={20} />
                  </div>

                  <div>
                    <h2>Desired roles</h2>
                    <p>The positions you're interested in</p>
                  </div>
                </div>

                <div className="profile-chip-list">
                  {profile.desired_roles.length > 0 ? (
                    profile.desired_roles.map(role => (
                      <span className="profile-chip role-chip" key={role}>
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="profile-empty-text">
                      No desired roles added yet.
                    </span>
                  )}
                </div>
              </section>
            </div>

            <aside className="profile-view-side">
              <div className="profile-tip-card">
                <div className="profile-tip-icon">
                  <Sparkles size={20} />
                </div>

                <span>YOUR PROFILE</span>
                <h3>Make every detail count.</h3>

                <p>
                  Job Signal uses your resume, skills and desired roles
                  to help find relevant job opportunities.
                </p>

                <div className="profile-tip-divider" />

                <div>
                  <CheckCircle2 size={16} />
                  Keep your resume updated
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  Add relevant skills
                </div>

                <div>
                  <CheckCircle2 size={16} />
                  Specify desired roles
                </div>

                <button
                  className="profile-tip-edit"
                  onClick={() => navigate('/profile/edit')}
                >
                  Update profile <Pencil size={15} />
                </button>
              </div>
            </aside>
          </div>

          <footer className="profile-footer">
            <span>© 2026 Job Signal</span>
            <span>Built for your next career move.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default Profile
