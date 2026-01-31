'use client'

import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { BarChart3, Sparkles, TrendingUp } from 'lucide-react'

interface AuthModalProps {
  onAuth: (email: string, password: string, isSignUp: boolean) => void
}

export default function AuthModal({ onAuth }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    onAuth(email, password, isSignUp)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-600 to-black flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">

        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white dark:text-foreground">
              Spendio
            </h1>
            <p className="text-xl text-slate-300 dark:text-secondary">
              Smart Personal Finance Management
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Track Expenses
                </h3>
                <p className="text-slate-300 text-sm">
                  Effortlessly monitor all your spending
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  AI-Powered Insights
                </h3>
                <p className="text-slate-300 text-sm">
                  Get smart recommendations powered by AI
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  Visualize Trends
                </h3>
                <p className="text-slate-300 text-sm">
                  Beautiful charts for better understanding
                </p>
              </div>
            </div>


          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center">
          <Card className="w-full border-border bg-background dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold text-foreground">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-secondary text-sm font-medium">
                  {isSignUp
                    ? 'Join us and start managing your finances'
                    : 'Log in to your account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                <Button className="w-full h-10 font-semibold">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-secondary">
                    or
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="w-full text-primary hover:text-accent font-medium"
              >
                {isSignUp
                  ? 'Have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
