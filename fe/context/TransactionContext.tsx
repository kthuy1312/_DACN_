'use client'

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


    return (
        <TransactionContext.Provider
            value={{
                categories,
                transactions,
                loading,
                getAllCategories,
                getTransactions
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
