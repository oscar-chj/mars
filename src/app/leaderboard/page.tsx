"use client"

import React, { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Trophy, Medal, Award, Crown, ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { usePhase } from "@/context/PhaseContext"
import { useMockStore } from "@/store/useMockStore"
import { Student } from "@/types/claims"

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
  const { activePhase } = usePhase()
  const store = useMockStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Static Mock data for Phase 1
  const getStaticLeaderboardData = (): LeaderboardEntry[] => {
    return [
      { rank: 1, name: "Bob Smith", matricNumber: "U2320842B", points: 150 },
      { rank: 2, name: "Alice Chen", matricNumber: "U2320491A", points: 120, isCurrentUser: true },
      { rank: 3, name: "Charlie Brown", matricNumber: "U2320392C", points: 110 },
      { rank: 4, name: "Diana Prince", matricNumber: "U2320111D", points: 90 },
      { rank: 5, name: "Evan Wright", matricNumber: "U2320739E", points: 70 },
      { rank: 6, name: "Fiona Gallagher", matricNumber: "U2320002F", points: 50 },
    ]
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-muted-foreground font-medium">Loading leaderboard...</div>
      </div>
    )
  }

  // Leaderboard uses static data only in Iteration 1 Phase 1
  const isPhase1Claims = activePhase === 1

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
  const firstPlace = leaderboardData.find((s) => s.rank === 1) || { name: "Bob Smith", matricNumber: "U2320842B", points: 0 }
  const secondPlace = leaderboardData.find((s) => s.rank === 2) || { name: "Alice Chen", matricNumber: "U2320491A", points: 0 }
  const thirdPlace = leaderboardData.find((s) => s.rank === 3) || { name: "Charlie Brown", matricNumber: "U2320392C", points: 0 }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Title & Description */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-7 w-7 text-amber-500" />
            <h1 className="text-3xl font-bold tracking-tight">
              Student Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Track top performers and see where you stand in the Community Merits program.
          </p>
        </div>

        {/* Back to Dashboard Button */}
        <Button variant="outline" asChild className="cursor-pointer">
          <Link href={isAdmin ? "/admin/claims" : "/dashboard"}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {isAdmin ? "Admin Portal" : "Dashboard"}</span>
          </Link>
        </Button>
      </div>

      {/* Admin Notice Banner */}
      {isAdmin && (
        <div className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-600 dark:text-blue-400">
          <Shield className="h-4 w-4 shrink-0" />
          <div>
            <span className="font-semibold">Admin View:</span> You are viewing the student leaderboard as an administrator.
          </div>
        </div>
      )}

      {/* Top 3 Podium Display */}
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-center md:text-left">Top Performers</CardTitle>
          <CardDescription className="text-center md:text-left">
            Recognizing the leading contributors this semester.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-6 pt-12 pb-4 max-w-4xl mx-auto">
            
            {/* 2nd Place: Left Block */}
            <div className="w-full md:w-56 flex flex-col items-center order-2 md:order-1">
              {/* Student Info */}
              <div className="flex flex-col items-center text-center mb-4 space-y-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-lg border-2 border-slate-400 text-slate-700 dark:text-slate-300 shadow-xs">
                    {secondPlace.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-slate-400 text-white rounded-full px-2 py-0.5 text-[10px] leading-none flex items-center justify-center font-semibold border-2 border-background shadow-sm">
                    2nd
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Medal className="h-4 w-4 text-slate-400 fill-slate-400/20" />
                    <h3 className="font-bold text-foreground">{secondPlace.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{secondPlace.matricNumber}</p>
                </div>
                <Badge variant="outline" className="border-slate-400/30 bg-slate-400/5 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-0.5">
                  {secondPlace.points} pts
                </Badge>
              </div>
              {/* Step Block */}
              <div className="w-full h-28 md:h-36 bg-gradient-to-b from-slate-400/10 to-slate-400/5 dark:from-slate-400/20 dark:to-slate-400/5 border border-slate-400/30 rounded-t-2xl flex items-center justify-center shadow-xs">
                <span className="text-6xl font-extrabold text-slate-400/30 dark:text-slate-400/20">2</span>
              </div>
            </div>

            {/* 1st Place: Center Block */}
            <div className="w-full md:w-60 flex flex-col items-center order-1 md:order-2">
              {/* Student Info */}
              <div className="flex flex-col items-center text-center mb-4 space-y-2">
                <div className="relative scale-110">
                  <div className="w-18 h-18 rounded-full bg-amber-500/10 flex items-center justify-center font-bold text-xl border-2 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm">
                    {firstPlace.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-full px-2 py-0.5 text-[10px] leading-none flex items-center justify-center font-semibold border-2 border-background shadow-sm">
                    1st
                  </span>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-center gap-1">
                    <Crown className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                    <h3 className="font-extrabold text-lg text-foreground">{firstPlace.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{firstPlace.matricNumber}</p>
                </div>
                <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold px-3 py-0.5 shadow-xs">
                  {firstPlace.points} pts
                </Badge>
              </div>
              {/* Step Block */}
              <div className="w-full h-36 md:h-48 bg-gradient-to-b from-amber-500/15 to-amber-500/5 dark:from-amber-500/25 dark:to-amber-500/5 border border-amber-500/30 rounded-t-2xl flex items-center justify-center shadow-md">
                <span className="text-7xl font-extrabold text-amber-500/30 dark:text-amber-500/20">1</span>
              </div>
            </div>

            {/* 3rd Place: Right Block */}
            <div className="w-full md:w-56 flex flex-col items-center order-3 md:order-3">
              {/* Student Info */}
              <div className="flex flex-col items-center text-center mb-4 space-y-2">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-orange-700/10 flex items-center justify-center font-bold text-lg border-2 border-orange-600 text-orange-700 dark:text-orange-400 shadow-xs">
                    {thirdPlace.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-orange-600 text-white rounded-full px-2 py-0.5 text-[10px] leading-none flex items-center justify-center font-semibold border-2 border-background shadow-sm">
                    3rd
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Award className="h-4 w-4 text-orange-600 fill-orange-600/20" />
                    <h3 className="font-bold text-foreground">{thirdPlace.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{thirdPlace.matricNumber}</p>
                </div>
                <Badge variant="outline" className="border-orange-600/30 bg-orange-600/5 text-orange-700 dark:text-orange-400 font-semibold px-2.5 py-0.5">
                  {thirdPlace.points} pts
                </Badge>
              </div>
              {/* Step Block */}
              <div className="w-full h-20 md:h-28 bg-gradient-to-b from-orange-600/10 to-orange-600/5 dark:from-orange-600/20 dark:to-orange-600/5 border border-orange-600/30 rounded-t-2xl flex items-center justify-center shadow-xs">
                <span className="text-6xl font-extrabold text-orange-600/30 dark:text-orange-600/20">3</span>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Standing Table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Rankings</CardTitle>
          <CardDescription>Full leaderboard of student merit achievements.</CardDescription>
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
                      student.isCurrentUser && "bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 font-medium"
                    )}
                  >
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        {isRank1 && <Crown className="h-4 w-4 text-amber-500 fill-amber-500/20 animate-pulse" />}
                        {isRank2 && <Medal className="h-4 w-4 text-slate-400 fill-slate-400/20" />}
                        {isRank3 && <Award className="h-4 w-4 text-orange-600 fill-orange-600/20" />}
                        {!isRank1 && !isRank2 && !isRank3 && <span className="w-4 inline-block text-center" />}
                        <span>{student.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{student.name}</span>
                        {student.isCurrentUser && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] py-0 px-1.5 rounded-md font-semibold shrink-0">
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {student.matricNumber}
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
    <Suspense fallback={
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 flex items-center justify-center h-[50vh]">
        <div className="text-center text-muted-foreground">Loading leaderboard...</div>
      </div>
    }>
      <LeaderboardContent />
    </Suspense>
  )
}
