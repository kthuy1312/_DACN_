'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Pencil, Trash2 } from 'lucide-react'
import {
  Utensils,
  Car,
  Film,
  Lightbulb,
  HeartPulse,
  ShoppingBag,
  Wallet,
  Briefcase,
  Laptop,
  Tag,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
  onEdit?: (id: string, updates: Partial<Transaction>) => void
}

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Transaction>>({})

  const getCategoryIcon = (category: string): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
      Food: <Utensils className="w-5 h-5 text-muted-foreground" />,
      Transportation: <Car className="w-5 h-5 text-muted-foreground" />,
      Entertainment: <Film className="w-5 h-5 text-muted-foreground" />,
      Utilities: <Lightbulb className="w-5 h-5 text-muted-foreground" />,
      Healthcare: <HeartPulse className="w-5 h-5 text-muted-foreground" />,
      Shopping: <ShoppingBag className="w-5 h-5 text-muted-foreground" />,
      Income: <Wallet className="w-5 h-5 text-emerald-500" />,
      Salary: <Briefcase className="w-5 h-5 text-emerald-500" />,
      Freelance: <Laptop className="w-5 h-5 text-emerald-500" />,
      Other: <Tag className="w-5 h-5 text-muted-foreground" />,
    }

    return iconMap[category] ?? (
      <Tag className="w-5 h-5 text-muted-foreground" />
    )
  }


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (transactions.length === 0) {
    return (
      <Card className="border border-border bg-muted/30">
        <div className="p-8 text-center">
          <p className="text-lg font-medium text-foreground">
            No transactions yet
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Start adding transactions to track your finances
          </p>
        </div>
      </Card>
    )
  }

  const handleSaveEdit = (id: string) => {
    onEdit?.(id, editData)
    setEditingId(null)
    setEditData({})
  }

  return (
    <Card className="border border-border bg-card">
      <div className="divide-y divide-border">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="p-4 group transition-colors hover:bg-muted/50"
          >
            {editingId === t.id ? (
              <div className="space-y-3">
                <input
                  value={editData.description ?? t.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                />

                <input
                  type="number"
                  value={editData.amount ?? t.amount}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      amount: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                />

                <input
                  type="date"
                  value={editData.date ?? t.date}
                  onChange={(e) =>
                    setEditData({ ...editData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(t.id)}
                    className="flex-1 rounded-md bg-indigo-500 text-white py-2 text-sm font-medium hover:bg-indigo-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setEditData({})
                    }}
                    className="flex-1 rounded-md bg-muted py-2 text-sm hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-xl">
                    {getCategoryIcon(t.category)}
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      {t.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t.category} • {formatDate(t.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold ${t.type === 'income'
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                      }`}
                  >
                    {t.type === 'income' ? '+' : '-'}$
                    {t.amount.toFixed(2)}
                  </p>

                  <button
                    onClick={() => {
                      setEditingId(t.id)
                      setEditData(t)
                    }}
                    className="
                      opacity-0 group-hover:opacity-100
                      transition
                      p-2 rounded-md
                      text-muted-foreground
                      hover:text-foreground
                      hover:bg-muted
                    "
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDelete(t.id)}
                    className="
                      opacity-0 group-hover:opacity-100
                      transition
                      p-2 rounded-md
                      text-rose-500
                      hover:bg-rose-500/10
                    "
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
