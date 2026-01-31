'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
}

interface AnalyticsProps {
  transactions: Transaction[];
  fullView?: boolean;
}

export default function Analytics({ transactions }: AnalyticsProps) {
  const { expensePieData, incomeBarData } = useMemo(() => {
    const expense: Record<string, number> = {}
    const income: Record<string, number> = {}

    transactions.forEach((t) => {
      if (t.type === 'expense') {
        expense[t.category] = (expense[t.category] || 0) + t.amount
      } else {
        income[t.category] = (income[t.category] || 0) + t.amount
      }
    })

    return {
      expensePieData: Object.entries(expense).map(([name, value]) => ({
        name,
        value,
      })),
      incomeBarData: Object.entries(income).map(([name, value]) => ({
        name,
        Income: value,
      })),
    }
  }, [transactions])

  const COLORS = [
    '#c7d2fe',
    '#bae6fd',
    '#bbf7d0',
    '#fed7aa',
    '#fbcfe8',
    '#fde68a',
  ]

  if (!expensePieData.length && !incomeBarData.length) {
    return (
      <p className="text-center text-muted-foreground">
        No analytics data yet
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Analytics Overview
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* EXPENSE PIE */}
        <Card className="p-4">
          <p className="mb-2 font-medium text-foreground">Expenses</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={expensePieData}
                dataKey="value"
                outerRadius={80}
                label
              >
                {expensePieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* INCOME BAR */}
        <Card className="p-4">
          <p className="mb-2 font-medium text-foreground">Income</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={incomeBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
              <Bar dataKey="Income" fill="#bbf7d0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* SUMMARY */}
        <Card className="p-4">
          <p className="mb-3 font-medium text-foreground">
            Expense Summary
          </p>
          <div className="space-y-3">
            {expensePieData.map((item, i) => (
              <div key={item.name} className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {item.name}
                </span>
                <span className="font-medium">
                  ${item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
