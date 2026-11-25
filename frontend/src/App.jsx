
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import About from './pages/About'
import Login from './pages/Login'
import Jobs from './pages/Jobs'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import JobDetails from './pages/JobDetails'
import Applications from './pages/Applications'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />

      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/applications" element={<Applications />} />
    </Routes>
  )
}

export default App
