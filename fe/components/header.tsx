'use client'

import { useState } from 'react'
import { Sun, Moon, Search, User, Settings, LogOut } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface HeaderProps {
  userName: string
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export default function Header({
  userName,
  isDarkMode,
  onToggleDarkMode,
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Spendio</h1>
        <p className="text-sm text-muted-foreground">
          Smarter money · Better life
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-2">
          {isDarkMode ? (
            <Moon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Sun className="h-4 w-4 text-muted-foreground" />
          )}
          <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted transition"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">Pro Account</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
              <button className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-muted">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-muted">
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button className="flex w-full items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-muted">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
