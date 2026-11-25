
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
  LayoutDashboard,
  BriefcaseBusiness,
  UserRound,
  ClipboardList,
  Settings,
  LogOut,
  FileText,
  Plus,
  X,
  UploadCloud,
  Trash2,
  LoaderCircle,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'
import './Profile.css'

function EditProfile() {
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    skills: [],
    desired_roles: [],
    resume: null,
  })

  const [newSkill, setNewSkill] = useState('')
  const [newRole, setNewRole] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [removeResume, setRemoveResume] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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

  const addSkill = () => {
    const value = newSkill.trim()
    if (!value) return

    if (!profile.skills.some(
      skill => skill.toLowerCase() === value.toLowerCase()
    )) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, value],
      }))
    }

    setNewSkill('')
  }

  const removeSkill = skillToRemove => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }))
  }

  const addRole = () => {
    const value = newRole.trim()
    if (!value) return

    if (!profile.desired_roles.some(
      role => role.toLowerCase() === value.toLowerCase()
    )) {
      setProfile(prev => ({
        ...prev,
        desired_roles: [...prev.desired_roles, value],
      }))
    }

    setNewRole('')
  }

  const removeRole = roleToRemove => {
    setProfile(prev => ({
      ...prev,
      desired_roles: prev.desired_roles.filter(role => role !== roleToRemove),
    }))
  }

  const handleResumeChange = event => {
    const file = event.target.files[0]
    if (!file) return

    const validType = /\.(pdf|docx)$/i.test(file.name)

    if (!validType) {
      setError('Please upload a PDF or DOCX file.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Resume size must not exceed 5 MB.')
      event.target.value = ''
      return
    }

    setError('')
    setResumeFile(file)
    setRemoveResume(false)
  }

  const handleSave = async event => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const formData = new FormData()
    formData.append('full_name', profile.full_name)
    formData.append('skills', JSON.stringify(profile.skills))
    formData.append('desired_roles', JSON.stringify(profile.desired_roles))

    if (resumeFile) {
      formData.append('resume', resumeFile)
    }

    if (removeResume) {
      formData.append('remove_resume', 'true')
    }

    try {
      await axios.patch(
        'http://127.0.0.1:8000/api/profile/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      navigate('/profile', {
        state: {
          message: 'Your profile has been updated successfully.',
        },
      })
    } catch (err) {
      console.error('Profile save error:', err.response?.data || err.message)

      setError(
        err.response?.data?.resume?.[0] ||
        err.response?.data?.detail ||
        'Unable to save your profile. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

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

          <Link to="/profile" className="profile-nav-link">
            <Settings size={19} />
            Settings
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
            <span className="profile-topbar-eyebrow">ACCOUNT SETTINGS</span>
            <h2>Edit Profile</h2>
          </div>

          <div className="profile-topbar-user">
            <span>{profile.full_name?.trim().split(' ')[0] || 'there'}</span>
            <div>
              {(profile.full_name?.trim().charAt(0) || 'U').toUpperCase()}
            </div>
          </div>
        </header>

        <div className="profile-content">
          <div className="profile-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link to="/profile">My Profile</Link>
            <span>/</span>
            <strong>Edit Profile</strong>
          </div>

          <section className="profile-welcome">
            <div>
              <span className="profile-eyebrow">
                <UserRound size={14} />
                PERSONAL INFORMATION
              </span>

              <h1>Make your profile stand out<span>.</span></h1>

              <p>
                Keep your professional information updated so we can
                find opportunities that match your goals.
              </p>
            </div>
          </section>

          {error && (
            <div className="profile-alert profile-alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="profile-form-grid">
              <div className="profile-form-main">
                <section className="profile-card">
                  <div className="profile-section-heading">
                    <div className="profile-section-icon personal-icon">
                      <UserRound size={20} />
                    </div>
                    <div>
                      <h2>Personal information</h2>
                      <p>Update your basic details</p>
                    </div>
                    <span>01</span>
                  </div>

                  <div className="profile-fields">
                    <label>
                      Full name
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={profile.full_name || ''}
                        onChange={e => setProfile(prev => ({
                          ...prev,
                          full_name: e.target.value,
                        }))}
                      />
                    </label>

                    <label>
                      Email address
                      <div className="profile-email-wrap">
                        <Mail size={17} />
                        <input
                          type="email"
                          value={profile.email || ''}
                          placeholder="Your registered email"
                          disabled
                        />
                        <span>Verified</span>
                      </div>
                      <small>Your registered email cannot be changed here.</small>
                    </label>
                  </div>
                </section>

                <section className="profile-card">
                  <div className="profile-section-heading">
                    <div className="profile-section-icon resume-icon">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2>Your resume</h2>
                      <p>Upload your latest CV for better job matches</p>
                    </div>
                    <span>02</span>
                  </div>

                  {(resumeFile || (profile.resume && !removeResume)) ? (
                    <div className="profile-resume-file">
                      <div className="profile-resume-icon">
                        <FileText size={24} />
                      </div>

                      <div className="profile-resume-info">
                        {!resumeFile && profile.resume ? (
                          <a
                            href={profile.resume.startsWith('http')
                              ? profile.resume
                              : `http://127.0.0.1:8000${profile.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {profile.resume.split('/').pop()}
                          </a>
                        ) : (
                          <strong>{resumeFile?.name}</strong>
                        )}

                        <span>
                          {resumeFile ? 'Ready to upload' : 'Currently uploaded'}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="profile-remove-resume"
                        onClick={() => {
                          setResumeFile(null)
                          setRemoveResume(true)
                        }}
                        aria-label="Remove resume"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ) : (
                    <label className="profile-upload-area">
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleResumeChange}
                      />
                      <UploadCloud size={30} />
                      <strong>Click to upload your resume</strong>
                      <span>PDF or DOCX · Maximum file size 5 MB</span>
                    </label>
                  )}

                  {removeResume && (
                    <p className="profile-resume-note">
                      Your current resume will be removed when you save.
                    </p>
                  )}

                  {resumeFile && (
                    <label className="profile-replace-resume">
                      Choose another file
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleResumeChange}
                      />
                    </label>
                  )}
                </section>

                <section className="profile-card">
                  <div className="profile-section-heading">
                    <div className="profile-section-icon skills-icon">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h2>Your skills</h2>
                      <p>Technologies and skills you work with</p>
                    </div>
                    <span>03</span>
                  </div>

                  <div className="profile-chip-list">
                    {profile.skills.map(skill => (
                      <span className="profile-chip" key={skill}>
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}

                    {profile.skills.length === 0 && (
                      <span className="profile-empty-text">
                        No skills added yet.
                      </span>
                    )}
                  </div>

                  <div className="profile-add-row">
                    <input
                      type="text"
                      placeholder="e.g. Python, Django, PostgreSQL"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkill()
                        }
                      }}
                    />
                    <button type="button" onClick={addSkill}>
                      <Plus size={17} /> Add skill
                    </button>
                  </div>
                </section>

                <section className="profile-card">
                  <div className="profile-section-heading">
                    <div className="profile-section-icon roles-icon">
                      <BriefcaseBusiness size={20} />
                    </div>
                    <div>
                      <h2>Desired roles</h2>
                      <p>What kind of opportunities are you looking for?</p>
                    </div>
                    <span>04</span>
                  </div>

                  <div className="profile-chip-list">
                    {profile.desired_roles.map(role => (
                      <span className="profile-chip role-chip" key={role}>
                        {role}
                        <button
                          type="button"
                          onClick={() => removeRole(role)}
                          aria-label={`Remove ${role}`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}

                    {profile.desired_roles.length === 0 && (
                      <span className="profile-empty-text">
                        No desired roles added yet.
                      </span>
                    )}
                  </div>

                  <div className="profile-add-row">
                    <input
                      type="text"
                      placeholder="e.g. Backend Developer, Python Developer"
                      value={newRole}
                      onChange={e => setNewRole(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addRole()
                        }
                      }}
                    />
                    <button type="button" onClick={addRole}>
                      <Plus size={17} /> Add role
                    </button>
                  </div>
                </section>
              </div>

              <aside className="profile-form-side">
                <div className="profile-tip-card">
                  <div className="profile-tip-icon">
                    <CheckCircle2 size={20} />
                  </div>
                  <span>KEEP IT UPDATED</span>
                  <h3>Your profile represents you.</h3>
                  <p>
                    Accurate skills, career preferences and an updated
                    resume help us identify relevant opportunities.
                  </p>
                </div>

                <div className="profile-save-card">
                  <div className="profile-save-icon">
                    <CheckCircle2 size={20} />
                  </div>
                  <h3>Save your changes</h3>
                  <p>
                    Your updated information will be saved to your
                    Job Signal profile.
                  </p>

                  <button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <LoaderCircle size={17} className="profile-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <CheckCircle2 size={17} />
                      </>
                    )}
                  </button>

                  <span>Your information stays private.</span>
                </div>
              </aside>
            </div>

            <div className="profile-bottom-actions">
              <button
                type="button"
                className="profile-cancel"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </button>
            </div>
          </form>

          <footer className="profile-footer">
            <span>© 2026 Job Signal</span>
            <span>Built for your next career move.</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default EditProfile
