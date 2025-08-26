//approval_flow_frontend/components/auth-provider.tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loginUser, getProfile } from "@/lib/api"
import { useRouter } from "next/navigation"

interface User {
  id_usuario: number
  nombre: string
  email: string
  username: string
  rol: {
    id_rol: number
    nombre: string
  }
}

// Se ha eliminado la interfaz 'Notification'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Se ha eliminado el estado 'notifications'
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const profile = await getProfile()
          setUser(profile)
        } catch (error) {
          console.error("Failed to fetch profile, logging out.", error)
          logout()
        }
      }
      setIsLoading(false)
    }
    checkUser()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginUser({ username, password })
      if (response.access_token) {
        localStorage.setItem("token", response.access_token)
        const profile = await getProfile()
        setUser(profile)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    router.push("/login")
  }

  // Se han eliminado las funciones 'markNotificationAsRead' y 'addNotification'

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated,
        // Se han eliminado las propiedades de notificación del valor del contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}