import Swal from 'sweetalert2'
import React, { useEffect, useState } from 'react'
import { createTask, listTasks, deleteTask, updateTask,listUserTasks } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { submitTaskFile, claimPoints } from "../services/api.js"
import { listTaskSubmissions, decideSubmission,API_BASE } from "../services/api.js"



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

  async function refreshSubmissions() {
    try {
      let tasksFromServer = []
  
      
      if (user?.rol === "Admin") {
        tasksFromServer = (await listTasks().catch(() => []))
          .filter(t => t.status !== "Completada" && t.status !== "Rechazada")
      }
  
      
      else if (user?.rol === "Trabajador") {
        tasksFromServer = await listUserTasks().catch(() => [])
      }
  
      
      const withSubmissions = await Promise.all(
        tasksFromServer.map(async (task) => {
          try {
            const token = localStorage.getItem("token")
            const res = await fetch(`${API_BASE}/api/tasks/${task._id}/submission`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
              const mySubmission = await res.json()
              return { ...task, mySubmission }
            }
          } catch (err) {
            console.error("❌ Error obteniendo entrega:", err)
          }
          return { ...task }
        })
      )
  
      setTasks(withSubmissions)
    } catch (err) {
      console.error("❌ Error al refrescar tareas:", err)
    }
  }
  

  useEffect(() => {
    if (!user) return
    refreshSubmissions()
  }, [user])

  

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
  
      // ✅ Actualiza el estado local sin recargar
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t._id === taskId
            ? { ...t, mySubmission: { status: "Pendiente" } }
            : t
        )
      )
  
      // (opcional, para sincronizar con DB)
      await refreshSubmissions()
  
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
  

  async function handleViewSubmissions(taskId) {
    try {
      const submissions = await listTaskSubmissions(taskId)
  
      if (!submissions.length) {
        await Swal.fire({
          icon: "info",
          title: "Sin entregas",
          text: "Aún no hay entregas para esta tarea.",
          background: "#1E1E2F",
          color: "#FFFFFF",
          confirmButtonColor: "#00C896",
        })
        return
      }
  
      // construir HTML del listado
      const htmlList = submissions.map((s) => `
  <div style="margin-bottom:10px; text-align:left;">
    <strong>${s.user?.name || s.user?.nombre || "Usuario"}</strong> 
    <br/>Archivo: <a href="${API_BASE}${s.filePath}" target="_blank" style="color:#00C896">Ver evidencia</a>
    <br/>Estado: <b>${s.status}</b>
    <br/>
    <button id="approve_${s._id}" style="background:#00C896;color:#fff;padding:4px 10px;border:none;border-radius:6px;cursor:pointer;margin-top:6px;">Aprobar</button>
    <button id="reject_${s._id}" style="background:#E53E3E;color:#fff;padding:4px 10px;border:none;border-radius:6px;cursor:pointer;margin-top:6px;margin-left:4px;">Rechazar</button>
  </div>
`).join("")
  
      const modal = await Swal.fire({
        title: "Entregas de la tarea",
        html: htmlList,
        width: 600,
        background: "#1E1E2F",
        color: "#FFFFFF",
        showConfirmButton: false,
        didOpen: () => {
          submissions.forEach((s) => {
            document.getElementById(`approve_${s._id}`).onclick = async () => {
              await handleDecision(taskId, s._id, "approve")
            }
            document.getElementById(`reject_${s._id}`).onclick = async () => {
              await handleDecision(taskId, s._id, "reject")
            }
          })
        }
      })
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar entregas",
        text: err.message || "No se pudieron obtener las entregas",
        background: "#1E1E2F",
        color: "#FFFFFF",
        confirmButtonColor: "#E53E3E",
      })
    }
  }

  async function handleDecision(taskId, subId, action) {
    const confirm = await Swal.fire({
      title: action === "approve" ? "¿Aprobar entrega?" : "¿Rechazar entrega?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: action === "approve" ? "Aprobar" : "Rechazar",
      cancelButtonText: "Cancelar",
      background: "#1E1E2F",
      color: "#FFFFFF",
      confirmButtonColor: action === "approve" ? "#00C896" : "#E53E3E",
      cancelButtonColor: "#444",
    })
    if (!confirm.isConfirmed) return
  
    try {
      await decideSubmission(taskId, subId, action)
  
      
      setTasks(prevTasks => prevTasks.filter(t => t._id !== taskId))
  
      await Swal.fire({
        icon: "success",
        title: action === "approve" ? "Entrega aprobada" : "Entrega rechazada",
        background: "#1E1E2F",
        color: "#00C896",
        confirmButtonColor: "#00C896",
      })
  
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo procesar la acción.",
        background: "#1E1E2F",
        color: "#FFFFFF",
        confirmButtonColor: "#E53E3E",
      })
    }
    await refreshSubmissions()
  }
  

  async function handleClaimPoints(taskId) {
    try {
      await claimPoints(taskId)
      await refreshSubmissions()
      Swal.fire({
        icon: "success",
        title: "Puntos reclamados",
        text: "Los puntos han sido añadidos a tu cuenta.",
        background: "#1E1E2F",
        color: "#00C896",
        confirmButtonColor: "#00C896",
      })
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudieron reclamar los puntos.",
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
          <div key={t._id} className="listItem">
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
            <div style={{ display: 'grid', justifyItems: 'end' }}>
              <span style={{ opacity: .8 }}>{t.points} pts</span>
              <span style={{ fontSize: 12, opacity: .7 }}>Estado: {t.status}</span>

{user?.rol === "Trabajador" && (
  <div style={{ marginTop: 8 }}>
    {t.mySubmission ? (
      <>
        {t.mySubmission.status === "Pendiente" && (
          <span style={{ color: "#FFD700" }}>⏳ Pendiente de revisión</span>
        )}
        {t.mySubmission.status === "Aprobada" && (
          <div>
            <span style={{ color: "#00C896" }}>🟢 Aprobada</span>
            {!t.mySubmission.claimed && (
              <button
                onClick={() => handleClaimPoints(t._id)}
                className="btn-action update-btn"
                style={{ marginLeft: 10 }}
              >
                Reclamar puntos
              </button>
            )}
            {t.mySubmission.claimed && (
              <span style={{ marginLeft: 10, color: "#00C896" }}>
                ✅ Puntos reclamados
              </span>
            )}
          </div>
        )}
        {t.mySubmission.status === "Rechazada" && (
          <div>
            <span style={{ color: "#E53E3E" }}>🔴 Rechazada</span>
            <label
  htmlFor={`retry_${t._id}`}
  className="btn-action delete-btn"
  style={{
    marginLeft: 10,
    display: "inline-block",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "8px",
    fontWeight: 600,
  }}
>
  Reintentar
</label>

<input
  type="file"
  id={`retry_${t._id}`}
  style={{ display: "none" }}
  accept=".pdf,.png,.jpg,.jpeg,.txt"
  onChange={async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleFileSubmit(t._id, file)
    e.target.value = ""
  }}
/>

          </div>
        )}
      </>
    ) : (
      
      <>
        <input
          style={{ display: "none" }}
          type="file"
          id={`file_${t._id}`}
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            await handleFileSubmit(t._id, file)
            e.target.value = ""
          }}
          accept=".pdf,.png,.jpg,.jpeg,.txt"
        />

<label
  htmlFor={`file_${t._id}`}
  className="btn-action update-btn"
  style={{
    display: "inline-block",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "8px",
    fontWeight: 600,
  }}
>
  Subir entrega
</label>

      </>
    )}
  </div>
)}

              {user?.rol === "Admin" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => onEdit(t)} className="btn-action update-btn">Actualizar</button>
                    <button onClick={() => onDelete(t._id)} className="btn-action delete-btn">Eliminar</button>
                    <button onClick={() => handleViewSubmissions(t._id)} className="btn-action update-btn">Ver entregas</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

