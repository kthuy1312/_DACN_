'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Pencil, Trash2 } from 'lucide-react'
import { DatePicker, Input, InputNumber, Popconfirm } from 'antd'
import Icon from '@/lib/icon'
import { UpdateTransactionPayload } from './dashboard'
import { Category } from '@/types/app'
import { Select } from "antd"
import dayjs from 'dayjs'

export interface Transaction {
  _id: string
  userId: string
  categoryId: string
  categoryName: string
  categoryIcon?: string
  type: 'income' | 'expense'
  amount: number
  description?: string
  createdAt: string
}

interface Props {
  transactions: Transaction[]
  categories: Category[]

  onDelete: (id: string) => void
  onEdit?: (id: string, updates: UpdateTransactionPayload) => void
}

export default function TransactionList({
  transactions,
  categories,
  onDelete,
  onEdit,
}: Props) {

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<UpdateTransactionPayload>({})

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')



  //FILTER 
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {

      if (search && !t.description?.toLowerCase().includes(search.toLowerCase()))
        return false

      if (typeFilter !== 'all' && t.type !== typeFilter)
        return false

      return true
    })
  }, [transactions, search, typeFilter])

  //phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1)
    }
  }, [filteredTransactions])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleSaveEdit = (id: string) => {
    onEdit?.(id, editData)
    setEditingId(null)
    setEditData({})
  }

  if (transactions.length === 0) {
    return (
      <Card className="border border-border bg-muted/30">
        <div className="p-10 text-center">
          <p className="text-lg font-medium">No transactions yet</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border border-border bg-card rounded-2xl shadow-sm">

      {/* FILTER BAR  */}
      <div className="px-6 py-5 border-b border-border bg-card/60 backdrop-blur-sm">

        <div className="flex flex-col md:flex-row md:items-center gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
          w-full
          pl-4 pr-5 py-2.5
          rounded-2xl
          border border-border
          bg-background
          text-sm
          shadow-sm
          focus:outline-none
          focus:ring-2 focus:ring-primary/40
          transition-all
        "
            />
          </div>

          {/* Type */}
          <div className="flex items-center gap-3">

            <Select
              value={typeFilter}
              onChange={(value) => setTypeFilter(value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
              ]}
              className="min-w-[180px]"
              popupMatchSelectWidth={false}
              placement="bottomLeft"
            />

          </div>

        </div>

      </div>


      {/* LIST */}
      <div className="divide-y divide-border">

        {paginatedTransactions.map((t) => (
          <div
            key={t._id}
            className="
              px-6 py-5
              group
              transition-all
              duration-200
              hover:bg-muted/40
            "
          >
            {editingId === t._id ? (

              <div className="space-y-5">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Description
                    </label>
                    <Input
                      size="large"
                      value={editData.description ?? t.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Amount
                    </label>
                    <InputNumber
                      size="large"
                      className="w-full"
                      value={editData.amount ?? t.amount}
                      onChange={(value) =>
                        setEditData({ ...editData, amount: Number(value) })
                      }
                      placeholder="Enter amount"
                    />
                  </div>

                </div>

                {/* Type - Date - Category */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Type
                    </label>
                    <Select
                      size="large"
                      value={editData.type ?? t.type}
                      onChange={(value) =>
                        setEditData({ ...editData, type: value })
                      }
                      options={[
                        { value: 'income', label: 'Income' },
                        { value: 'expense', label: 'Expense' },
                      ]}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Date
                    </label>
                    <DatePicker
                      size="large"
                      className="w-full"
                      value={dayjs(editData.date ?? t.createdAt)}
                      onChange={(date) =>
                        setEditData({
                          ...editData,
                          date: date ? date.format("YYYY-MM-DD") : undefined,
                        })
                      }
                      placement="bottomLeft"
                      getPopupContainer={(trigger) => trigger.parentElement!}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Category
                    </label>
                    <Select
                      size="large"
                      value={editData.categoryId ?? t.categoryId}
                      onChange={(value) =>
                        setEditData({ ...editData, categoryId: value })
                      }
                      options={categories.map((c) => ({
                        value: c._id,
                        label: (
                          <div className="flex items-center gap-2">
                            <Icon name={c.icon} />
                            <span>{c.name}</span>
                          </div>
                        ),
                      }))}
                    />
                  </div>

                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSaveEdit(t._id)}
                    className="flex-1 bg-primary text-white! py-2 rounded-xl text-sm font-medium hover:opacity-90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-muted py-2 rounded-xl text-sm hover:bg-muted/70"
                  >
                    Cancel
                  </button>
                </div>

              </div>


            ) : (

              <div className="flex items-center justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                    <Icon name={t.categoryIcon} />
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      {t.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t.categoryName} • {formatDate(t.createdAt)}
                    </p>
                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                  <p
                    className={`text-base font-semibold ${t.type === 'income'
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                      }`}
                  >
                    {t.type === 'income' ? '+' : '-'}$
                    {t.amount.toFixed(2)}
                  </p>

                  <button
                    onClick={() => {
                      setEditingId(t._id)
                      setEditData({
                        amount: t.amount,
                        description: t.description,
                        type: t.type,
                        categoryId: t.categoryId,
                        date: t.createdAt.slice(0, 10),
                      })
                    }}
                    className="
                      opacity-0 group-hover:opacity-100
                      transition
                      p-2 rounded-lg
                      hover:bg-muted
                    "
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <Popconfirm
                    title="Delete transaction"
                    description="Are you sure you want to delete?"
                    onConfirm={() => onDelete(t._id)}
                    placement="bottomLeft"
                  >
                    <button
                      className="
                        opacity-0 group-hover:opacity-100
                        transition
                        p-2 rounded-lg
                        text-rose-500
                        hover:bg-rose-500/10
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Popconfirm>

                </div>

              </div>

            )}
          </div>
        ))}

        {/*  PAGINATION  */}
        <div className="flex justify-center items-center gap-6 py-6 bg-muted/30">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="
              px-4 py-2
              rounded-lg
              border border-border
              bg-card
              text-sm
              hover:bg-muted
              disabled:opacity-40
            "
          >
            Prev
          </button>

          <div className="px-4 py-2 bg-card border border-border rounded-lg text-sm">
            Page {currentPage} / {totalPages || 1}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="
              px-4 py-2
              rounded-lg
              border border-border
              bg-card
              text-sm
              hover:bg-muted
              disabled:opacity-40
            "
          >
            Next
          </button>

        </div>

      </div>
    </Card>
  )
}
