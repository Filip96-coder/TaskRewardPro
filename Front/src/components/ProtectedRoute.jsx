import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from './Sidebar.jsx'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div style={{padding:24}}>Cargando…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  // Mapa de rutas a títulos
  const titleMap = {
    'dashboard': 'Dashboard',
    'tareas/registro': 'Registro de Tareas',
    'recompensas': 'Recompensas',
    'usuarios': 'Usuarios',
    'canjes': 'Historial de Canjes'
  }

  const path = location.pathname.replace(/^\/app\/?/, '')
  const title = titleMap[path] || 'Task Reward Pro'

  return (
    <div className="layout">
      <Sidebar />
      <div>
        <div className="header">
          <div className="title">{title}</div>
          <div className="kpi">
            <span style={{opacity:.7, marginRight:8}}>{user.name || user.email}</span>
            <span className="badge">{user.points ?? 0} pts</span>
          </div>
        </div>
        <div className="main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
