import React, { useEffect, useState } from 'react'
import { createTask, listTasks } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'   

export default function TaskRegister(){
  const { user,loading } = useAuth()   
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [points, setPoints] = useState(10)
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(()=>{
    (async()=>{
      const t = await listTasks().catch(()=>[])
      setTasks(t)
    })()
  },[])

  function onPickFiles(e){
    const list = Array.from(e.target.files || [])
    const allowed = ['application/pdf','image/png','image/jpeg','text/plain']
    const cleaned = list.filter(f => allowed.includes(f.type) && f.size <= 5*1024*1024)
    setFiles(cleaned)
  }

  async function onSubmit(e){
    e.preventDefault()
    setError(''); setSuccess('')
    if(!title || !description){ setError('Título y descripción son obligatorios'); return }
    if(points < 0){ setError('Los puntos no pueden ser negativos'); return }

    const date = dueDate ? new Date(dueDate) : null
    if (date) {
    date.setDate(date.getDate() + 1)
    }


    try{
      setSaving(true)
      // Simula upload
      setProgress(0)
      await new Promise(resolve=>{
        let p = 0
        const id = setInterval(()=>{
          p += 15
          setProgress(Math.min(p, 100))
          if (p >= 100){ clearInterval(id); resolve() }
        }, 120)
      })

      const payload = {
        title,
        description,
        dueDate: date,
        points: Number(points),
        attachments: files.map(f => ({ name:f.name, type:f.type, size:f.size }))
      }
      const saved = await createTask(payload)
      setSuccess('Tarea creada con éxito')
      setTasks(prev => [saved, ...prev])

      // reset
      setTitle(''); setDescription(''); setDueDate(''); setPoints(10); setFiles([]); setProgress(0)
    }catch(err){
      setError(err.message || 'No se pudo registrar la tarea')
    }finally{
      setSaving(false)
    }
  }


if (loading) {
  return <p>⏳ Cargando...</p>
}
    
  return (
    <div className="container" style={{padding:0}}>
      
    
      {user?.rol === "Admin" && (
        <div className="card" style={{marginBottom:16}}>
          <h3 style={{marginBottom:8}}>Registrar Tarea</h3>
          <form onSubmit={onSubmit}>
            <label>Título *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ej: Capacitación de seguridad" />
            <label>Descripción *</label>
            <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe lo realizado…" />

            <div className="row">
              <div style={{flex:1}}>
                <label>Fecha límite</label>
                <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
              </div>
              <div style={{width:220}}>
                <label>Puntos</label>
                <input type="number" min="0" value={points} onChange={e=>setPoints(e.target.value)} />
              </div>
            </div>

            <button className="btn" style={{marginTop:12}} disabled={saving}>
              {saving ? 'Creando…' : 'Crear tarea'}
            </button>
          </form>
        </div>
      )}

      {/* Todos ven la lista de tareas */}
      <div className="card">
        <h3>Tareas disponibles</h3>
        {!tasks.length && <div style={{opacity:.7}}>Aún no hay tareas disponibles.</div>}
        {tasks.map(t=>(
          <div key={t.id} className="listItem">
            <div>
              <div style={{fontWeight:600}}>{t.title}</div>
              <div style={{opacity:.7, fontSize:12}}>
                {t.dueDate ? `Vence: ${new Date(t.dueDate).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`
  : 'Sin fecha límite'} · {t.attachments?.length || 0} adjuntos
              </div>
            </div>
            <div style={{display:'grid', justifyItems:'end'}}>
              <span style={{opacity:.8}}>{t.points} pts</span>
              <span style={{fontSize:12, opacity:.7}}>Estado: {t.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

