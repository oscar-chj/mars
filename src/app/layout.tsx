import { Geist_Mono, Inter } from "next/font/google"
import { Suspense } from "react"

import { Header } from "@/components/prototype/header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

import { PhaseProvider } from "@/context/PhaseContext"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <PhaseProvider>
            <div className="flex min-h-screen flex-col">
              <Suspense
                fallback={
                  <div className="h-16 border-b border-border bg-background" />
                }
              >
                <Header />
              </Suspense>
              <main className="flex-1">{children}</main>
            </div>
          </PhaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
