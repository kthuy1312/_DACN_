'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  CreditCard,
  Calendar,
  LineChart,
  Tags,
  Sparkles,
  Settings,
  PanelLeft,
  LogOut,
} from 'lucide-react'

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  onLogout: () => void
}

const sidebarButtonClass = `
  w-full
  flex items-center gap-3
  px-3 py-2
  rounded-md
  text-sm
  text-muted-foreground
  hover:bg-muted
  hover:text-foreground
  transition
`

export default function Sidebar({
  activeView,
  onViewChange,
  onLogout,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside
      className={`h-screen border-r bg-background flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-4 border-b">
        <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
          S
        </div>
        {!isCollapsed && (
          <div>
            <p className="font-semibold leading-none">Spendio</p>
            <span className="text-xs text-muted-foreground">
              Smart Finance
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`${sidebarButtonClass} ${isActive
                ? 'bg-muted text-foreground'
                : ''
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t space-y-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={sidebarButtonClass}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <PanelLeft className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Collapse</span>}
        </button>

        <button
          onClick={onLogout}
          className={`${sidebarButtonClass} text-destructive hover:text-destructive`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
