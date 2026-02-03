'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/lib/api'

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    loading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
    logout: () => void
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    //restore login khi reload
    useEffect(() => {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (res.status === 401 || res.status === 404) {
                return { success: false, message: "Incorrect email or password" }
            }

            if (!res.ok) {
                return { success: false, message: data.message || "Login failed" }
            }

            const userData = {
                id: data._id,
                name: data.name,
                email: data.email,
            }

            setUser(userData)
            setIsAuthenticated(true)

            localStorage.setItem("user", JSON.stringify(userData))
            localStorage.setItem("token", data.token)

            return { success: true }
        } catch (err) {
            console.error("LOGIN ERROR:", err)
            return { success: false, message: "Server error" }
        }
    }




    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        router.push('/')
    }

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
