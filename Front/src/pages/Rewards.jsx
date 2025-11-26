import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext.jsx';
import {
  listRewards,
  createReward,
  updateReward,
  deleteReward,
  redeemReward
} from '../services/api.js';

export default function Rewards() {
  const { user, setUser, loading } = useAuth();

  // Campos del formulario (basados en el schema)
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [puntosRequeridos, setPuntosRequeridos] = useState(50);
  const [limiteCanjes, setLimiteCanjes] = useState('');
  const [fechaLimiteCanje, setFechaLimiteCanje] = useState('');
  const [saving, setSaving] = useState(false);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    if (!user || loading) return;
    loadRewards();
  }, [user, loading]);

  async function loadRewards() {
    try {
      const data = await listRewards();
      setRewards(data);
    } catch (err) {
      console.error('Error cargando recompensas:', err);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();

    if (!nombre.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Nombre requerido',
        text: 'El nombre de la recompensa es obligatorio.',
        background: '#1E1E2F',
        color: '#fff',
        confirmButtonColor: '#E53E3E'
      });
      return;
    }

    if (!puntosRequeridos || puntosRequeridos <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Puntos inválidos',
        text: 'Los puntos requeridos deben ser mayores que 0.',
        background: '#1E1E2F',
        color: '#fff',
        confirmButtonColor: '#E53E3E'
      });
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      puntosRequeridos: Number(puntosRequeridos),
      limiteCanjes: limiteCanjes ? Number(limiteCanjes) : undefined,
      fechaLimiteCanje: fechaLimiteCanje || undefined,
    };

    try {
      setSaving(true);
      const saved = await createReward(payload);
      setRewards(prev => [saved, ...prev]);

      Swal.fire({
        icon: 'success',
        title: 'Recompensa creada',
        background: '#1E1E2F',
        color: '#00C896',
        confirmButtonColor: '#00C896'
      });

      setNombre('');
      setDescripcion('');
      setPuntosRequeridos(50);
      setLimiteCanjes('');
      setFechaLimiteCanje('');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'No se pudo crear la recompensa.',
        background: '#1E1E2F',
        color: '#fff',
        confirmButtonColor: '#E53E3E'
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(reward) {
    const fechaISO = reward.fechaLimiteCanje
      ? new Date(reward.fechaLimiteCanje).toISOString().slice(0, 10)
      : '';

    const { value: formValues } = await Swal.fire({
      title: 'Editar recompensa',
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${reward.nombre || ''}">
        <input id="descripcion" class="swal2-input" placeholder="Descripción" value="${reward.descripcion || ''}">
        <input id="puntos" type="number" min="1" class="swal2-input" placeholder="Puntos requeridos" value="${reward.puntosRequeridos || 0}">
        <input id="limite" type="number" min="0" class="swal2-input" placeholder="Límite de canjes (opcional)" value="${reward.limiteCanjes ?? ''}">
        <input id="fecha" type="date" class="swal2-input" value="${fechaISO}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      background: '#1E1E2F',
      color: '#FFFFFF',
      confirmButtonColor: '#00C896',
      cancelButtonColor: '#E53E3E',
      preConfirm: () => {
        const nombre = document.getElementById('nombre').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        const puntos = parseInt(document.getElementById('puntos').value, 10);
        const limiteRaw = document.getElementById('limite').value;
        const fecha = document.getElementById('fecha').value;

        if (!nombre || !puntos || puntos <= 0) {
          Swal.showValidationMessage('Nombre y puntos requeridos son obligatorios.');
          return;
        }

        return {
          nombre,
          descripcion,
          puntosRequeridos: puntos,
          limiteCanjes: limiteRaw ? parseInt(limiteRaw, 10) : undefined,
          fechaLimiteCanje: fecha || undefined,
        };
      }
    });

    if (!formValues) return;

    try {
      const updated = await updateReward(reward._id, formValues);
      setRewards(prev => prev.map(r => (r._id === updated._id ? updated : r)));

      Swal.fire({
        icon: 'success',
        title: 'Recompensa actualizada',
        background: '#1E1E2F',
        color: '#00C896',
        confirmButtonColor: '#00C896'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la recompensa.',
        background: '#1E1E2F',
        color: '#FFFFFF',
        confirmButtonColor: '#E53E3E'
      });
    }
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: '¿Eliminar recompensa?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1E1E2F',
      color: '#FFFFFF',
      confirmButtonColor: '#E53E3E',
      cancelButtonColor: '#00C896'
    });

    if (!result.isConfirmed) return;

    try {
      await deleteReward(id);
      setRewards(prev => prev.filter(r => r._id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Recompensa eliminada',
        background: '#1E1E2F',
        color: '#00C896',
        confirmButtonColor: '#00C896'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la recompensa.',
        background: '#1E1E2F',
        color: '#FFFFFF',
        confirmButtonColor: '#E53E3E'
      });
    }
  }

  function isExpired(r) {
    if (!r.fechaLimiteCanje) return false;
    const hoy = new Date();
    const fin = new Date(r.fechaLimiteCanje);
    return fin < hoy;
  }
  function isLimitReached(r) {
    if (r.limiteCanjes == null) return false;
    return r.cantidadCanjes >= r.limiteCanjes;
  }

  async function handleRedeem(r) {
    if (user.rol !== 'Trabajador') return;

    if ((user.points || 0) < r.puntosRequeridos) {
      Swal.fire({
        icon: 'error',
        title: 'Puntos insuficientes',
        text: `Necesitas ${r.puntosRequeridos} puntos y tienes ${user.points || 0}.`,
        background: '#1E1E2F',
        color: '#fff',
        confirmButtonColor: '#E53E3E'
      });
      return;
    }
    if (isLimitReached(r)) {
      Swal.fire({
        icon: 'info',
        title: 'Límite alcanzado',
        text: 'Esta recompensa ya alcanzó su límite de canjes.',
        background: '#1E1E2F',
        color: '#fff',
        confirmButtonColor: '#00C896'
      });
      return;
    }
    if (isExpired(r)) {
      Swal.fire({
        icon: 'info',
        title: 'Recompensa vencida',
        text: 'La fecha límite de canje ya pasó.',
        background: '#1E1E2F',
        color: '#fff',
        confirmButtonColor: '#00C896'
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Canjear recompensa?',
      text: `Vas a canjear "${r.nombre}" por ${r.puntosRequeridos} puntos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, canjear',
      cancelButtonText: 'Cancelar',
      background: '#1E1E2F',
      color: '#fff',
      confirmButtonColor: '#00C896',
      cancelButtonColor: '#444'
    });

    if (!result.isConfirmed) return;

    try {
      await redeemReward(r._id);
      const nuevosPuntos = (user.points || 0) - r.puntosRequeridos;
      setUser({ ...user, points: nuevosPuntos });
      await loadRewards();

      Swal.fire({
        icon: 'success',
        title: '¡Canje exitoso!',
        text: 'Disfruta tu recompensa.',
        background: '#1E1E2F',
        color: '#fff',
        confirmButtonColor: '#00C896'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo canjear la recompensa.',
        background: '#1E1E2F',
        color: '#fff',
        confirmButtonColor: '#E53E3E'
      });
    }
  }

  if (loading || !user) return <p>Cargando...</p>;

  return (
    <div className="container" style={{ padding: 0 }}>
      {user.rol === 'Admin' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 8 }}>Crear Recompensa</h3>
          <form onSubmit={handleCreate}>
            <label>Nombre *</label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Bono de vacaciones"
            />

            <label>Descripción</label>
            <input
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Descripción breve de la recompensa"
            />

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ width: 200 }}>
                <label>Puntos requeridos *</label>
                <input
                  type="number"
                  min="1"
                  value={puntosRequeridos}
                  onChange={e => setPuntosRequeridos(Number(e.target.value))}
                />
              </div>
              <div style={{ width: 200 }}>
                <label>Límite de canjes</label>
                <input
                  type="number"
                  min="0"
                  value={limiteCanjes}
                  onChange={e => setLimiteCanjes(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
              <div style={{ width: 220 }}>
                <label>Fecha límite de canje</label>
                <input
                  type="date"
                  value={fechaLimiteCanje}
                  onChange={e => setFechaLimiteCanje(e.target.value)}
                />
              </div>
            </div>
            <button className="btn" style={{ marginTop: 12 }} disabled={saving}>
              {saving ? 'Creando…' : 'Crear recompensa'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Recompensas disponibles</h3>
        <div style={{ marginBottom: 12, opacity: 0.8 }}>
          Tienes <strong>{user?.points ?? 0}</strong> puntos
        </div>
        {!rewards.length && (
          <div style={{ opacity: 0.7 }}>Aún no hay recompensas disponibles.</div>
        )}
        {rewards.map(r => {
          const agotada = isLimitReached(r);
          const vencida = isExpired(r);
          const puedePagar = (user.points || 0) >= r.puntosRequeridos;
          const disabled = agotada || vencida || !puedePagar;
          return (
            <div key={r._id} className="listItem">
              <div>
                <div style={{ fontWeight: 600 }}>{r.nombre}</div>
                <div style={{ opacity: 0.8, fontSize: 13 }}>{r.descripcion}</div>
                <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>
                  Puntos requeridos: {r.puntosRequeridos}
                  {' · '}
                  Canjes: {r.cantidadCanjes || 0}
                  {r.limiteCanjes != null && ` / ${r.limiteCanjes}`}
                  {r.fechaLimiteCanje && (
                    <>
                      {' · Vence: '}
                      {new Date(r.fechaLimiteCanje).toLocaleDateString('es-CO')}
                    </>
                  )}
                </div>
                {(agotada || vencida) && (
                  <div style={{ fontSize: 12, marginTop: 2, color: '#E53E3E' }}>
                    {agotada && 'Límite de canjes alcanzado'}
                    {agotada && vencida && ' · '}
                    {vencida && 'Recompensa vencida'}
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', justifyItems: 'end', gap: 8 }}>
                {user.rol === 'Admin' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleEdit(r)}
                      className="btn-action update-btn"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="btn-action delete-btn"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
                {user.rol === 'Trabajador' && (
                  <button
                    onClick={() => handleRedeem(r)}
                    className="btn-action update-btn"
                    disabled={disabled}
                    style={{
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.5 : 1
                    }}
                  >
                    {agotada
                      ? 'Agotada'
                      : vencida
                      ? 'Vencida'
                      : puedePagar
                      ? 'Canjear'
                      : 'Insuficiente'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
