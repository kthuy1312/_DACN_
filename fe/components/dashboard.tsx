'use client';

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Tags,
  Sparkles,
  Calendar,
  User as UserIcon,
  Settings
} from 'lucide-react'
import { useState, useMemo } from 'react';
import TransactionList from './transaction-list';
import BalanceCard from './balance-card';
import TransactionForm from './transaction-form';
import Analytics from './analytics';
import CategoryManager from './category-manager';
import AIInsights from './ai-insights';
import CalendarView from './calendar-view';
import MonthlySummary from './monthly-summary';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
}

interface DashboardProps {
  activeView: string;
  user: User | null;
}

export default function Dashboard({ activeView, user }: DashboardProps) { // Declare user variable
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Salary',
      amount: 3000,
      category: 'Income',
      type: 'income',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: '2',
      description: 'Grocery Shopping',
      amount: 150,
      category: 'Food',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
    {
      id: '3',
      description: 'Gas',
      amount: 50,
      category: 'Transportation',
      type: 'expense',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    },
    {
      id: '4',
      description: 'Movie Tickets',
      amount: 30,
      category: 'Entertainment',
      type: 'expense',
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    },
  ]);

  const [categories, setCategories] = useState<string[]>([
    'Food',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Income',
  ]);

  const balanceData = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  const handleAddTransaction = (
    description: string,
    amount: number,
    category: string,
    type: 'income' | 'expense',
    date: string,
  ) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      amount,
      category,
      type,
      date,
    };

    setTransactions([newTransaction, ...transactions]);
  };

  const handleEditTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* OVERVIEW */}
            <MonthlySummary transactions={transactions} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BalanceCard title="Income" amount={balanceData.income} type="income" />
              <BalanceCard title="Expenses" amount={balanceData.expenses} type="expense" />
              <BalanceCard title="Balance" amount={balanceData.balance} type="balance" />
            </div>

            {/* FORM */}
            <div className="bg-card border border-border rounded-xl p-6">
              <TransactionForm
                categories={categories}
                onAddTransaction={handleAddTransaction}
              />
            </div>

            {/* 🔥 ANALYTICS – RIÊNG */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <Analytics transactions={transactions} />
            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-foreground">
                <Wallet className="w-5 h-5 text-primary" />
                Recent Transactions
              </h2>

              <TransactionList
                transactions={transactions.slice(0, 5)}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>

        )

      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BalanceCard title="Income" amount={balanceData.income} type="income" />
              <BalanceCard title="Expenses" amount={balanceData.expenses} type="expense" />
              <BalanceCard title="Balance" amount={balanceData.balance} type="balance" />
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <TransactionForm
                categories={categories}
                onAddTransaction={handleAddTransaction}
              />
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <TrendingDown className="w-5 h-5 text-primary" />
                All Transactions
              </h2>

              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <BarChart3 className="w-6 h-6 text-primary" />
              Analytics & Reports
            </h2>

            <div className="bg-card border border-border rounded-xl p-6">
              <Analytics transactions={transactions} fullView />
            </div>
          </div>
        )


      case 'categories':
        return (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Tags className="w-6 h-6 text-primary" />
              Manage Categories
            </h2>

            <div className="bg-card border border-border rounded-xl p-6">
              <CategoryManager
                categories={categories}
                onAddCategory={handleAddCategory}
              />
            </div>
          </div>
        )

      case 'insights':
        return (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="w-6 h-6 text-primary" />
              AI-Powered Insights
            </h2>

            <div className="bg-card border border-border rounded-xl p-6">
              <AIInsights transactions={transactions} categories={categories} />
            </div>
          </div>
        )

      case 'calendar':
        return (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Calendar className="w-6 h-6 text-primary" />
              Calendar View
            </h2>

            <p className="text-muted-foreground">
              Click on a date to see transactions for that day
            </p>

            <div className="bg-card border border-border rounded-xl p-6">
              <CalendarView transactions={transactions} />
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">User Profile</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card rounded-lg p-8 border border-border">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{user?.name}</h3>
                      <p className="text-secondary">{user?.email}</p>
                      <p className="text-sm text-secondary mt-2">Pro Account</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Account Settings</h3>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors">
                        Change Password
                      </button>
                    </div>
                    <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold mt-6">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary">Plan Type</span>
                      <span className="font-medium text-foreground">Pro</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Member Since</span>
                      <span className="font-medium text-foreground">2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Transactions</span>
                      <span className="font-medium text-foreground">{transactions.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-sm text-foreground">Email Notifications</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-sm text-foreground">Weekly Reports</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span className="text-sm text-foreground">Marketing Emails</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Settings className="w-6 h-6 text-primary" />
              Settings
            </h2>
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Account Settings</h3>
                  <p className="text-secondary">Configure your account preferences and privacy</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-background p-8">
      {renderView()}
    </main>
  );
}
