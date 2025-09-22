import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function NavBar() {
  const { user, logout } = useAuth()
  return (
    <nav className="nav">
      <Link to="/" className="brand">TaskRewardPro</Link>
      <div className="spacer" />
      {user ? (
        <>
          <span className="welcome">Hola, {user.name || user.email}</span>
          <button onClick={logout} className="btn">Salir</button>
        </>
      ) : (
        <>
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn outline">Crear usuario</Link>
        </>
      )}
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<h2>404</h2>} />
        </Routes>
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} TaskRewardPro</span>
      </footer>
    </AuthProvider>
  )
}
