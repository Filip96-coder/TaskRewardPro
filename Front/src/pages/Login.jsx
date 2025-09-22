import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login(){
  const { login } = useAuth()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    if(!email || !password){ setError('Completa todos los campos'); return }
    try{
      setLoading(true)
      await login(email, password)
      navigate(from, { replace: true })
    }catch(err){
      setError(err.message || 'Error al iniciar sesión')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:480, margin:'24px auto'}}>
        <h2>Iniciar sesión</h2>
        <p style={{color:'var(--muted)'}}>Usa tu correo y contraseña.</p>
        <form onSubmit={onSubmit}>
          <label>Correo</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tucorreo@empresa.com" />
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          {error && <div className="error">{error}</div>}
          <div className="row" style={{marginTop:12}}>
            <button className="btn" disabled={loading}>{loading?'Entrando...':'Entrar'}</button>
            <Link to="/register" className="link">Crear usuario</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
