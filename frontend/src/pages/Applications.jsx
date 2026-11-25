
import { useEffect, useState } from 'react'
import axios from 'axios'

function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingNotes, setSavingNotes] = useState(null)

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('access_token')

      const response = await axios.get(
        'http://127.0.0.1:8000/api/applications/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setApplications(response.data.results)
    } catch (err) {
      console.error(err)
      setError('Unable to load your applications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token')

      await axios.patch(
        `http://127.0.0.1:8000/api/applications/${applicationId}/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setApplications(previous =>
        previous.map(application =>
          application.id === applicationId
            ? { ...application, status: newStatus }
            : application
        )
      )
    } catch (err) {
      console.error(err)
      setError('Unable to update application status.')
    }
  }

  const updateNotes = (applicationId, newNotes) => {
    setApplications(previous =>
      previous.map(application =>
        application.id === applicationId
          ? { ...application, notes: newNotes }
          : application
      )
    )
  }

  const saveNotes = async (applicationId, notes) => {
    setSavingNotes(applicationId)
    setError('')

    try {
      const token = localStorage.getItem('access_token')

      await axios.patch(
        `http://127.0.0.1:8000/api/applications/${applicationId}/`,
        { notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      alert('Notes saved successfully!')
    } catch (err) {
      console.error(err)
      setError('Unable to save notes.')
    } finally {
      setSavingNotes(null)
    }
  }

  const removeApplication = async (applicationId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this application?'
    )

    if (!confirmDelete) return

    try {
      const token = localStorage.getItem('access_token')

      await axios.delete(
        `http://127.0.0.1:8000/api/applications/${applicationId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setApplications(previous =>
        previous.filter(application => application.id !== applicationId)
      )
    } catch (err) {
      console.error(err)
      setError('Unable to remove this application.')
    }
  }

  if (loading) return <p>Loading applications...</p>

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '40px auto',
      padding: '20px',
    }}>
      <h1>My Applications</h1>
      <p>Track and manage your job applications.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {applications.length === 0 ? (
        <p>You haven't tracked any jobs yet.</p>
      ) : (
        applications.map(application => (
          <div
            key={application.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '15px',
            }}
          >
            <h2>{application.job_details.title}</h2>

            <p>{application.job_details.company}</p>

            <p>Location: {application.job_details.location}</p>

            <label>
              Application Status:{' '}
              <select
                value={application.status}
                onChange={event =>
                  updateStatus(application.id, event.target.value)
                }
              >
                <option value="wishlisted">Wishlisted</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </label>

            <div style={{ marginTop: '20px' }}>
              <h3>Application Notes</h3>

              <textarea
                value={application.notes || ''}
                onChange={event =>
                  updateNotes(application.id, event.target.value)
                }
                placeholder="Add interview details, recruiter contacts, follow-ups..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  boxSizing: 'border-box',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />

              <button
                onClick={() =>
                  saveNotes(application.id, application.notes || '')
                }
                disabled={savingNotes === application.id}
                style={{
                  marginTop: '10px',
                  padding: '10px 18px',
                }}
              >
                {savingNotes === application.id
                  ? 'Saving...'
                  : 'Save Notes'}
              </button>

              <button
                onClick={() => removeApplication(application.id)}
                style={{
                  marginTop: '10px',
                  marginLeft: '10px',
                  padding: '10px 18px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Remove Application
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Applications
