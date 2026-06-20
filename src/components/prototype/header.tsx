"use client"

import { Award, ChevronDown, Shield, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePhase } from "@/context/PhaseContext"

export function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { activePhase, setPhase } = usePhase()
  
  const isAdmin = pathname.startsWith("/admin") || searchParams.get("role") === "admin"

  const isActive = (path: string) => {
    if (path === "/leaderboard?role=admin") {
      return pathname === "/leaderboard" && searchParams.get("role") === "admin"
    }
    if (path === "/leaderboard") {
      return pathname === "/leaderboard" && searchParams.get("role") !== "admin"
    }
    return pathname === path
  }

  const navLinks = isAdmin
    ? [
        { label: "Claims Queue", href: "/admin/claims" },
        { label: "Audit Logs", href: "/admin/logs" },
        { label: "Leaderboard", href: "/leaderboard?role=admin" },
      ]
    : [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Leaderboard", href: "/leaderboard" },
      ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href={isAdmin ? "/admin/claims" : "/dashboard"}
            className="flex items-center gap-2 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 shrink-0"
          >
            <Award className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline">Community Merits</span>
            <span className="sm:hidden">Merits</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground/80",
                    active ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Controls: Switchers */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Phase Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 cursor-pointer h-9"
              >
                <span className="text-xs font-semibold">Phase {activePhase}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem className="cursor-pointer" onClick={() => setPhase(1)}>
                <span className="flex-1">Phase 1: Static UI</span>
                {activePhase === 1 && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setPhase(2)}>
                <span className="flex-1">Phase 2: Zustand Sync</span>
                {activePhase === 2 && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setPhase(3)}>
                <span className="flex-1">Phase 3: LocalStorage Persist</span>
                {activePhase === 3 && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 cursor-pointer h-9"
              >
                {isAdmin ? (
                  <>
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline">Admin</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline">Student (Alice)</span>
                  </>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="w-full flex items-center justify-between">
                  <span>Student (Alice)</span>
                  {!isAdmin && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/claims" className="w-full flex items-center justify-between">
                  <span>Admin</span>
                  {isAdmin && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
