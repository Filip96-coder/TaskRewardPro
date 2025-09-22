import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login(){
  const { login } = useAuth()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [remember,setRemember] = useState(true)   // <-- faltaba
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(()=>{
    const saved = localStorage.getItem('trp_saved_email')
    if (saved) setEmail(saved)
  },[])

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    if(!email || !password){ setError('Completa todos los campos'); return }
    try{
      setLoading(true)
      await login(email, password)
      if (remember) localStorage.setItem('trp_saved_email', email)
      else localStorage.removeItem('trp_saved_email')
      navigate(from, { replace: true })
    }catch(err){
      setError(err.message || 'Error al iniciar sesión')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1 className="auth-title">Task Reward Pro</h1>
          <p className="auth-subtitle">Aumenta la productividad con recompensas SMART</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <label>Correo electrónico</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ejemplo@empresa.com" autoComplete="email" />

          <label>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="********" autoComplete="current-password" />

          {error && <div className="error">{error}</div>}

          <div className="row auth-row">
            <label className="remember">
              <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} />
              <span>Recordarme</span>
            </label>
            <Link to="/register" className="link">¿No tienes cuenta?</Link>
          </div>

          <button className="btn auth-btn" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>

          <button
            type="button"
            className="btn outline auth-btn"
            onClick={async()=>{
              try{
                setLoading(true)
                const demoEmail = 'demo@taskreward.pro'
                const demoPass = 'password123'
                try{ await login(demoEmail, demoPass) }
                catch{
                  const api = await import('../services/api.js')
                  try{ await api.register({ name:'Usuario Demo', email:demoEmail, password:demoPass }) }catch{}
                  await login(demoEmail, demoPass)
                }
                navigate('/dashboard', { replace:true })
              }catch{ setError('No se pudo entrar en modo demo') }
              finally{ setLoading(false) }
            }}
          >
            Entrar como demo
          </button>

          <p className="hint">Demo – Contraseña para todos los usuarios: <code>password123</code></p>
        </form>
      </div>
    </div>
  )
}

