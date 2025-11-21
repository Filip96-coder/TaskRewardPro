import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { getRewards, redeemReward } from '../services/api'; // <--- AQUÍ ESTABA EL ERROR, YA LO CORREGÍ

export default function Rewards() {
  const { user, setUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  async function loadRewards() {
    try {
      const data = await getRewards();
      setRewards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRedeem(reward) {
    if ((user.points || 0) < reward.cost) {
      Swal.fire({
        icon: 'error',
        title: 'Puntos insuficientes',
        text: `Necesitas ${reward.cost} puntos y tienes ${user.points || 0}.`,
        background: "#1E1E2F",
        color: "#fff",
        confirmButtonColor: "#E53E3E"
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Canjear recompensa?',
      text: `Vas a canjear "${reward.title}" por ${reward.cost} puntos.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, canjear',
      cancelButtonText: 'Cancelar',
      background: "#1E1E2F",
      color: "#fff",
      confirmButtonColor: "#00C896",
      cancelButtonColor: "#444"
    });

    if (!result.isConfirmed) return;

    try {
      await redeemReward(reward._id);
      const newPoints = (user.points || 0) - reward.cost;
      setUser({ ...user, points: newPoints });

      Swal.fire({
        icon: 'success',
        title: '¡Canje exitoso!',
        text: 'Disfruta tu recompensa.',
        background: "#1E1E2F",
        color: "#fff",
        confirmButtonColor: "#00C896"
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        background: "#1E1E2F",
        color: "#fff"
      });
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Cargando recompensas...</div>;

  return (
    <div className="container" style={{ maxWidth: 1000 }}>
      <div className="banner" style={{ marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>Tienda de Recompensas</h2>
          <p style={{ margin: '4px 0 0', opacity: 0.8 }}>Canjea tus puntos por beneficios exclusivos</p>
        </div>
        <div className="badge" style={{ fontSize: 16, padding: '8px 16px', background: 'rgba(0,0,0,0.2)' }}>
           Tienes <strong>{user?.points ?? 0}</strong> pts
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {rewards.map(r => {
          const canAfford = (user.points || 0) >= r.cost;
          return (
            <div key={r._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{r.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.4 }}>{r.description}</p>
              </div>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold', color: canAfford ? '#fff' : 'var(--danger)' }}>
                  {r.cost} pts
                </span>
                <button 
                  onClick={() => handleRedeem(r)}
                  className="btn"
                  disabled={!canAfford}
                  style={{ 
                    backgroundColor: canAfford ? 'var(--primary)' : '#2d3748', 
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    padding: '8px 16px',
                    fontSize: 13
                  }}
                >
                  {canAfford ? 'Canjear' : 'Insuficiente'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
