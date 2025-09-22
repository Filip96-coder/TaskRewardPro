import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="container"><div className="card"><p>Cargando...</p></div></div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}
