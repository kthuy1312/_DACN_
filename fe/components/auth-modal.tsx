'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { BarChart3, Sparkles, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { toast } from "sonner";

export default function AuthModal() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }

    if (password.length < 6) {
      setError("Password length must be more than 6 characters")
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setError("The verification password does not match")
      return
    }

    const result = await login(email, password)

    if (!result.success) {
      setError(result.message || "Login failed")
    }
    else {
      toast.success("Welcome back!")
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-600 to-black flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">

        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white">Spendio</h1>
            <p className="text-xl text-slate-300">
              Smart Personal Finance Management
            </p>
          </div>

          <div className="space-y-5">
            <Feature
              icon={<BarChart3 className="w-6 h-6" />}
              title="Track Expenses"
              desc="Effortlessly monitor all your spending"
              color="bg-blue-100 text-blue-600"
            />
            <Feature
              icon={<Sparkles className="w-6 h-6" />}
              title="AI-Powered Insights"
              desc="Get smart recommendations powered by AI"
              color="bg-emerald-100 text-emerald-600"
            />
            <Feature
              icon={<TrendingUp className="w-6 h-6" />}
              title="Visualize Trends"
              desc="Beautiful charts for better understanding"
              color="bg-purple-100 text-purple-600"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center">
          <Card className="w-full bg-background shadow-xl rounded-xl">
            <div className="p-8 space-y-6">

              <div className="text-center space-y-2">
                <h2 className="text-4xl font-bold">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-secondary text-sm">
                  {isSignUp
                    ? 'Join us and start managing your finances'
                    : 'Log in to your account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                />

                <InputField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                />

                {isSignUp && (
                  <InputField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="••••••••"
                  />
                )}

                {error && (
                  <div className="border border-red-300/30 bg-red-50/40 rounded-md px-3 py-2">
                    <p className="text-[15px] text-red-600 text-center leading-snug">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-white!"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>

              </form>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                }}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <span className="font-medium text-primary hover:underline">
                      Sign In
                    </span>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <span className="font-medium text-primary hover:underline">
                      Sign Up
                    </span>
                  </>
                )}
              </button>

            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}

/* ================== COMPONENT PHỤ ================== */

function Feature({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  color: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-100">{title}</h3>
        <p className="text-slate-300 text-sm">{desc}</p>
      </div>
    </div>
  )
}

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
