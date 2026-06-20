"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePhase } from "@/context/PhaseContext"
import { cn } from "@/lib/utils"
import { useMockStore } from "@/store/useMockStore"
import { Award, Crown, Medal, Shield } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

interface LeaderboardEntry {
  rank: number
  name: string
  matricNumber: string
  points: number
  isCurrentUser?: boolean
}

function LeaderboardContent() {
  const searchParams = useSearchParams()
  const isAdmin = searchParams.get("role") === "admin"
  const { activePhase, activeIteration } = usePhase()
  const store = useMockStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Static Mock data for Phase 1
  const getStaticLeaderboardData = (): LeaderboardEntry[] => {
    return [
      { rank: 1, name: "Bob Smith", matricNumber: "U2320842B", points: 150 },
      {
        rank: 2,
        name: "Alice Chen",
        matricNumber: "U2320491A",
        points: 120,
        isCurrentUser: true,
      },
      {
        rank: 3,
        name: "Charlie Brown",
        matricNumber: "U2320392C",
        points: 110,
      },
      { rank: 4, name: "Diana Prince", matricNumber: "U2320111D", points: 90 },
      { rank: 5, name: "Evan Wright", matricNumber: "U2320739E", points: 70 },
      {
        rank: 6,
        name: "Fiona Gallagher",
        matricNumber: "U2320002F",
        points: 50,
      },
    ]
  }

  if (!mounted) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="font-medium text-muted-foreground">
          Loading leaderboard...
        </div>
      </div>
    )
  }

  // Leaderboard uses static data only in Iteration 1 Phase 1
  const isPhase1Claims = activePhase === 1

  const formatMatric = (matric: string) => {
    if (activeIteration !== 2 && activeIteration !== 3) return matric
    if (matric === "U2320491A") return "BC223014"
    if (matric === "U2320555D") return "BC223055"
    if (matric === "U2320999E") return "BC223099"
    if (matric.startsWith("U2320") && matric.length >= 8) {
      return "BC223" + matric.substring(5, 8)
    }
    return matric
  }

  // Load from store or static mock based on phase
  let leaderboardData: LeaderboardEntry[] = []
  if (isPhase1Claims) {
    leaderboardData = getStaticLeaderboardData()
  } else {
    const students = Object.values(store.students)
    const sorted = [...students].sort((a, b) => b.points - a.points)
    leaderboardData = sorted.map((s, idx) => ({
      rank: idx + 1,
      name: s.name,
      matricNumber: s.matricNumber,
      points: s.points,
      isCurrentUser: s.id === "alice",
    }))
  }

  // 1st, 2nd, 3rd place extraction
  const firstPlace = leaderboardData.find((s) => s.rank === 1) || {
    name: "Bob Smith",
    matricNumber: "U2320842B",
    points: 0,
  }
  const secondPlace = leaderboardData.find((s) => s.rank === 2) || {
    name: "Alice Chen",
    matricNumber: "U2320491A",
    points: 0,
  }
  const thirdPlace = leaderboardData.find((s) => s.rank === 3) || {
    name: "Charlie Brown",
    matricNumber: "U2320392C",
    points: 0,
  }

  return (
    <div className="mx-auto max-w-7xl animate-in space-y-8 p-4 duration-300 fade-in sm:p-6 lg:p-8">
      {/* Title & Description */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeIteration === 2 || activeIteration === 3
              ? "Leaderboard"
              : "Student Leaderboard"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track top performers and see where you stand in the Community Merits
            program.
          </p>
        </div>
      </div>

      {/* Admin Notice Banner */}
      {isAdmin && (
        <div className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-600 dark:text-blue-400">
          <Shield className="h-4 w-4 shrink-0" />
          <div>
            <span className="font-semibold">Admin View:</span> You are viewing
            the student leaderboard as an administrator.
          </div>
        </div>
      )}

      {/* Top 3 Podium Display */}
      <Card className="overflow-hidden border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-xl font-semibold md:text-left">
            Top Performers
          </CardTitle>
          <CardDescription className="text-center md:text-left">
            Recognizing the leading contributors this semester.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 pt-12 pb-4 md:flex-row md:items-end md:gap-6">
            {/* 2nd Place: Left Block */}
            <div className="order-2 flex w-full flex-col items-center md:order-1 md:w-56">
              {/* Student Info */}
              <div className="mb-4 flex flex-col items-center space-y-2 text-center">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-100 text-lg font-bold text-slate-700 shadow-xs dark:bg-slate-800 dark:text-slate-300">
                    {secondPlace.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="absolute -right-2 -bottom-2 flex items-center justify-center rounded-full border-2 border-background bg-slate-400 px-2 py-0.5 text-[10px] leading-none font-semibold text-white shadow-sm">
                    2nd
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Medal className="h-4 w-4 fill-slate-400/20 text-slate-400" />
                    <h3 className="font-bold text-foreground">
                      {secondPlace.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatMatric(secondPlace.matricNumber)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-slate-400/30 bg-slate-400/5 px-2.5 py-0.5 font-semibold text-slate-700 dark:text-slate-300"
                >
                  {secondPlace.points} pts
                </Badge>
              </div>
              {/* Step Block */}
              <div className="flex h-28 w-full items-center justify-center rounded-t-2xl border border-slate-400/30 bg-gradient-to-b from-slate-400/10 to-slate-400/5 shadow-xs md:h-36 dark:from-slate-400/20 dark:to-slate-400/5">
                <span className="text-6xl font-extrabold text-slate-400/30 dark:text-slate-400/20">
                  2
                </span>
              </div>
            </div>

            {/* 1st Place: Center Block */}
            <div className="order-1 flex w-full flex-col items-center md:order-2 md:w-60">
              {/* Student Info */}
              <div className="mb-4 flex flex-col items-center space-y-2 text-center">
                <div className="relative scale-110">
                  <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 border-amber-500 bg-amber-500/10 text-xl font-bold text-amber-600 shadow-sm dark:text-amber-400">
                    {firstPlace.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="absolute -right-2 -bottom-2 flex items-center justify-center rounded-full border-2 border-background bg-amber-500 px-2 py-0.5 text-[10px] leading-none font-semibold text-white shadow-sm">
                    1st
                  </span>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-center gap-1">
                    <Crown className="h-4 w-4 fill-amber-500/20 text-amber-500" />
                    <h3 className="text-lg font-extrabold text-foreground">
                      {firstPlace.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatMatric(firstPlace.matricNumber)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-500/40 bg-amber-500/10 px-3 py-0.5 font-bold text-amber-700 shadow-xs dark:text-amber-400"
                >
                  {firstPlace.points} pts
                </Badge>
              </div>
              {/* Step Block */}
              <div className="flex h-36 w-full items-center justify-center rounded-t-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/15 to-amber-500/5 shadow-md md:h-48 dark:from-amber-500/25 dark:to-amber-500/5">
                <span className="text-7xl font-extrabold text-amber-500/30 dark:text-amber-500/20">
                  1
                </span>
              </div>
            </div>

            {/* 3rd Place: Right Block */}
            <div className="order-3 flex w-full flex-col items-center md:order-3 md:w-56">
              {/* Student Info */}
              <div className="mb-4 flex flex-col items-center space-y-2 text-center">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange-600 bg-orange-700/10 text-lg font-bold text-orange-700 shadow-xs dark:text-orange-400">
                    {thirdPlace.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="absolute -right-2 -bottom-2 flex items-center justify-center rounded-full border-2 border-background bg-orange-600 px-2 py-0.5 text-[10px] leading-none font-semibold text-white shadow-sm">
                    3rd
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Award className="h-4 w-4 fill-orange-600/20 text-orange-600" />
                    <h3 className="font-bold text-foreground">
                      {thirdPlace.name}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatMatric(thirdPlace.matricNumber)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-orange-600/30 bg-orange-600/5 px-2.5 py-0.5 font-semibold text-orange-700 dark:text-orange-400"
                >
                  {thirdPlace.points} pts
                </Badge>
              </div>
              {/* Step Block */}
              <div className="flex h-20 w-full items-center justify-center rounded-t-2xl border border-orange-600/30 bg-gradient-to-b from-orange-600/10 to-orange-600/5 shadow-xs md:h-28 dark:from-orange-600/20 dark:to-orange-600/5">
                <span className="text-6xl font-extrabold text-orange-600/30 dark:text-orange-600/20">
                  3
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standing Table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Rankings</CardTitle>
          <CardDescription>
            Full leaderboard of student merit achievements.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Matric Number</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((student) => {
                const isRank1 = student.rank === 1
                const isRank2 = student.rank === 2
                const isRank3 = student.rank === 3

                return (
                  <TableRow
                    key={student.matricNumber}
                    className={cn(
                      student.isCurrentUser &&
                        "bg-primary/5 font-medium hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15"
                    )}
                  >
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        {isRank1 && (
                          <Crown className="h-4 w-4 animate-pulse fill-amber-500/20 text-amber-500" />
                        )}
                        {isRank2 && (
                          <Medal className="h-4 w-4 fill-slate-400/20 text-slate-400" />
                        )}
                        {isRank3 && (
                          <Award className="h-4 w-4 fill-orange-600/20 text-orange-600" />
                        )}
                        {!isRank1 && !isRank2 && !isRank3 && (
                          <span className="inline-block w-4 text-center" />
                        )}
                        <span>{student.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{student.name}</span>
                        {student.isCurrentUser && (
                          <Badge
                            variant="secondary"
                            className="shrink-0 rounded-md border-primary/20 bg-primary/10 px-1.5 py-0 text-[10px] font-semibold text-primary"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatMatric(student.matricNumber)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {student.points} pts
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LeaderboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex h-[50vh] max-w-7xl items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="text-center text-muted-foreground">
            Loading leaderboard...
          </div>
        </div>
      }
    >
      <LeaderboardContent />
    </Suspense>
  )
}
