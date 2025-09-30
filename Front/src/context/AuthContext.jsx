import React, { createContext, useContext, useEffect, useState } from "react"
import { login as apiLogin, register as apiRegister, getProfile } from "../services/api.js"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    async function boot() {
      if (!token) { setLoading(false); return }
      try {
        const me = await getProfile(token)
        setUser(me)
      } catch (e) {
        console.warn("Token inválido o expirado", e)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }
    boot()
  }, [])

  async function login(email, password) {
    const { token, user } = await apiLogin(email, password)
    localStorage.setItem("token", token)
    setUser(user)
    return user
  }

  async function register(data) {
    const { token, user } = await apiRegister(data)
    localStorage.setItem("token", token)
    setUser(user)
    return user
  }

  function logout() {
    localStorage.removeItem("token")
    setUser(null)
  }

  const value = { user, loading, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}



export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
