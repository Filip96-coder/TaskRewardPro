import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import TaskRegister from './pages/TaskRegister.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<div style={{padding:20}}><Login /></div>} />
        <Route path="/register" element={<div style={{padding:20}}><Register /></div>} />
        <Route path="/app" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tareas/registro" element={<TaskRegister />} />
        </Route>
        <Route path="*" element={<h2 style={{padding:24}}>404</h2>} />
      </Routes>
    </AuthProvider>
  )
}
