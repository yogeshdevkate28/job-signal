
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  LayoutDashboard,
  BriefcaseBusiness,
  UserRound,
  FileText,
  Settings,
  LogOut,
  Search,
  Bell,
  ArrowUpRight,
  MapPin,
  Sparkles,
  ClipboardList,
  ChevronRight,
  CircleUserRound,
} from 'lucide-react'
import './Dashboard.css'

const API = 'http://127.0.0.1:8000/api'

function Dashboard() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login')
      return
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const loadDashboard = async () => {
      setLoading(true)
      setError('')

      const results = await Promise.allSettled([
        axios.get(`${API}/profile/`, { headers }),
        axios.get(`${API}/jobs/recommended/`, { headers }),
        axios.get(`${API}/applications/`, { headers }),
      ])

      if (results[0].status === 'fulfilled') {
        setProfile(results[0].value.data)
      }

      if (results[1].status === 'fulfilled') {
        setRecommendedJobs(results[1].value.data)
      }

      if (results[2].status === 'fulfilled') {
        setApplications(results[2].value.data.results || [])
      }

      if (results.every(result => result.status === 'rejected')) {
        setError('Unable to load dashboard data. Please try logging in again.')
      }

      setLoading(false)
    }

    loadDashboard()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  const profileFields = profile
    ? [
        Boolean(profile.full_name),
        Boolean(profile.resume),
        profile.skills?.length > 0,
        profile.desired_roles?.length > 0,
      ]
    : []

  const profileCompletion = profile
    ? Math.round(
        (profileFields.filter(Boolean).length / profileFields.length) * 100
      )
    : 0

  const applicationCounts = {
    wishlisted: applications.filter(a => a.status === 'wishlisted').length,
    applied: applications.filter(a => a.status === 'applied').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
  }

  const firstName = profile?.full_name?.trim().split(' ')[0] || 'there'

  return (
    <div className="dashboard-layout">

      <aside className="dashboard-sidebar">
        <Link to="/dashboard" className="dashboard-brand">
          Job<span>Signal</span><small>.</small>
        </Link>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link active">
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          <Link to="/jobs" className="sidebar-link">
            <BriefcaseBusiness size={19} />
            Explore Jobs
          </Link>

          <Link to="/applications" className="sidebar-link">
            <ClipboardList size={19} />
            My Applications
          </Link>

          <Link to="/profile" className="sidebar-link">
            <UserRound size={19} />
            My Profile
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-label">ACCOUNT</div>

          <Link to="/profile" className="sidebar-link">
            <Settings size={19} />
            Settings
          </Link>

          <button className="sidebar-link logout-link" onClick={handleLogout}>
            <LogOut size={19} />
            Logout
          </button>

          <div className="sidebar-user">
            <div className="sidebar-avatar">
              <CircleUserRound size={22} />
            </div>
            <div className="sidebar-user-info">
              <strong>{profile?.full_name || 'Job Seeker'}</strong>
              <span>Personal account</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">

        <header className="dashboard-topbar">
          <div>
            <span className="topbar-eyebrow">YOUR CAREER WORKSPACE</span>
            <h2>Dashboard</h2>
          </div>

          <div className="topbar-actions">
            <Link to="/jobs" className="topbar-search">
              <Search size={17} />
              <span>Find opportunities</span>
            </Link>
            <div className="topbar-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {error && <div className="dashboard-error">{error}</div>}

        <section className="welcome-banner">
          <div>
            <span className="welcome-label">YOUR NEXT OPPORTUNITY STARTS HERE</span>
            <h1>Welcome back, {firstName}!</h1>
            <p>
              Discover opportunities that match your skills and move your
              career forward.
            </p>

            <Link to="/jobs" className="welcome-button">
              Explore opportunities <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="welcome-decoration">
            <div className="decoration-circle">
              <Sparkles size={42} />
            </div>
            <span>Find your next big move.</span>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-title-row">
            <div>
              <span className="section-eyebrow">YOUR PROGRESS</span>
              <h2>Career overview</h2>
            </div>
          </div>

          <div className="overview-grid">
            <div className="overview-card">
              <div className="overview-icon purple-icon">
                <Sparkles size={21} />
              </div>
              <span>Recommended jobs</span>
              <strong>{loading ? '—' : recommendedJobs.length}</strong>
              <small>Based on your profile</small>
            </div>

            <div className="overview-card">
              <div className="overview-icon orange-icon">
                <ClipboardList size={21} />
              </div>
              <span>Tracked applications</span>
              <strong>{loading ? '—' : applications.length}</strong>
              <small>Jobs you're following</small>
            </div>

            <div className="overview-card">
              <div className="overview-icon blue-icon">
                <BriefcaseBusiness size={21} />
              </div>
              <span>Interviews</span>
              <strong>{loading ? '—' : applicationCounts.interview}</strong>
              <small>Interview stage</small>
            </div>

            <div className="overview-card">
              <div className="overview-icon green-icon">
                <FileText size={21} />
              </div>
              <span>Offers</span>
              <strong>{loading ? '—' : applicationCounts.offer}</strong>
              <small>Offers received</small>
            </div>
          </div>
        </section>

        <div className="dashboard-content-grid">

          <section className="dashboard-panel recommendations-panel">
            <div className="panel-heading">
              <div>
                <span className="section-eyebrow">PERSONALIZED FOR YOU</span>
                <h2>Recommended jobs</h2>
              </div>
              <Link to="/jobs" className="view-all-link">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            {loading ? (
              <p className="empty-dashboard">Finding opportunities...</p>
            ) : recommendedJobs.length === 0 ? (
              <div className="empty-dashboard">
                <BriefcaseBusiness size={28} />
                <p>No recommendations yet.</p>
                <Link to="/profile">Complete your profile</Link>
              </div>
            ) : (
              recommendedJobs.slice(0, 3).map(job => (
                <div className="recommended-job" key={job.id}>
                  <div className="job-company-avatar">
                    {job.company?.charAt(0)?.toUpperCase() || 'C'}
                  </div>

                  <div className="recommended-job-info">
                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    <span>{job.company}</span>
                    <small>
                      <MapPin size={13} /> {job.location || 'Location not specified'}
                    </small>
                  </div>

                  <div className="job-match">
                    <strong>{job.match_percentage}%</strong>
                    <span>Match</span>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="dashboard-panel profile-panel">
            <div className="panel-heading">
              <div>
                <span className="section-eyebrow">PROFILE STRENGTH</span>
                <h2>Your profile</h2>
              </div>
              <UserRound size={20} />
            </div>

            <div className="completion-number">
              {loading ? '—' : `${profileCompletion}%`}
              <span> complete</span>
            </div>

            <div className="completion-track">
              <div
                className="completion-fill"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>

            <p className="profile-panel-text">
              A complete profile helps us find more relevant opportunities.
            </p>

            <div className="profile-checklist">
              <span className={profile?.full_name ? 'completed' : ''}>
                {profile?.full_name ? '✓' : '○'} Personal information
              </span>
              <span className={profile?.resume ? 'completed' : ''}>
                {profile?.resume ? '✓' : '○'} Resume uploaded
              </span>
              <span className={profile?.skills?.length ? 'completed' : ''}>
                {profile?.skills?.length ? '✓' : '○'} Skills added
              </span>
              <span className={profile?.desired_roles?.length ? 'completed' : ''}>
                {profile?.desired_roles?.length ? '✓' : '○'} Desired roles added
              </span>
            </div>

            <Link to="/profile" className="profile-edit-link">
              Manage profile <ArrowUpRight size={16} />
            </Link>
          </section>
        </div>

        <section className="dashboard-panel tracker-panel">
          <div className="panel-heading">
            <div>
              <span className="section-eyebrow">APPLICATION ACTIVITY</span>
              <h2>Application tracker</h2>
            </div>
            <Link to="/applications" className="view-all-link">
              Manage applications <ChevronRight size={16} />
            </Link>
          </div>

          <div className="tracker-stats">
            <div>
              <span className="status-dot wishlist-dot" />
              <strong>{applicationCounts.wishlisted}</strong>
              <span>Wishlisted</span>
            </div>
            <div>
              <span className="status-dot applied-dot" />
              <strong>{applicationCounts.applied}</strong>
              <span>Applied</span>
            </div>
            <div>
              <span className="status-dot interview-dot" />
              <strong>{applicationCounts.interview}</strong>
              <span>Interview</span>
            </div>
            <div>
              <span className="status-dot offer-dot" />
              <strong>{applicationCounts.offer}</strong>
              <span>Offers</span>
            </div>
          </div>

          {applications.length > 0 && (
            <div className="recent-applications">
              {applications.slice(0, 3).map(application => (
                <div className="recent-application" key={application.id}>
                  <div>
                    <strong>{application.job_details.title}</strong>
                    <span>{application.job_details.company}</span>
                  </div>
                  <span className={`application-status status-${application.status}`}>
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {!loading && applications.length === 0 && (
            <div className="tracker-empty">
              You haven't tracked any jobs yet.
              <Link to="/jobs">Find a job to track <ArrowUpRight size={15} /></Link>
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          <span>© 2026 Job Signal</span>
          <span>Built for your next career move.</span>
        </footer>

      </main>
    </div>
  )
}

export default Dashboard
