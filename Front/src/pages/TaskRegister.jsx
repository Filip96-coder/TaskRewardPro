import Swal from 'sweetalert2'
import React, { useEffect, useState } from 'react'
import { createTask, listTasks, deleteTask, updateTask } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { submitTaskFile } from "../services/api.js"

export default function TaskRegister() {
  const { user, loading } = useAuth()
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
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    (async () => {
      const t = await listTasks().catch(() => [])
      setTasks(t)
    })()
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!title || !description) { setError('Título y descripción son obligatorios'); return }
    if (points < 0) { setError('Los puntos no pueden ser negativos'); return }

    const date = dueDate ? new Date(dueDate) : null
    if (date) {
      date.setDate(date.getDate() + 1)
    }
    try {
      setSaving(true)
      // Simula upload
      setProgress(0)
      await new Promise(resolve => {
        let p = 0
        const id = setInterval(() => {
          p += 15
          setProgress(Math.min(p, 100))
          if (p >= 100) { clearInterval(id); resolve() }
        }, 120)
      })

      const payload = {
        title,
        description,
        dueDate: date,
        points: Number(points),
        attachments: files.map(f => ({ name: f.name, type: f.type, size: f.size }))
      }
      const saved = await createTask(payload)
      setSuccess('Tarea creada con éxito')
      setTasks(prev => [saved, ...prev])

      // reset
      setTitle(''); setDescription(''); setDueDate(''); setPoints(10); setFiles([]); setProgress(0)
    } catch (err) {
      setError(err.message || 'No se pudo registrar la tarea')
    } finally {
      setSaving(false)
    }
  }

  async function onEdit(tarea) {
    const { value: formValues } = await Swal.fire({
      title: "Editar tarea",
      html: `
        <input id="title" class="swal2-input" placeholder="Título" value="${tarea.title}">
        <input id="desc" class="swal2-input" placeholder="Descripción" value="${tarea.description}">
        <input id="points" type="number" min="0" class="swal2-input" placeholder="Puntos" value="${tarea.points}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar cambios",
      cancelButtonText: "Cancelar",
      background: "#1E1E2F",
      color: "#FFFFFF",
      confirmButtonColor: "#00C896",
      cancelButtonColor: "#E53E3E",
      preConfirm: () => {
        const title = document.getElementById("title").value.trim()
        const description = document.getElementById("desc").value.trim()
        const points = parseInt(document.getElementById("points").value, 10)
        if (!title || !description || isNaN(points)) {
          Swal.showValidationMessage("Completa todos los campos antes de guardar")
        }
        return { title, description, points }
      }
    })
  
    if (!formValues) return
  
    try {
     
      const updated = await updateTask(tarea._id, {
        title: formValues.title,
        description: formValues.description,
        points: formValues.points,
        dueDate: tarea.dueDate
      })
  
      
      setTasks(prev =>
        prev.map(t => (t._id === updated._id ? updated : t))
      )
  
      Swal.fire({
        icon: "success",
        title: "Tarea actualizada",
        background: "#1E1E2F",
        color: "#00C896",
        confirmButtonColor: "#00C896",
      })
    } catch (err) {
      console.error("Error actualizando tarea:", err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la tarea",
        background: "#1E1E2F",
        color: "#FFFFFF",
        confirmButtonColor: "#E53E3E",
      })
    }
  }
  
  

  async function onDelete(id) {
    const result = await Swal.fire({
      title: "¿Eliminar tarea?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1E1E2F",         
      color: "#FFFFFF",              
      confirmButtonColor: "#E53E3E", 
      cancelButtonColor: "#00C896",  
    })
  
 
    if (result.isConfirmed) {
      try {
        await deleteTask(id)
        setTasks(prev => prev.filter(t => t._id !== id))
  
        await Swal.fire({
          icon: "success",
          title: "Tarea eliminada",
          text: "La tarea fue eliminada correctamente.",
          background: "#1E1E2F",
          color: "#00C896",
          confirmButtonColor: "#00C896",
        })
      } catch (err) {
        console.error("Error eliminando tarea:", err)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la tarea",
          background: "#1E1E2F",
          color: "#FFFFFF",
          confirmButtonColor: "#E53E3E",
        })
      }
    }
  }

  async function handleFileSubmit(taskId, file) {
    try {
      await submitTaskFile(taskId, file)
      await Swal.fire({
        icon: "success",
        title: "Entrega enviada",
        text: "Tu evidencia fue subida correctamente y está pendiente de revisión.",
        background: "#1E1E2F",
        color: "#00C896",
        confirmButtonColor: "#00C896",
      })
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al subir archivo",
        text: err.message || "No se pudo subir la evidencia.",
        background: "#1E1E2F",
        color: "#FFFFFF",
        confirmButtonColor: "#E53E3E",
      })
    }
  }
  


  if (loading) {
    return <p>⏳ Cargando...</p>
  }

  return (
    <div className="container" style={{ padding: 0 }}>


      {user?.rol === "Admin" && (

        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Registrar Tarea</h3>
          <form onSubmit={onSubmit}>
            <label>Título *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Capacitación de seguridad" />
            <label>Descripción *</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe lo realizado…" />


            <div className="row">
              <div style={{ flex: 1 }}>
                <label>Fecha límite</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <div style={{ width: 220 }}>
                <label>Puntos</label>
                <input type="number" min="0" value={points} onChange={e => setPoints(e.target.value)} />
              </div>
            </div>

            <button className="btn" style={{ marginTop: 12 }} disabled={saving}>
              {saving ? 'Creando…' : 'Crear tarea'}
            </button>
          </form>
        </div>
      )}

      
      <div className="card">
        <h3>Tareas disponibles</h3>
        {!tasks.length && <div style={{ opacity: .7 }}>Aún no hay tareas disponibles.</div>}
        {tasks.map(t => (
          <div key={t.id} className="listItem">
            <div>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              <div style={{ opacity: .7, fontSize: 12 }}>
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

  {user?.rol === "Trabajador" && (
  <div style={{ marginTop: 8 }}>

    <input
      type="file"
      id={`file_${t._id}`}
      style={{ display: "none" }}
      accept=".pdf,.png,.jpg,.jpeg,.txt"
      onChange={async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        console.log("📤 Archivo seleccionado:", file.name) 
        await handleFileSubmit(t._id, file)
        e.target.value = "" 
      }}
    />

    
     {/* El label actúa como botón */}
     <label
      htmlFor={`file_${t._id}`}
      className="btn-action update-btn"
      style={{
        display: "inline-block",
        cursor: "pointer",
        padding: "6px 14px",
        borderRadius: "8px",
        fontWeight: 600,
      }}
    >
      Subir entrega
    </label>
  </div>
)}


  {user?.rol === "Admin" && (
     <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
     <button onClick={() => onEdit(t)} className="btn-action update-btn">
       Actualizar
     </button>
     <button onClick={() => onDelete(t._id)} className="btn-action delete-btn">
       Eliminar
     </button>
   </div>
  )}
</div>

          </div>
        ))}
      </div>
    </div>
  )
}

