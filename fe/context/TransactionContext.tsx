'use client'

import { UpdateTransactionPayload } from '@/components/dashboard'
import { API_URL } from '@/lib/api'
import { createContext, useContext, useEffect, useState } from 'react'

export type LucideIconName = string
export type DateString = string

export interface Transaction {
    _id: string
    userId: string

    categoryId: string
    categoryName: string
    categoryIcon?: LucideIconName

    type: "income" | "expense"
    amount: number
    description?: string

    createdAt: DateString
}

export interface Category {
    _id: string
    name: string
    icon: LucideIconName
}


interface TransactionContextType {
    categories: Category[]
    transactions: Transaction[]
    loading: boolean

    getAllCategories: () => Promise<{ success: boolean; message?: string, categories?: Category[] }>
    getTransactions: () => Promise<{ success: boolean; message?: string, transactions?: Transaction[] }>

    addTransaction: (payload: {
        amount: number
        type: "income" | "expense"
        categoryId: string
        description: string
    }) => Promise<{
        success: boolean
        message?: string
        transaction?: Transaction
    }>

    updateTransaction: (
        transactionId: string,
        updates: UpdateTransactionPayload
    ) => Promise<{ success: boolean; message?: string }>

    deleteTransaction: (transactionId: string) => Promise<{
        success: boolean
        message?: string
    }>
}

const TransactionContext = createContext<TransactionContextType | undefined>(
    undefined
)

export const TransactionProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false)


    const getAllCategories = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")

            const res = await fetch(`${API_URL}/api/categories`, {
                method: "GET",
                headers:
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }

            })

            const data = await res.json()

            if (!res.ok) {
                return { success: false, message: data.message || "Get all categories failed" }
            }

            setCategories(data.categories)
            return { success: true, categories: data.categories }

        } catch (err) {
            console.error("GET CATEGORIES ERROR:", err)
            return { success: false, message: "Server error" }
        } finally {
            setLoading(false)
        }
    }

    const getTransactions = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")

            const res = await fetch(`${API_URL}/api/transactions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await res.json()

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Get transactions failed",
                }
            }

            setTransactions(data.transaction)

            return {
                success: true,
                transactions: data.transaction,
            }
        } catch (err) {
            console.error("GET TRANSACTIONS ERROR:", err)
            return {
                success: false,
                message: "Server error",
            }
        } finally {
            setLoading(false)
        }
    }

    const addTransaction = async (payload: {
        amount: number
        type: "income" | "expense"
        categoryId: string
        description: string
    }) => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")

            const res = await fetch(`${API_URL}/api/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (!res.ok) {
                return { success: false, message: data.message }
            }

            //thêm transaction mới vào state
            setTransactions(prev => [data.transaction, ...prev])

            return { success: true, transaction: data.transaction }

        } catch (err) {
            console.error("ADD TRANSACTION ERROR:", err)
            return { success: false, message: "Server error" }
        } finally {
            setLoading(false)
        }
    }

    const updateTransaction = async (
        transactionId: string,
        updates: Partial<{
            amount: number
            type: "income" | "expense"
            categoryId: string
            description: string
            date: string
        }>
    ) => {

        try {
            setLoading(true)
            const token = localStorage.getItem("token")

            const res = await fetch(
                `${API_URL}/api/transactions/${transactionId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updates),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                return { success: false, message: data.message }
            }


            return { success: true }
        } catch (err) {
            console.error("UPDATE TRANSACTION ERROR:", err)
            return { success: false, message: "Server error" }
        } finally {
            setLoading(false)
        }
    }


    const deleteTransaction = async (transactionId: string) => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")

            const res = await fetch(
                `${API_URL}/api/transactions/${transactionId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await res.json()

            if (!res.ok) {
                return { success: false, message: data.message }
            }

            setTransactions(prev =>
                prev.filter(t => t._id !== transactionId)
            )

            return { success: true }
        } catch (err) {
            console.error("DELETE TRANSACTION ERROR:", err)
            return { success: false, message: "Server error" }
        } finally {
            setLoading(false)
        }
    }

    return (
        <TransactionContext.Provider
            value={{
                categories,
                transactions,
                loading,
                getAllCategories,
                getTransactions,
                addTransaction,
                updateTransaction,
                deleteTransaction,
            }}
        >

            {children}
        </TransactionContext.Provider>
    )
}

export const useTransactions = () => {
    const ctx = useContext(TransactionContext)
    if (!ctx)
        throw new Error('useTransactions must be used within TransactionProvider')
    return ctx
}
