import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Sidebar(){
  const { user, logout } = useAuth()
  const link = (to, label) => (
    <NavLink
      to={to}
      className={({isActive}) => 'navItem' + (isActive ? ' active' : '')}
    >
      {label}
    </NavLink>
  )
  return (
    <aside className="aside">
      <div className="brand">Task Reward Pro</div>
      <div className="userBlock">
        <div style={{width:32,height:32,borderRadius:999,background:'#1f2a48'}} />
        <div>
          <div style={{fontWeight:600}}>{user?.name || 'Usuario'}</div>
          <div style={{fontSize:12,opacity:.7}}>{user?.points ?? 850} puntos</div>
        </div>
      </div>

      <nav style={{display:'grid',gap:6}}>
          {link('/app/dashboard', 'Dashboard')}
        {link('/app/tareas/registro', 'Tareas')}
        {link('/app/metas', 'Metas')}
        {link('/app/recompensas', 'Recompensas')}
        {link('/app/canjes', 'Historial de Canjes')}
        {link('/app/ranking', 'Ranking')}
        {link('/app/usuarios', 'Usuarios')}
      </nav>

      <div style={{marginTop:'auto'}}>
        <button className="btn outline" style={{width:'100%', marginTop:12}} onClick={logout}>Cerrar sesión</button>
      </div>
    </aside>
  )
}
