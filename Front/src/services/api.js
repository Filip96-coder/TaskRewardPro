const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
console.log("BASE_URL =", BASE_URL)
export const API_BASE = BASE_URL;

async function http(path, { method = "GET", data, token } = {}) {
  const headers = {}

  if (!(data instanceof FormData)) headers["Content-Type"] = "application/json"
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: data
      ? (data instanceof FormData ? data : JSON.stringify(data))
      : undefined
  })

  if (!res.ok) {
    let msg = "Error en la solicitud"
    try {
      const j = await res.json()
      msg = j.message || msg
    } catch {}
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
  const res = await fetch(`${API_BASE}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function updateTask(id, data) {
  const token = localStorage.getItem("token")
  return http(`/api/tasks/${id}`, { method: "PUT", data, token })
}

export async function deleteTask(id) {
  const token = localStorage.getItem("token")
  return http(`/api/tasks/${id}`, { method: "DELETE", token })
}

export async function submitTaskFile(taskId, file) {
  const token = localStorage.getItem("token")
  const fd = new FormData()
  fd.append("file", file)
  return http(`/api/tasks/${taskId}/submit`, { method: "POST", data: fd, token })
}

export async function listUserTasks() {
  const token = localStorage.getItem("token")
  return http(`/api/tasks/user/list`, { method: "GET", token })
}

export async function listTaskSubmissions(taskId) {
  const token = localStorage.getItem("token")
  return http(`/api/tasks/${taskId}/submissions`, { method: "GET", token })
}

export async function decideSubmission(taskId, subId, action, feedback = "") {
  const token = localStorage.getItem("token")
  return http(`/api/tasks/${taskId}/submission/${subId}/decision`, {
    method: "PATCH",
    data: { action, feedback },
    token
  })
}

export async function completeTask(id) {
  const token = localStorage.getItem("token")
  return http(`/api/tasks/${id}`, {
    method: "PUT",
    data: { status: "Completada" },
    token,
  })
}

export async function claimPoints(taskId) {
  const token = localStorage.getItem("token")
  return http(`/api/tasks/${taskId}/claim`, { method: "POST", token })
}


// SECCIÓN DE RECOMPENSAS (MOCKS)


const MOCK_REWARDS = [
  { _id: '1', title: 'Día de teletrabajo', cost: 100, description: 'Trabaja desde casa un día a elección.' },
  { _id: '2', title: 'Salida anticipada', cost: 50, description: 'Sal 2 horas antes el viernes.' },
  { _id: '3', title: 'Almuerzo gratis', cost: 75, description: 'Bono para almuerzo en cafetería.' },
  { _id: '4', title: 'Kit de escritorio', cost: 200, description: 'Cuaderno, lapicera premium y mousepad.' },
];

export async function getRewards() {
  // Aquí se simula una carga de 500 puntos.
  return new Promise(resolve => setTimeout(() => resolve(MOCK_REWARDS), 500));
  
}

export async function redeemReward(rewardId) {
  // Aquí se simula un canje exitoso de los puntos.
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 800));

}



