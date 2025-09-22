import React from 'react'

export default function Dashboard(){
  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Bienvenido a TaskRewardPro. Aquí pondremos el resto de módulos (Tareas, Recompensas, Métricas).</p>
        <ul>
          <li>Este dashboard es accesible solo para usuarios logueados.</li>
          <li>El token se guarda en <code>localStorage</code>.</li>
          <li>Configura <code>VITE_API_URL</code> para apuntar a tu backend.</li>
          <li>Para pruebas sin backend, usa <code>VITE_USE_MOCK=1</code>.</li>
        </ul>
      </div>
    </div>
  )
}
