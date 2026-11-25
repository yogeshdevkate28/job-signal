
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  Building2,
  IndianRupee,
  ClipboardList,
  Clock3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import './JobDetails.css'

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tracking, setTracking] = useState(false)
  const [tracked, setTracked] = useState(false)
  const [trackerMessage, setTrackerMessage] = useState('')

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/jobs/${id}/`
        )
        setJob(response.data)
      } catch (err) {
        console.error('Job details error:', err)
        setError('Unable to load job details.')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleAddToTracker = async () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      setTrackerMessage('Please log in to track this job.')
      return
    }

    setTracking(true)
    setTrackerMessage('')

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/applications/',
        { job_id: Number(id) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setTracked(true)
      setTrackerMessage('Job added to your application tracker!')
    } catch (err) {
      console.error('Add to tracker error:', err)

      if (err.response?.status === 400) {
        setTracked(true)
        setTrackerMessage('This job is already in your tracker.')
      } else if (err.response?.status === 401) {
        setTrackerMessage('Your session expired. Please log in again.')
      } else {
        setTrackerMessage('Unable to add this job. Please try again.')
      }
    } finally {
      setTracking(false)
    }
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed'

    const format = (amount) =>
      `₹${(amount / 100000).toFixed(1)} LPA`

    if (min && max) return `${format(min)} – ${format(max)}`
    if (min) return `From ${format(min)}`
    return `Up to ${format(max)}`
  }

  if (loading) {
    return (
      <div className="job-details-state">
        <div className="job-details-spinner" />
        <p>Loading job details...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="job-details-state">
        <AlertCircle size={32} />
        <h2>Unable to load this job</h2>
        <p>{error || 'Job not found.'}</p>
        <Link to="/jobs" className="job-back-button">
          <ArrowLeft size={16} />
          Back to jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="job-details-page">
      <div className="job-details-container">

        <button
          className="job-back-link"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back to jobs
        </button>

        <div className="job-details-layout">

          <main className="job-details-main">

            <section className="job-overview-card">
              <div className="job-overview-heading">
                <div className="job-details-company-icon">
                  <Building2 size={27} />
                </div>

                <div>
                  <span className="job-details-eyebrow">
                    JOB OPPORTUNITY
                  </span>
                  <h1>{job.title}</h1>
                  <p className="job-details-company">
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="job-overview-meta">
                <span>
                  <MapPin size={16} />
                  {job.location || 'Location not specified'}
                </span>

                <span>
                  <BriefcaseBusiness size={16} />
                  {job.employment_type || 'Not specified'}
                </span>

                <span>
                  <Clock3 size={16} />
                  {job.experience || 'Experience not specified'}
                </span>
              </div>

              <div className="job-overview-salary">
                <IndianRupee size={21} />
                <span>
                  {formatSalary(job.salary_min, job.salary_max)}
                </span>
              </div>
            </section>

            <section className="job-information-card">
              <h2>About this role</h2>
              <p className="job-full-description">
                {job.description || 'No job description available.'}
              </p>
            </section>

            <section className="job-information-card">
              <h2>Required skills</h2>

              <div className="job-required-skills">
                {job.skills ? (
                  job.skills.split(',').map((skill, index) => (
                    <span key={index}>
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <p>Skills not specified.</p>
                )}
              </div>
            </section>

          </main>

          <aside className="job-details-sidebar">

            <section className="job-action-card">
              <h2>Interested in this role?</h2>
              <p>
                Add this opportunity to your tracker or continue
                to the company's application page.
              </p>

              <button
                className={`job-track-button ${tracked ? 'tracked' : ''}`}
                onClick={handleAddToTracker}
                disabled={tracking || tracked}
              >
                {tracked ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <ClipboardList size={18} />
                )}

                {tracking
                  ? 'Adding...'
                  : tracked
                    ? 'Added to Tracker'
                    : 'Add to Tracker'}
              </button>

              {trackerMessage && (
                <div className="job-tracker-message">
                  {tracked ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span>{trackerMessage}</span>
                </div>
              )}

              {job.application_url && (
                <a
                  className="job-apply-button"
                  href={job.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                  <ExternalLink size={16} />
                </a>
              )}
            </section>

            <section className="job-details-tip">
              <h3>Job Signal tip</h3>
              <p>
                Track the opportunities you're interested in so
                you can manage your applications and follow their
                progress in one place.
              </p>
            </section>

          </aside>

        </div>
      </div>
    </div>
  )
}

export default JobDetails
