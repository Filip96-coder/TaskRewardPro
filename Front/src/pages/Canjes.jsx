import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { listCanjes } from "../services/api.js";

export default function Canjes() {
  const { user, loading } = useAuth();
  const [canjes, setCanjes] = useState([]);
  const [loadingCanjes, setLoadingCanjes] = useState(true);

  useEffect(() => {
    if (!user || loading) return;
    loadCanjes();
  }, [user, loading]);

  async function loadCanjes() {
    try {
      const data = await listCanjes();
      setCanjes(data);
    } catch (err) {
      console.error("Error cargando canjes:", err);
    } finally {
      setLoadingCanjes(false);
    }
  }

  if (loading || !user) return <p style={{ padding: 24 }}>Cargando...</p>;
  if (loadingCanjes) return <p style={{ padding: 24 }}>Cargando historial de canjes...</p>;

  return (
    <div className="card">
      <h3>Historial de Canjes</h3>
      <div style={{ marginBottom: 12, opacity: 0.8 }}>
        {user.rol === "Admin" 
          ? `Total de canjes en el sistema: ${canjes.length}`
          : `Tus canjes: ${canjes.length}`
        }
      </div>
      {!canjes.length && (
        <div style={{ opacity: 0.7 }}>
          {user.rol === "Admin" 
            ? "Aún no hay canjes registrados en el sistema."
            : "Aún no has canjeado ninguna recompensa."
          }
        </div>
      )}
      {canjes.map(c => (
        <div key={c._id} className="listItem">
          <div>
            <div style={{ fontWeight: 600 }}>
              {c.reward?.nombre || "Recompensa eliminada"}
            </div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              {new Date(c.fecha).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
              {user.rol === "Admin" && (
                <>Usuario: {c.user?.name || c.user?.email || "N/A"} · </>
              )}
              Puntos canjeados: <strong>{c.puntosCanjeados || c.reward?.puntosRequeridos || 0}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
