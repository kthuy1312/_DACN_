import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from "@/context/AuthContext"
import 'antd/dist/reset.css'
import { Toaster } from 'sonner'
import { TransactionProvider } from "@/context/TransactionContext"
import { ConfigProvider, theme } from "antd"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Spendio - Personal Finance Management',
  description: 'Manage your personal finances with AI-powered insights and smart categorization',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm, // sẽ tự theo dark nếu bạn cấu hình thêm bên dưới
            token: {
              colorBgContainer: "var(--card)",
              colorText: "var(--foreground)",
              colorBorder: "var(--border)",
            },
          }}
        >
          <AuthProvider>
            <TransactionProvider>
              {children}
            </TransactionProvider>
          </AuthProvider>
        </ConfigProvider>

        <Analytics />
        <Toaster
          richColors
          toastOptions={{
            className:
              "px-3 py-2 min-h-0 rounded-md text-sm leading-snug",
          }}
        />
      </body>
    </html>

  )
}
