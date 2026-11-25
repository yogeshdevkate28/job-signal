
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Mail, Lock } from 'lucide-react'
import axios from 'axios'
import '../App.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')

  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login/',
        { email, password }
      )

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      navigate('/dashboard', {
        state: { message: 'Login successful! Welcome back.' }
      })
    } catch (error) {
      setMessageType('error')

      const detail = error.response?.data?.detail

      setMessage(
        detail || 'Invalid email or password. Please try again.'
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

        <span className="eyebrow">WELCOME BACK</span>
        <h1>Good to see you again.</h1>
        <p>Log in to continue discovering opportunities.</p>

        {location.state?.message && (
          <div className="auth-message success">
            {location.state.message}
          </div>
        )}

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="start-btn auth-submit">
            Log in ↗
          </button>
        </form>

        {message && (
          <div className="auth-message error">{message}</div>
        )}

        <div className="auth-switch">
          Don't have an account? <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
