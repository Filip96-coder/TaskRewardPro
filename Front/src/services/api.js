const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
console.log("BASE_URL =", BASE_URL)

async function http(path, { method = 'GET', data, token } = {}) {

  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`


  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  })
  if (!res.ok) {
    let msg = 'Error en la solicitud'
    try { const j = await res.json(); msg = j.message || msg } catch {}
    throw new Error(msg)
  }
  return res.json()
}

// API real
export async function login(email, password) {
  return http('/api/auth/login', { method: 'POST', data: { email, password } })
}

export async function register(payload) {
  return http('/api/auth/register', { method: 'POST', data: payload })
}

export async function getProfile(token) {
  return http('/api/auth/me', { method: 'GET', token })
}

export async function createTask(payload) {
  const token = localStorage.getItem("token")
  return http("/api/tasks", { method: "POST", data: payload, token })
}

export async function listTasks() {
  const token = localStorage.getItem("token")
  return http("/api/tasks", { method: "GET", token })
}

export async function updateTask(id, data) {
  const token = localStorage.getItem("token")
  return http(`/api/tasks/${id}`, { method: "PUT", data, token })
}

export async function deleteTask(id) {
  const token = localStorage.getItem("token")
  return http(`/api/tasks/${id}`, { method: "DELETE", token })
}