import React from 'react'



export default function Dashboard(){
// Estetica temporal :3
    const kpis = {
    completadas: 1,
    metas: '1/2',
    puntos: 850,
    canjes: 1,
    progreso: 100
  }
  const recompensas = [
    { nombre:'Día de teletrabajo', puntos:100 },
    { nombre:'Salida anticipada', puntos:50 },
    { nombre:'Almuerzo gratis', puntos:75 },
  ]
  const recientes = [
    { nombre:'Capacitación equipo', estado:'Completed', puntos:80 },
  ]
  const canjes = [
    { nombre:'Almuerzo gratis', fecha:'2025-01-25', puntos:-75 },
  ]

  return (
    <div>
      <div className="banner">
        <div>
          <div style={{opacity:.9,fontWeight:700,fontSize:18}}>¡Bienvenido!</div>
          <div style={{opacity:.85}}>Tienes 0 tareas pendientes y 0 en progreso.</div>
        </div>
      </div>

      <div className="grid" style={{marginTop:16}}>
        <div className="stat">
          <div className="statTitle">Tareas Completadas</div>
          <div className="statValue">{kpis.completadas}</div>
        </div>
        <div className="stat">
          <div className="statTitle">Metas Alcanzadas</div>
          <div className="statValue">{kpis.metas}</div>
        </div>
        <div className="stat">
          <div className="statTitle">Puntos Acumulados</div>
          <div className="statValue">{kpis.puntos}</div>
        </div>
        <div className="stat">
          <div className="statTitle">Recompensas Canjeadas</div>
          <div className="statValue">{kpis.canjes}</div>
        </div>

        <div className="progressWrap card">
          <h3>Progreso de Tareas</h3>
          <div className="progressBar" style={{marginTop:10}}>
            <div className="progressInner" style={{width: kpis.progreso + '%'}} />
          </div>
          <div className="row" style={{marginTop:10, color:'var(--muted)'}}>
            <span>Completadas: 1</span><span>En Progreso: 0</span><span>Pendientes: 0</span>
          </div>
        </div>

        <div className="listWrap">
          <div className="list">
            <h3>Recompensas Disponibles</h3>
            {recompensas.map((r,i)=>(
              <div key={i} className="listItem">
                <div>{r.nombre}</div>
                <div style={{opacity:.8}}>{r.puntos} puntos</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{gridColumn:'1 / span 7'}}>
          <h3>Tareas Recientes</h3>
          {recientes.map((t,i)=>(
            <div key={i} className="listItem">
              <div>{t.nombre}</div>
              <div style={{opacity:.8}}>{t.puntos} pts</div>
            </div>
          ))}
        </div>

        <div className="card" style={{gridColumn:'span 5'}}>
          <h3>Canjes Recientes</h3>
          {canjes.map((c,i)=>(
            <div key={i} className="listItem">
              <div>
                <div>{c.nombre}</div>
                <div style={{opacity:.6, fontSize:12}}>{c.fecha}</div>
              </div>
              <div style={{color:'var(--danger)'}}>{c.puntos} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
