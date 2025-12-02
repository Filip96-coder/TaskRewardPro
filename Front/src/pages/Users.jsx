import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext.jsx";
import { listUsers, updateUser } from "../services/api.js";

export default function Users() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!user || loading) return;
    if (user.rol !== "Admin") return;
    loadUsers();
  }, [user, loading]);

  async function loadUsers() {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los usuarios",
        background: "#1E1E2F",
        color: "#fff",
        confirmButtonColor: "#E53E3E"
      });
    } finally {
      setLoadingUsers(false);
    }
  }

  async function handleEditUser(u) {
    const { value: formValues } = await Swal.fire({
      title: "Editar usuario",
      html: `
        <input id="name" class="swal2-input" placeholder="Nombre" value="${u.name || ""}">
        <input id="points" type="number" min="0" class="swal2-input" placeholder="Puntos" value="${u.points || 0}">
        <select id="rol" class="swal2-input">
          <option value="Trabajador" ${u.rol === "Trabajador" ? "selected" : ""}>Trabajador</option>
          <option value="Admin" ${u.rol === "Admin" ? "selected" : ""}>Admin</option>
        </select>
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
        const name = document.getElementById("name").value.trim();
        const points = parseInt(document.getElementById("points").value, 10);
        const rol = document.getElementById("rol").value;
        if (!name || isNaN(points)) {
          Swal.showValidationMessage("Completa todos los campos correctamente");
          return;
        }
        return { name, points, rol };
      }
    });

    if (!formValues) return;

    try {
      const updated = await updateUser(u._id, formValues);
      setUsers(prev => prev.map(x => (x._id === updated._id ? updated : x)));
      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        background: "#1E1E2F",
        color: "#00C896",
        confirmButtonColor: "#00C896"
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el usuario",
        background: "#1E1E2F",
        color: "#fff",
        confirmButtonColor: "#E53E3E"
      });
    }
  }

  if (loading || !user) return <p style={{ padding: 24 }}>Cargando...</p>;

  if (user.rol !== "Admin") {
    return (
      <div className="card">
        <p style={{ opacity: 0.7 }}>Solo los administradores pueden ver esta sección.</p>
      </div>
    );
  }

  if (loadingUsers) return <p style={{ padding: 24 }}>Cargando usuarios...</p>;

  return (
    <div className="card">
      <h3>Gestión de Usuarios</h3>
      <div style={{ marginBottom: 12, opacity: 0.8 }}>
        Total de usuarios: <strong>{users.length}</strong>
      </div>
      {!users.length && (
        <div style={{ opacity: 0.7 }}>No hay usuarios registrados.</div>
      )}
      {users.map(u => (
        <div key={u._id} className="listItem">
          <div>
            <div style={{ fontWeight: 600 }}>{u.name || u.email}</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{u.email}</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
              Rol: <strong>{u.rol}</strong> · Puntos: <strong>{u.points ?? 0}</strong>
              {u.createdAt && ` · Registrado: ${new Date(u.createdAt).toLocaleDateString("es-CO")}`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => handleEditUser(u)}
              className="btn-action update-btn"
            >
              Editar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
