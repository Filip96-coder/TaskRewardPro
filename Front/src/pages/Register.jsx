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
      navigate('/dashboard', { replace:true })
    }catch(err){
      setError(err.message || 'Error al crear usuario')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:520, margin:'24px auto'}}>
        <h2>Crear usuario</h2>
        <p style={{color:'var(--muted)'}}>Registra un usuario para acceder.</p>
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
          <div className="row" style={{marginTop:12}}>
            <button className="btn" disabled={loading}>{loading?'Creando...':'Crear'}</button>
            <Link to="/login" className="link">Ya tengo cuenta</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
