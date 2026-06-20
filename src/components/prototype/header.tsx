"use client"

import { Award, ChevronDown, Shield, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePhase } from "@/context/PhaseContext"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { activePhase, activeIteration, setPhase, setIteration } = usePhase()

  if (pathname === "/") {
    return null
  }

  const isAdmin =
    pathname.startsWith("/admin") || searchParams.get("role") === "admin"

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
        { label: "System Logs", href: "/admin/logs" },
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
            className="flex shrink-0 items-center gap-2 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
          >
            <Award className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline">
              {activeIteration === 1 ? "Community Merits" : "MARS Portal"}
            </span>
            <span className="sm:hidden">
              {activeIteration === 1 ? "Merits" : "MARS"}
            </span>
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
                    active
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
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
                className="flex h-9 cursor-pointer items-center gap-2 px-3"
              >
                <span className="text-xs font-semibold">
                  v{activeIteration}.{activePhase}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-24 min-w-24">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer font-medium">
                  v1.0
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-20 min-w-20">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setIteration(1)
                        setPhase(1)
                      }}
                    >
                      <span className="flex-1">v1.1</span>
                      {activeIteration === 1 && activePhase === 1 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setIteration(1)
                        setPhase(2)
                      }}
                    >
                      <span className="flex-1">v1.2</span>
                      {activeIteration === 1 && activePhase === 2 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setIteration(1)
                        setPhase(3)
                      }}
                    >
                      <span className="flex-1">v1.3</span>
                      {activeIteration === 1 && activePhase === 3 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer font-medium">
                  v2.0
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-20 min-w-20">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setIteration(2)
                        setPhase(1)
                      }}
                    >
                      <span className="flex-1">v2.1</span>
                      {activeIteration === 2 && activePhase === 1 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setIteration(2)
                        setPhase(2)
                      }}
                    >
                      <span className="flex-1">v2.2</span>
                      {activeIteration === 2 && activePhase === 2 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setIteration(2) // internally resets phase to 1
                        setPhase(3) // override to v2.3; batched with above in React 18
                      }}
                    >
                      <span className="flex-1">v2.3</span>
                      {activeIteration === 2 && activePhase === 3 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex h-9 cursor-pointer items-center gap-2"
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
                <Link
                  href="/dashboard"
                  className="flex w-full items-center justify-between"
                >
                  <span>Student (Alice)</span>
                  {!isAdmin && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/claims"
                  className="flex w-full items-center justify-between"
                >
                  <span>Admin</span>
                  {isAdmin && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
