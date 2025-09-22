const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === '1'

async function http(path, { method = 'GET', data, token } = {}) {
  if (USE_MOCK) return mockHttp(path, { method, data, token })

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

// ---------------- MOCK mode (sin backend) ---------------- //
function delay(ms){ return new Promise(r=>setTimeout(r, ms)) }
const mockDBKey = 'trp_mock_users'

async function mockHttp(path, { method, data, token }){
  await delay(400)
  const db = JSON.parse(localStorage.getItem(mockDBKey) || '[]')

  if (path === '/api/auth/register' && method === 'POST') {
    const exists = db.find(u => u.email === data.email)
    if (exists) throw new Error('El email ya está registrado')
    const user = { id: crypto.randomUUID(), name: data.name || '', email: data.email }
    db.push({ ...user, password: data.password })
    localStorage.setItem(mockDBKey, JSON.stringify(db))
    return { token: 'mock.' + user.id, user }
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const user = db.find(u => u.email === data.email && u.password === data.password)
    if (!user) throw new Error('Credenciales inválidas')
    const { password, ...safe } = user
    return { token: 'mock.' + user.id, user: safe }
  }

  if (path === '/api/auth/me' && method === 'GET') {
    if (!token?.startsWith('mock.')) throw new Error('Token inválido')
    const id = token.split('.')[1]
    const user = db.find(u => u.id === id)
    if (!user) throw new Error('Usuario no encontrado')
    const { password, ...safe } = user
    return safe
  }

  throw new Error('Ruta mock no implementada: ' + path)
}
