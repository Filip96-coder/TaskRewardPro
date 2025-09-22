import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from './Sidebar.jsx'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div style={{padding:24}}>Cargando…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return (
    <div className="layout">
      <Sidebar />
      <div>
        <div className="header">
          <div className="title">Dashboard</div>
          <div className="kpi"><span style={{opacity:.7, marginRight:8}}>{user.name || user.email}</span><span className="badge">{user.points ?? '850'} pts</span></div>
        </div>
        <div className="main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
