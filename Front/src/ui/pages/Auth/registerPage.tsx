import React, { useState } from 'react';

const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [cargo, setCargo] = useState('');
  const [area, setArea] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuario = {
      nombre,
      email,
      password,
      rol,
      cargo: rol === 'trabajador' ? cargo : undefined,
      area: rol === 'lider' ? area : undefined,
    };

    const response = await fetch('http://localhost:4000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });
    if (response.ok) {
      alert('Usuario creado correctamente');
      setNombre('');
      setEmail('');
      setPassword('');
      setRol('');
      setCargo('');
      setArea('');
    } else {
      alert('Error al crear usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <select
        value={rol}
        onChange={e => setRol(e.target.value)}
        required
      >
        <option value="">Selecciona un rol</option>
        <option value="Admin">Admin</option>
        <option value="Lider">Líder</option>
        <option value="Trabajador">Trabajador</option>
      </select>
      {rol === 'Trabajador' && (
        <input
          type="text"
          placeholder="Cargo"
          value={cargo}
          onChange={e => setCargo(e.target.value)}
          required
        />
      )}
      {rol === 'Lider' && (
        <input
          type="text"
          placeholder="Área"
          value={area}
          onChange={e => setArea(e.target.value)}
          required
        />
      )}
      <button type="submit">Registrar</button>
    </form>
  );
};

export default RegisterPage;