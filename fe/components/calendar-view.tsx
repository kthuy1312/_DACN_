'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

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

interface CalendarViewProps {
  transactions: Transaction[];
}

export default function CalendarView({ transactions }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const previousMonthDays = Array.from({ length: startingDayOfWeek }, (_, i) =>
    new Date(year, month, -(startingDayOfWeek - i - 1)).getDate(),
  );

  const transactionsByDate = useMemo(() => {
    const map: { [key: string]: Transaction[] } = {};

    transactions.forEach((transaction) => {
      if (transaction.createdAt) {
        const dateKey = dayjs(transaction.createdAt).format("YYYY-MM-DD");

        if (!map[dateKey]) {
          map[dateKey] = [];
        }

        map[dateKey].push(transaction);
      }
    });

    return map;
  }, [transactions]);


  const today = new Date()
  const defaultDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  const [selectedDate, setSelectedDate] = useState<string | null>(defaultDate)


  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const getDateString = (day: number) => {
    return dayjs(new Date(year, month, day)).format("YYYY-MM-DD");
  };


  const dayTransactions = selectedDate ? transactionsByDate[selectedDate] || [] : [];
  const dayExpenses = dayTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const dayIncome = dayTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpenses = transactions
    .filter((t) => {
      const tDate = new Date(t.createdAt);
      return tDate.getMonth() === month && tDate.getFullYear() === year && t.type === 'expense';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthIncome = transactions
    .filter((t) => {
      const tDate = new Date(t.createdAt);
      return tDate.getMonth() === month && tDate.getFullYear() === year && t.type === 'income';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                {currentDate.toLocaleString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
                }
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="
                      p-2 rounded-xl
                      bg-background border border-border
                      hover:bg-muted hover:border-primary
                      transition-all
                    "
                >
                  <ChevronLeft size={20} className="text-foreground" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="
                      p-2 rounded-xl
                      bg-background border border-border
                      hover:bg-muted hover:border-primary
                      transition-all
                  "
                >
                  <ChevronRight size={20} className="text-foreground" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>


            <div className="grid grid-cols-7 gap-2">
              {previousMonthDays.map((day, i) => (
                <div key={`prev-${i}`} className="aspect-square"></div>
              ))}

              {days.map((day) => {
                const dateStr = getDateString(day);
                const dayTxns = transactionsByDate[dateStr] || [];
                const dayExpense = dayTxns
                  .filter((t) => t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0);
                const isSelected = selectedDate === dateStr;
                const hasTransactions = dayTxns.length > 0;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`
                        aspect-square rounded-xl p-2
                        flex flex-col items-center justify-center
                        text-sm font-medium
                        transition-all duration-200
                       ${isSelected
                        ? 'border-2 border-foreground text-foreground scale-[1.05]'
                        : 'bg-card border border-border hover:border-foreground'
                      }

                      `}
                  >
                    <span>{day}</span>

                    {hasTransactions && (
                      <span
                        className={`
                            mt-1 text-[10px] px-2 py-0.5 rounded-full
                           ${isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-destructive/10 text-destructive'
                          }

                          }
                          `}
                      >
                        {dayTxns.length}
                      </span>
                    )}
                  </button>

                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3 text-lg">
                  Transactions on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h4>

                {dayTransactions.length === 0 ? (
                  <p className="text-secondary">No transactions on this date</p>
                ) : (
                  <div className="space-y-3">
                    {dayTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:border-primary transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{transaction.description}</p>
                          <p className="text-sm text-secondary">{transaction.categoryName}</p>
                        </div>
                        <span
                          className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {dayTransactions.length > 0 && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="p-3 rounded-lg bg-background">
                    <p className="text-sm text-secondary mb-1">Income</p>
                    <p className="text-xl font-bold text-green-600">${dayIncome.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background">
                    <p className="text-sm text-secondary mb-1">Expenses</p>
                    <p className="text-xl font-bold text-red-600">${dayExpenses.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
              Monthly Income
            </p>
            <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
              ${monthIncome.toFixed(2)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg p-6 border border-red-200 dark:border-red-800 shadow-sm">
            <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
              Monthly Expenses
            </p>
            <p className="text-3xl font-bold text-red-900 dark:text-red-100">
              ${monthExpenses.toFixed(2)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-6 border border-blue-200 dark:border-blue-800 shadow-sm">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              Month Balance
            </p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              ${(monthIncome - monthExpenses).toFixed(2)}
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h4 className="text-lg font-semibold tracking-tight text-foreground mb-4">Quick Stats</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Total Transactions</span>
                <span className="font-semibold text-foreground">
                  {transactions.filter((t) => {
                    const tDate = new Date(t.createdAt);
                    return (
                      tDate.getMonth() === month && tDate.getFullYear() === year
                    );
                  }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Income Transactions</span>
                <span className="font-semibold text-green-600">
                  {transactions.filter((t) => {
                    const tDate = new Date(t.createdAt);
                    return (
                      tDate.getMonth() === month &&
                      tDate.getFullYear() === year &&
                      t.type === 'income'
                    );
                  }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Expense Transactions</span>
                <span className="font-semibold text-red-600">
                  {transactions.filter((t) => {
                    const tDate = new Date(t.createdAt);
                    return (
                      tDate.getMonth() === month &&
                      tDate.getFullYear() === year &&
                      t.type === 'expense'
                    );
                  }).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
