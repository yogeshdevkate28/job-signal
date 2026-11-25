
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Lock } from 'lucide-react'
import axios from 'axios'
import '../App.css'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('Creating account...')

    try {
      await axios.post('http://127.0.0.1:8000/api/register/', {
        email: email,
        password: password,
      })

          navigate('/login', {
  state: { message: 'Account created successfully! Please log in.' }
})

    } catch (error) {
      const data = error.response?.data

      setMessage(
        data ? JSON.stringify(data) : 'Something went wrong. Please try again.'
      )
    }
  }

  return (
    <div className="auth-page">
      <Link to="/" className="logo auth-logo">
        job<span>signal.</span>
      </Link>

      <div className="auth-card">
        <Link to="/" className="auth-back">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <span className="eyebrow">GET STARTED</span>
        <h1>Create your account.</h1>
        <p>Start discovering startup opportunities that match you.</p>

        <form onSubmit={handleRegister}>
          <label>Full name</label>
          <div className="auth-input">
            <User size={18} />
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <label>Email address</label>
          <div className="auth-input">
            <Mail size={18} />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="auth-input">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="start-btn auth-submit">
            Create account ↗
          </button>
        </form>

        {message && <p>{message}</p>}

        <div className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
