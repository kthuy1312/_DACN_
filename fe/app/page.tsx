'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/header'
import Sidebar from '@/components/sidebar'
import Dashboard from '@/components/dashboard'
import AuthModal from '@/components/auth-modal'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { isAuthenticated, user, logout, loading } = useAuth()

  const [activeView, setActiveView] = useState('dashboard')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(savedDarkMode)
    document.documentElement.classList.toggle('dark', savedDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const next = !isDarkMode
    setIsDarkMode(next)
    localStorage.setItem('darkMode', String(next))
    document.documentElement.classList.toggle('dark', next)
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <AuthModal />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col">
        <Header
          userName={user?.name ?? 'User'}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <Dashboard activeView={activeView} user={user} />
      </div>
    </div>
  )
}
