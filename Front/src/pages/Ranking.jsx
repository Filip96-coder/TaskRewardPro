import { useEffect, useState } from "react";
import { getRanking } from "../services/api";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const data = await getRanking();
      setRanking(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar el ranking");
    } finally {
      setLoading(false);
    }
  };

  // Usamos "points" como campo principal, igual que en Rewards.jsx
  const getUserPoints = (user) =>
    user.points ?? user.puntos ?? user.puntosTotales ?? user.totalPoints ?? 0;

  if (loading) return <p>Cargando ranking...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  if (!ranking.length) {
    return (
      <div className="container" style={{ padding: 0 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: 8 }}>🏆 Ranking de usuarios</h3>
          <p style={{ opacity: 0.7 }}>
            Aún no hay usuarios con puntos. ¡Empieza a completar tareas para aparecer aquí!
          </p>
        </div>
      </div>
    );
  }

  const top3 = ranking.slice(0, 3);

  return (
    <div className="container" style={{ padding: 0 }}>
      {/* Cabecera */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 4 }}>🏆 Ranking de usuarios</h3>
        <p style={{ opacity: 0.7, fontSize: 14 }}>
          Usuarios ordenados por sus puntos acumulados en la plataforma.
        </p>
      </div>

      {/* Top 3 (estilo tarjetas, coherente con el resto del proyecto) */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Top 3</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {top3.map((user, index) => {
            const points = getUserPoints(user);
            const bgColor =
              index === 0
                ? "#FFE08A"
                : index === 1
                ? "#E2E8F0"
                : "#FBD38D";

            return (
              <div
                key={user._id || index}
                style={{
                  flex: "1 1 220px",
                  minWidth: 220,
                  padding: 12,
                  borderRadius: 12,
                  background: bgColor,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>
                  {index === 0 ? "👑" : "⭐"}
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nombre}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#4C51BF",
                        fontSize: 20,
                      }}
                    >
                      {user.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
                    </span>
                  )}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      opacity: 0.7,
                    }}
                  >
                    #{index + 1} lugar
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {user.nombre || "Usuario"}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{user.email}</div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(0,200,150,0.12)",
                      color: "#059669",
                      display: "inline-block",
                    }}
                  >
                    {points} pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista completa (similar a Rewards.jsx usando listItem) */}
      <div className="card">
        <h3 style={{ marginBottom: 8 }}>Ranking completo</h3>
        <div style={{ marginBottom: 8, opacity: 0.7, fontSize: 13 }}>
          Total participantes: <strong>{ranking.length}</strong>
        </div>

        {ranking.map((user, index) => {
          const points = getUserPoints(user);
          const isTop = index < 3;

          return (
            <div
              key={user._id || index}
              className="listItem"
              style={{
                borderLeft: isTop ? "4px solid #ECC94B" : "4px solid transparent",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#4C51BF",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    fontWeight: 600,
                  }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nombre}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    (user.nombre ? user.nombre.charAt(0).toUpperCase() : "U")
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {user.nombre || "Usuario"}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{user.email}</div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  #{index + 1}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "#E6FFFA",
                    color: "#047857",
                    display: "inline-block",
                  }}
                >
                  {points} puntos
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
