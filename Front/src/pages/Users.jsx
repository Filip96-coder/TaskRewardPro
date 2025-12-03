import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext.jsx";
import { listUsers, updateUser, createUser } from "../services/api.js";

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

  // --- ESTILOS CSS EN JAVASCRIPT PARA LOS FORMULARIOS ---
  const inputStyle = `
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    background: #2a3b55;
    border: 1px solid #3f4b5b;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
  `;

  const labelStyle = `
    display: block;
    text-align: left;
    margin-bottom: 5px;
    font-size: 13px;
    color: #bbb;
    font-weight: 500;
  `;

  async function handleCreateUser() {
    const { value: formValues } = await Swal.fire({
      title: '<h3 style="color:#fff; margin:0 0 20px 0;">Crear Nuevo Usuario</h3>',
      html: `
        <div style="text-align: left; padding: 0 10px;">
          
          <label style="${labelStyle}">Nombre completo</label>
          <input id="newName" style="${inputStyle}" placeholder="Ej: Juan Pérez">

          <label style="${labelStyle}">Correo electrónico</label>
          <input id="newEmail" type="email" style="${inputStyle}" placeholder="usuario@empresa.com">

          <label style="${labelStyle}">Contraseña</label>
          <input id="newPassword" type="password" style="${inputStyle}" placeholder="Mínimo 6 caracteres">

          <label style="${labelStyle}">Rol de usuario</label>
          <select id="newRol" style="${inputStyle} cursor: pointer;">
            <option value="Trabajador">Trabajador</option>
            <option value="Admin">Administrador</option>
          </select>

        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear usuario",
      cancelButtonText: "Cancelar",
      background: "#1E1E2F",
      color: "#FFFFFF",
      confirmButtonColor: "#00C896",
      cancelButtonColor: "#E53E3E",
      customClass: {
        popup: 'animated fadeInDown' // Opcional: animación suave si te gusta
      },
      preConfirm: () => {
        const name = document.getElementById("newName").value.trim();
        const email = document.getElementById("newEmail").value.trim();
        const password = document.getElementById("newPassword").value;
        const rol = document.getElementById("newRol").value;

        if (!name || !email || !password) {
          Swal.showValidationMessage("Por favor, completa todos los campos.");
          return;
        }
        if (password.length < 6) {
          Swal.showValidationMessage("La contraseña es muy corta (mínimo 6).");
          return;
        }
        return { name, email, password, rol };
      }
    });

    if (!formValues) return;

    try {
      const newUser = await createUser(formValues);
      setUsers(prev => [newUser, ...prev]);

      Swal.fire({
        icon: "success",
        title: "¡Usuario Creado!",
        text: `Se ha registrado a ${formValues.name} correctamente.`,
        background: "#1E1E2F",
        color: "#fff",
        confirmButtonColor: "#00C896"
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Hubo un problema",
        text: err.message || "No se pudo crear el usuario.",
        background: "#1E1E2F",
        color: "#fff",
        confirmButtonColor: "#E53E3E"
      });
    }
  }

  async function handleEditUser(u) {
    const { value: formValues } = await Swal.fire({
      title: '<h3 style="color:#fff; margin-bottom:20px;">Editar Usuario</h3>',
      html: `
        <div style="text-align: left; padding: 0 10px;">
          <label style="${labelStyle}">Nombre</label>
          <input id="name" style="${inputStyle}" value="${u.name || ""}">
          
          <label style="${labelStyle}">Puntos Acumulados</label>
          <input id="points" type="number" min="0" style="${inputStyle}" value="${u.points || 0}">
          
          <label style="${labelStyle}">Rol</label>
          <select id="rol" style="${inputStyle}">
            <option value="Trabajador" ${u.rol === "Trabajador" ? "selected" : ""}>Trabajador</option>
            <option value="Admin" ${u.rol === "Admin" ? "selected" : ""}>Admin</option>
          </select>
        </div>
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
        title: "Actualizado",
        background: "#1E1E2F",
        color: "#fff",
        confirmButtonColor: "#00C896",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar",
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3>Gestión de Usuarios</h3>
        <button onClick={handleCreateUser} className="btn">
          + Crear Usuario
        </button>
      </div>

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
