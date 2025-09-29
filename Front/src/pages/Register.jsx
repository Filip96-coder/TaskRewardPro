import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register(){
  const { register } = useAuth()
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirm,setConfirm] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const navigate = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    setError('')
    if(!name || !email || !password){ setError('Completa todos los campos'); return }
    if(password.length < 6){ setError('La contraseña debe tener al menos 6 caracteres'); return }
    if(password !== confirm){ setError('Las contraseñas no coinciden'); return }
    try{
      setLoading(true)
      await register({ name, email, password })
      navigate('/app/dashboard', { replace:true })
    }catch(err){
      setError(err.message || 'Error al crear usuario')
    }finally{
      setLoading(false)
    }
  }

return (
    <div className="container">
      <div className="auth-card card">
        <div className="auth-header">
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">Regístrate para empezar a usar Task Reward Pro.</p>
        </div>
        <form onSubmit={onSubmit}>
          <label>Nombre</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre y apellido" />
          <label>Correo</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tucorreo@empresa.com" />
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
          <label>Confirmar contraseña</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repite la contraseña" />
          {error && <div className="error">{error}</div>}
          <button className="btn auth-btn" disabled={loading}>{loading?'Creando...':'Crear cuenta'}</button>
          <div className="row" style={{marginTop:10, justifyContent:'center'}}>
            <span style={{color:'var(--muted)'}}>¿Ya tienes cuenta?</span>
            <Link to="/login" className="link">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
