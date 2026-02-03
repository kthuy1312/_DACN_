
export type ID = string
export type DateString = string // ISO string từ MongoDB


//USER
export interface User {
    _id: ID
    email: string
    name?: string
    avatar?: string
    createdAt: DateString
    updatedAt: DateString
}

// User → nhiều Category
// User → nhiều Transaction
// User → nhiều Budget, Subscription, SavingGoal, AIInsight

//AUTH
export interface AuthResponse {
    user: User
    accessToken: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload extends LoginPayload {
    name?: string
}

//CATEGORY
export type LucideIconName = string

export type CategoryType = 'income' | 'expense'

export interface Category {
    _id: ID
    userId: ID //chủ sở hữu
    name: string
    icon: LucideIconName //tên icon Lucide
    type: CategoryType
    isDefault: boolean
    createdAt: DateString
}

// Category → nhiều Transaction
// Category → nhiều Budget
// Category → nhiều Subscription

//TRANSACTION
export interface Transaction {
    _id: ID
    userId: ID

    categoryId: ID
    categoryName: string // snapshot
    categoryIcon?: LucideIconName

    type: CategoryType
    amount: number
    description?: string
    date: DateString

    createdAt: DateString
}

//ANALYTICS dùng để thống kê hiện lên fe thôi
export interface ExpenseByCategory {
    [categoryName: string]: number
}

export interface AnalyticsResult {
    totalIncome: number
    totalExpense: number
    balance: number
    transactionCount: number
    expenseByCategory: ExpenseByCategory //danh mục chi nhiều nhất
    topCategory?: [string, number]
}


//AI INSIGHTS
export type InsightType = 'info' | 'warning' | 'success'

export interface AIInsightItem {
    message: string
    type: InsightType
    createdAt: DateString
}

export interface AISuggestionItem {
    message: string
    icon: LucideIconName // ví dụ: "Pin", "Lightbulb"
}

export interface AIInsight {
    _id: ID
    userId: ID
    insights: AIInsightItem[] //danh sách phân tích
    suggestions: AISuggestionItem[]
    //khoảng thời gian phân tích
    period: {
        from: DateString
        to: DateString
    }
    createdAt: DateString
}


//  BUDGET
export interface Budget {
    _id: ID
    userId: ID
    categoryId: ID
    limit: number //số tiền tối đa
    month: number //1-12
    year: number
    createdAt: DateString
}

//SUBSCRIPTION
export type BillingCycle = 'monthly' | 'yearly'

export interface Subscription {
    _id: ID
    userId: ID
    name: string
    amount: number
    cycle: BillingCycle //hàng tháng / năm
    nextBillingDate: DateString //lần thu tiếp theo
    categoryId: ID
    createdAt: DateString
}

//SAVING GOAL
export interface SavingGoal {
    _id: ID
    userId: ID
    name: string
    targetAmount: number
    currentAmount: number
    deadline?: DateString
    createdAt: DateString
}

//API RESPONSE WRAPPER
export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}


// UI HELPERS
export interface SelectOption<T = string> {
    label: string
    value: T
    icon?: LucideIconName
}
