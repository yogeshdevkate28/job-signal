
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  LoaderCircle,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock3,
} from 'lucide-react'
import './Jobs.css'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const [nextPage, setNextPage] = useState(null)
  const [previousPage, setPreviousPage] = useState(null)

  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [showRecommended, setShowRecommended] = useState(false)
  const [recommendedLoading, setRecommendedLoading] = useState(false)

  const fetchJobs = async (filters = {}) => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/jobs/',
        { params: filters }
      )

      setJobs(response.data.results || [])
      setTotalJobs(response.data.count || 0)
      setNextPage(response.data.next)
      setPreviousPage(response.data.previous)
    } catch (err) {
      console.error('Job fetching error:', err)
      setError('Unable to load jobs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecommendedJobs = async () => {
    setRecommendedLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('access_token')

      if (!token) {
        setError('Please log in to view your recommended jobs.')
        return
      }

      const response = await axios.get(
        'http://127.0.0.1:8000/api/jobs/recommended/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setRecommendedJobs(response.data)
      setShowRecommended(true)
    } catch (err) {
      console.error('Recommended jobs error:', err)
      setError('Unable to load recommended jobs. Please try again.')
    } finally {
      setRecommendedLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    setCurrentPage(1)
    setShowRecommended(false)

    fetchJobs({
      search,
      location,
      employment_type: employmentType,
      page: 1,
    })
  }

  const handleAllJobs = () => {
    setShowRecommended(false)
    setError('')
    setCurrentPage(1)

    fetchJobs({
      search,
      location,
      employment_type: employmentType,
      page: 1,
    })
  }

  const changePage = (page) => {
    setCurrentPage(page)

    fetchJobs({
      search,
      location,
      employment_type: employmentType,
      page,
    })
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salary not disclosed'

    const format = (amount) =>
      `₹${(amount / 100000).toFixed(1)} LPA`

    if (min && max) return `${format(min)} – ${format(max)}`
    if (min) return `From ${format(min)}`
    return `Up to ${format(max)}`
  }

  const displayedJobs = showRecommended ? recommendedJobs : jobs

  const getDescription = (description) => {
    if (!description) return 'No job description available.'
    return description.length > 180
      ? `${description.slice(0, 180)}...`
      : description
  }

  return (
    <div className="jobs-page">
      <div className="jobs-container">

        <header className="jobs-header">
          <div>
            <span className="jobs-eyebrow">CAREER OPPORTUNITIES</span>
            <h1>Find your next opportunity.</h1>
            <p>
              Discover opportunities that match your skills,
              experience and career goals.
            </p>
          </div>

          <div className="jobs-header-icon">
            <BriefcaseBusiness size={30} />
          </div>
        </header>

        <section className="jobs-search-section">
          <form className="jobs-search-form" onSubmit={handleSearch}>
            <div className="jobs-search-field">
              <Search size={19} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, company or skill"
              />
            </div>

            <div className="jobs-search-field location-field">
              <MapPin size={19} />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
              />
            </div>

            <select
              className="jobs-type-select"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="">All employment types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>

            <button className="jobs-search-button" type="submit">
              <Search size={17} />
              Search
            </button>
          </form>
        </section>

        <div className="jobs-tabs">
          <button
            className={!showRecommended ? 'jobs-tab active' : 'jobs-tab'}
            onClick={handleAllJobs}
          >
            All Jobs
          </button>

          <button
            className={showRecommended ? 'jobs-tab active' : 'jobs-tab'}
            onClick={fetchRecommendedJobs}
            disabled={recommendedLoading}
          >
            <Sparkles size={16} />
            Recommended for You
          </button>
        </div>

        <section className="jobs-results-section">
          <div className="jobs-results-header">
            <div>
              <h2>
                {showRecommended
                  ? 'Your recommended jobs'
                  : 'Explore opportunities'}
              </h2>
              <p>
                {showRecommended
                  ? 'Ranked using your CV, skills and desired roles.'
                  : `${totalJobs} jobs available`}
              </p>
            </div>

            {showRecommended && (
              <span className="jobs-recommended-label">
                <Sparkles size={14} />
                Personalized matches
              </span>
            )}
          </div>

          {(loading || recommendedLoading) && (
            <div className="jobs-state">
              <LoaderCircle className="jobs-spinner" size={28} />
              <p>Finding opportunities...</p>
            </div>
          )}

          {error && !loading && !recommendedLoading && (
            <div className="jobs-state jobs-error">
              <AlertCircle size={25} />
              <p>{error}</p>
              <button onClick={showRecommended ? fetchRecommendedJobs : () => fetchJobs()}>
                Try again
              </button>
            </div>
          )}

          {!loading &&
            !recommendedLoading &&
            !error &&
            displayedJobs.length === 0 && (
              <div className="jobs-state jobs-empty">
                <BriefcaseBusiness size={36} />
                <h3>No jobs found</h3>
                <p>
                  {showRecommended
                    ? 'Update your profile with skills, desired roles and a CV to improve your matches.'
                    : 'Try changing your search or filters to find more opportunities.'}
                </p>
              </div>
            )}

          {!loading &&
            !recommendedLoading &&
            !error &&
            displayedJobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div className="job-card-top">
                  <div className="job-company-icon">
                    <BriefcaseBusiness size={22} />
                  </div>

                  <div className="job-main-info">
                    <h3>{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                  </div>

                  {showRecommended && (
                    <div className="job-match">
                      <Sparkles size={15} />
                      {job.match_percentage}% Match
                    </div>
                  )}
                </div>

                <div className="job-meta">
                  <span><MapPin size={15} /> {job.location || 'Location not specified'}</span>
                  <span><BriefcaseBusiness size={15} /> {job.employment_type || 'Not specified'}</span>
                  <span><Clock3 size={15} /> {job.experience || 'Experience not specified'}</span>
                </div>

                <div className="job-salary">
                  {formatSalary(job.salary_min, job.salary_max)}
                </div>

                <p className="job-description">
                  {getDescription(job.description)}
                </p>

                <div className="job-skills">
                  <strong>Skills</strong>
                  <p>{job.skills || 'Not specified'}</p>
                </div>

                {showRecommended && (
                  <div className="job-match-details">
                    <p>
                      <strong>Matched skills:</strong>{' '}
                      {job.matched_skills?.join(', ') || 'None identified'}
                    </p>
                    <p>
                      <strong>Missing skills:</strong>{' '}
                      {job.missing_skills?.join(', ') || 'None identified'}
                    </p>
                    <p>
                      <strong>Desired role match:</strong>{' '}
                      {job.role_match ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}

                <div className="job-card-actions">
                  <Link
                    className="job-details-button"
                    to={`/jobs/${job.id}`}
                  >
                    View Details
                    <ChevronRight size={17} />
                  </Link>

                  {job.application_url && (
                    <a
                      className="job-apply-button"
                      href={job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </article>
            ))}

          {!showRecommended &&
            !loading &&
            !error &&
            jobs.length > 0 && (
              <div className="jobs-pagination">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={!previousPage}
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <span>Page {currentPage}</span>

                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={!nextPage}
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
        </section>
      </div>
    </div>
  )
}

export default Jobs
