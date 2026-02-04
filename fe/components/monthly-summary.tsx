'use client';

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
interface MonthlySummaryProps {
  transactions: Transaction[];
}

export default function MonthlySummary({ transactions }: MonthlySummaryProps) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthTransactions = transactions.filter((t) => {
    const tDate = new Date(t.createdAt);
    return tDate.getMonth() === month && tDate.getFullYear() === year;
  });

  const monthIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpenses = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthBalance = monthIncome - monthExpenses;

  const expensesByCategory = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.categoryName] = (acc[t.categoryName] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const topCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const monthName = new Date(year, month).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {monthName} Summary
        </p>

        <h2 className="text-3xl font-semibold text-foreground mb-8">
          Monthly Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income */}
          <div className="rounded-lg border border-border bg-background p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Income</p>
            <p className="text-2xl font-bold text-foreground">
              ${monthIncome.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {monthTransactions.filter((t) => t.type === 'income').length} transactions
            </p>
          </div>

          {/* Expenses */}
          <div className="rounded-lg border border-border bg-background p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Expenses</p>
            <p className="text-2xl font-bold text-foreground">
              ${monthExpenses.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {monthTransactions.filter((t) => t.type === 'expense').length} transactions
            </p>
          </div>

          {/* Balance */}
          <div className="rounded-lg border border-border bg-background p-6">
            <p className="text-sm text-muted-foreground mb-2">Remaining Balance</p>
            <p className="text-2xl font-bold text-foreground">
              ${monthBalance.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {monthBalance >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </div>
        </div>

        {/* Rates */}
        <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Savings Rate</p>
            <p className="text-xl font-semibold text-foreground">
              {monthIncome > 0 ? ((monthBalance / monthIncome) * 100).toFixed(1) : 0}%
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Spending Rate</p>
            <p className="text-xl font-semibold text-foreground">
              {monthIncome > 0 ? ((monthExpenses / monthIncome) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Top Spending Categories
          </h3>

          <div className="space-y-4">
            {topCategories.map(([category, amount], index) => {
              const percentage =
                monthExpenses > 0 ? ((amount / monthExpenses) * 100).toFixed(1) : 0;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span className="text-muted-foreground font-medium">
                        {index + 1}.
                      </span>
                      <span className="font-medium text-foreground">
                        {category}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground">
                      ${amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-foreground/60 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground text-right">
                    {percentage}% of spending
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
