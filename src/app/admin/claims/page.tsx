"use client"

import React, { useState, useEffect } from "react"
import { Award, Clock, CheckCircle2, XCircle, ArrowLeft, Shield, RotateCcw } from "lucide-react"
import { toast, Toaster } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Claim, Student } from "@/types/claims"
import { usePhase } from "@/context/PhaseContext"
import { useMockStore } from "@/store/useMockStore"

export default function AdminClaimsPage() {
  const { activePhase } = usePhase()
  const store = useMockStore()
  
  const [mounted, setMounted] = useState(false)
  const [activeClaimId, setActiveClaimId] = useState<string>("claim-1")
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL")
  const [pointsInput, setPointsInput] = useState<string>("")
  const [mobileShowDetail, setMobileShowDetail] = useState(false)

  // Local state for Phase 1 simulation
  const [localClaims, setLocalClaims] = useState<Record<number, Claim[]>>({
    1: [],
    2: [],
    3: [],
  })
  const [localStudents, setLocalStudents] = useState<Record<number, Record<string, Student>>>({
    1: {},
    2: {},
    3: {},
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Initial Mock Students Data
  const getInitialStudents = (iteration: number): Record<string, Student> => {
    const isIteration1 = iteration === 1
    const base = isIteration1
      ? {
          alice: { id: "alice", name: "Alice Chen", email: "alice@student.edu", matricNumber: "U2320491A", points: 120 },
          david: { id: "david", name: "David Lee", email: "david@student.edu", matricNumber: "U2320555D", points: 0 },
          emma: { id: "emma", name: "Emma Stone", email: "emma@student.edu", matricNumber: "U2320999E", points: 0 },
        }
      : {
          alice: { id: "alice", name: "Alice Chen", email: "alice@student.edu", matricNumber: "BC223014", points: 120 },
          david: { id: "david", name: "David Lee", email: "david@student.edu", matricNumber: "220555", points: 0 },
          emma: { id: "emma", name: "Emma Stone", email: "emma@student.edu", matricNumber: "220999", points: 0 },
        }

    return { ...base, ...localStudents[iteration] }
  }

  // Initial Mock Claims
  const getInitialClaims = (iteration: number): Claim[] => {
    const base: Claim[] = [
      {
        id: "claim-1",
        studentId: "alice",
        studentName: "Alice Chen",
        eventName: "Clean Energy Project Presentation",
        category: "ACADEMIC" as const,
        date: "2026-06-19",
        organizer: "Science Department",
        proofFileName: "clean_energy_presentation.pdf",
        proofBase64: "",
        pointsAwarded: null,
        status: "PENDING" as const,
      },
      {
        id: "claim-2",
        studentId: "david",
        studentName: "David Lee",
        eventName: "Youth Coding Workshop Coordinator",
        category: "ACADEMIC" as const,
        date: "2026-06-18",
        organizer: "School of Computing",
        proofFileName: "youth_coding_workshop.pdf",
        proofBase64: "",
        pointsAwarded: null,
        status: "PENDING" as const,
      },
      {
        id: "claim-3",
        studentId: "emma",
        studentName: "Emma Stone",
        eventName: "Sports Day Volunteer",
        category: "VOLUNTEERING" as const,
        date: "2026-06-12",
        organizer: "Sports Club",
        proofFileName: "sports_volunteer_cert.pdf",
        proofBase64: "",
        pointsAwarded: null,
        status: "PENDING" as const,
      },
      {
        id: "claim-4",
        studentId: "alice",
        studentName: "Alice Chen",
        eventName: "Food Bank Drive",
        category: "VOLUNTEERING" as const,
        date: "2026-06-15",
        organizer: "National Food Drive",
        proofFileName: "food_bank_drive_merit.pdf",
        proofBase64: "",
        pointsAwarded: 40,
        status: "APPROVED" as const,
      },
      {
        id: "claim-5",
        studentId: "alice",
        studentName: "Alice Chen",
        eventName: "Charity Bazaar Coordinator",
        category: "VOLUNTEERING" as const,
        date: "2026-05-20",
        organizer: "Rotary Club",
        proofFileName: "charity_bazaar_volunteering.pdf",
        proofBase64: "",
        pointsAwarded: null,
        status: "REJECTED" as const,
      },
    ]

    // Mix local additions/modifications
    const locals = localClaims[iteration]
    const list = [...base]
    
    // Replace base claims with modified local versions
    locals.forEach((local) => {
      const idx = list.findIndex((c) => c.id === local.id)
      if (idx !== -1) {
        list[idx] = local
      } else {
        list.unshift(local)
      }
    })

    return list
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-muted-foreground font-medium">Loading claims inbox...</div>
      </div>
    )
  }

  const isPhase1Claims = activePhase === 1

  // Data selection based on Phase
  const claimsList = isPhase1Claims
    ? getInitialClaims(1)
    : store.claims

  const studentsMap = isPhase1Claims
    ? getInitialStudents(1)
    : store.students

  // Find active claim
  const activeClaim = claimsList.find((c) => c.id === activeClaimId) || claimsList[0]

  const activeStudentInfo = activeClaim
    ? studentsMap[activeClaim.studentId] || {
        id: activeClaim.studentId,
        name: activeClaim.studentName,
        email: `${activeClaim.studentName.toLowerCase().replace(/\s+/g, "")}@student.edu`,
        matricNumber: "BC223014",
        points: 0,
      }
    : null

  // Prefill points input
  const defaultPoints = activeClaim?.status === "APPROVED" && activeClaim.pointsAwarded !== null
    ? String(activeClaim.pointsAwarded)
    : ""

  // Count pending
  const pendingCount = claimsList.filter((c) => c.status === "PENDING").length

  // Filter queue
  const filteredClaims = claimsList.filter((c) => {
    if (filter === "ALL") return true
    return c.status === filter
  })

  // Approve Claim Handler
  const handleApprove = () => {
    if (!activeClaim) return
    const pts = parseInt(pointsInput || defaultPoints, 10)
    if (isNaN(pts) || pts <= 0) {
      toast.error("Please enter a valid positive number of points to award.")
      return
    }

    if (isPhase1Claims) {
      // Local page modification
      const updatedClaim: Claim = {
        ...activeClaim,
        status: "APPROVED",
        pointsAwarded: pts,
      }
      setLocalClaims((prev) => ({
        ...prev,
        [1]: [updatedClaim, ...prev[1].filter((c) => c.id !== activeClaim.id)],
      }))

      // Update student locally
      const currentStud = studentsMap[activeClaim.studentId]
      if (currentStud) {
        setLocalStudents((prev) => ({
          ...prev,
          [1]: {
            ...prev[1],
            [activeClaim.studentId]: {
              ...currentStud,
              points: currentStud.points + pts,
            },
          },
        }))
      }
      toast.success(`[Static Mock] Claim approved. Student awarded ${pts} points locally.`)
    } else {
      // Zustand global update
      store.approveClaim(activeClaim.id, pts)
      toast.success(`Claim approved. Student awarded ${pts} points.`)
    }
  }

  // Reject Claim Handler
  const handleReject = () => {
    if (!activeClaim) return

    if (isPhase1Claims) {
      const updatedClaim: Claim = {
        ...activeClaim,
        status: "REJECTED",
        pointsAwarded: null,
      }
      setLocalClaims((prev) => ({
        ...prev,
        [1]: [updatedClaim, ...prev[1].filter((c) => c.id !== activeClaim.id)],
      }))
      toast.error("[Static Mock] Claim rejected locally.")
    } else {
      store.rejectClaim(activeClaim.id)
      toast.error("Claim rejected. Student has been notified.")
    }
  }

  // Reset Claim Handler (Test utility)
  const handleReset = () => {
    if (isPhase1Claims) {
      if (!activeClaim) return
      // Remove from local modifications list to reset to default
      setLocalClaims((prev) => ({
        ...prev,
        [1]: prev[1].filter((c) => c.id !== activeClaim.id),
      }))
      toast.info("[Static Mock] Claim reset to default pending status.")
    } else {
      store.resetStore()
      toast.info("Zustand store reset to initial values.")
    }
  }

  const getStatusBadge = (status: Claim["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 font-medium" variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            PENDING
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 font-medium" variant="outline">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            APPROVED
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 font-medium" variant="outline">
            <XCircle className="h-3 w-3 mr-1" />
            REJECTED
          </Badge>
        )
    }
  }

  const getCategoryBadge = (category: Claim["category"]) => {
    switch (category) {
      case "ACADEMIC":
        return (
          <Badge variant="outline" className="border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400">
            ACADEMIC
          </Badge>
        )
      case "VOLUNTEERING":
        return (
          <Badge variant="outline" className="border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400">
            VOLUNTEERING
          </Badge>
        )
      case "SPORTS":
        return (
          <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400">
            SPORTS
          </Badge>
        )
      case "CULTURAL":
        return (
          <Badge variant="outline" className="border-pink-500/20 bg-pink-500/5 text-pink-600 dark:text-pink-400">
            CULTURAL
          </Badge>
        )
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
      <Toaster position="top-right" closeButton richColors />

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Claims Inbox
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Review submitted student claims, verify certificates, and award merit points.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-semibold px-3 py-1 text-sm" variant="outline">
            {pendingCount} Pending
          </Badge>
        </div>
      </div>

      {/* Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Claims List */}
        <div className={cn("space-y-4 lg:col-span-5", mobileShowDetail ? "hidden lg:block" : "block")}>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Filter Claims</span>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <span>Claims Queue</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Showing {filteredClaims.length} of {claimsList.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredClaims.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  No claims found matching this filter.
                </div>
              ) : (
                <div className="divide-y divide-border max-h-[calc(100vh-280px)] overflow-y-auto">
                  {filteredClaims.map((claim) => {
                    const isActive = claim.id === activeClaimId
                    return (
                      <div
                        key={claim.id}
                        onClick={() => {
                          setActiveClaimId(claim.id)
                          setMobileShowDetail(true)
                        }}
                        className={cn(
                          "p-4 transition-all cursor-pointer text-left space-y-2 select-none",
                          isActive
                            ? "bg-muted/80 dark:bg-muted/30 font-medium border-l-4 border-primary"
                            : "hover:bg-muted/40"
                        )}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-foreground truncate">{claim.studentName}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{claim.date}</span>
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{claim.eventName}</div>
                        <div className="flex justify-between items-center gap-2 pt-1">
                          {getCategoryBadge(claim.category)}
                          {getStatusBadge(claim.status)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Detail Preview Panel */}
        {activeClaim && (
          <div className={cn("lg:col-span-7 space-y-4", !mobileShowDetail ? "hidden lg:block" : "block")}>
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold">Claim Detail Preview</CardTitle>
                  <CardDescription>Verify claim credentials and metadata below.</CardDescription>
                </div>
                {/* Back Button for mobile view */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileShowDetail(false)}
                  className="lg:hidden cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Queue</span>
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/20 dark:bg-muted/5 p-4 rounded-xl border border-border">
                  <div>
                    <span className="text-xs text-muted-foreground block">Student Name</span>
                    <span className="font-medium text-foreground">{activeClaim.studentName}</span>
                  </div>
                  {activeStudentInfo && (
                    <>
                      <div>
                        <span className="text-xs text-muted-foreground block">Matric Number</span>
                        <span className="font-mono text-xs font-semibold text-foreground">{activeStudentInfo.matricNumber}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-xs text-muted-foreground block">Email Address</span>
                        <span className="font-medium text-foreground">{activeStudentInfo.email}</span>
                      </div>
                    </>
                  )}
                  <div className="md:col-span-2 border-t border-border pt-2 mt-1">
                    <span className="text-xs text-muted-foreground block">Event Name</span>
                    <span className="font-medium text-foreground">{activeClaim.eventName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Organizer</span>
                    <span className="font-medium text-foreground">{activeClaim.organizer}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Category</span>
                    <div className="mt-0.5">{getCategoryBadge(activeClaim.category)}</div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Date of Submission / Event</span>
                    <span className="font-medium text-foreground">{activeClaim.date}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Review Status</span>
                    <div className="mt-0.5">{getStatusBadge(activeClaim.status)}</div>
                  </div>
                  {activeClaim.status === "APPROVED" && activeClaim.pointsAwarded !== null && (
                    <div className="md:col-span-2 border-t border-border pt-2 mt-1">
                      <span className="text-xs text-muted-foreground block">Points Awarded</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                        {activeClaim.pointsAwarded} Points
                      </span>
                    </div>
                  )}
                </div>

                {/* Certificate Preview Box */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Certificate Preview
                  </span>
                  
                  {/* Default beautiful simulated template */}
                  <div className="relative border-8 border-amber-800/10 p-6 rounded-lg bg-amber-50/40 dark:bg-amber-950/10 shadow-inner font-serif max-w-xl mx-auto text-amber-950 dark:text-amber-100 flex flex-col justify-between min-h-[350px] select-none border-double">
                    {/* Inner Gold Thin Border */}
                    <div className="absolute inset-2 border-2 border-amber-700/20 rounded-md pointer-events-none" />

                    {/* Cert Decorative Corner Indicators */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-amber-700/40" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-amber-700/40" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-amber-700/40" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-amber-700/40" />

                    {/* Cert Title */}
                    <div className="text-center space-y-1 pt-2 z-10">
                      <div className="text-[10px] uppercase tracking-widest text-amber-800/80 dark:text-amber-300/80 font-sans font-semibold">
                        Certificate of Achievement
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-amber-900 dark:text-amber-400">
                        COMMUNITY MERIT
                      </h3>
                    </div>

                    {/* Cert Recipient Body */}
                    <div className="text-center space-y-2 my-4 z-10">
                      <p className="text-xs italic text-amber-800/70 dark:text-amber-300/70">
                        This is proudly presented to
                      </p>
                      <p className="text-xl font-bold tracking-wide border-b border-amber-700/20 pb-1 inline-block px-6 text-foreground font-sans">
                        {activeClaim.studentName}
                      </p>
                      <p className="text-xs italic text-amber-800/70 dark:text-amber-300/70">
                        for active participation and outstanding contribution in
                      </p>
                      <p className="text-sm font-semibold text-amber-950 dark:text-amber-200 font-sans px-4 line-clamp-2 max-w-md mx-auto">
                        {activeClaim.eventName}
                      </p>
                    </div>

                    {/* Cert Signatures and Seal */}
                    <div className="flex justify-between items-end w-full px-2 z-10 pt-2">
                      {/* Date segment */}
                      <div className="text-left space-y-0.5">
                        <span className="text-[9px] uppercase text-amber-800/60 dark:text-amber-400/60 block font-sans">
                          Date of Activity
                        </span>
                        <span className="text-xs font-semibold font-sans block text-foreground">
                          {activeClaim.date}
                        </span>
                      </div>

                      {/* Gold Ribbon Seal */}
                      <div className="flex flex-col items-center justify-center -mb-2 scale-90">
                        <div className="relative flex items-center justify-center">
                          {/* Outer ribbons mockup */}
                          <div className="absolute top-4 w-2 h-8 bg-amber-500/80 rotate-12 origin-top rounded-b" />
                          <div className="absolute top-4 w-2 h-8 bg-amber-500/80 -rotate-12 origin-top rounded-b" />
                          <Award className="h-10 w-10 text-amber-500 fill-amber-400/70 drop-shadow-md z-10" />
                        </div>
                        <span className="text-[8px] font-sans font-bold uppercase tracking-tighter text-amber-600 dark:text-amber-400 mt-0.5 z-10">
                          Official Seal
                        </span>
                      </div>

                      {/* Signature line */}
                      <div className="text-right space-y-0.5">
                        <span className="text-[9px] uppercase text-amber-800/60 dark:text-amber-400/60 block font-sans">
                          Authorized Signature
                        </span>
                        <span className="text-xs italic font-serif block text-amber-900/90 dark:text-amber-300/90 font-medium px-1 border-t border-amber-700/20 pt-0.5">
                          Org. Committee
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Actions Box */}
                <div className="border-t border-border pt-4">
                  {activeClaim.status === "PENDING" ? (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1 max-w-xs">
                          <Label htmlFor="pointsAwarded" className="text-sm font-semibold">
                            Points to Award
                          </Label>
                          <Input
                            id="pointsAwarded"
                            type="number"
                            placeholder="e.g. 20"
                            min="1"
                            value={pointsInput}
                            onChange={(e) => setPointsInput(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="flex gap-3 sm:self-end">
                          <Button
                            variant="outline"
                            onClick={handleReject}
                            className="text-destructive border-destructive hover:bg-destructive/10 cursor-pointer"
                          >
                            Reject Claim
                          </Button>
                          <Button
                            onClick={handleApprove}
                            className="bg-red-800 text-white hover:bg-red-900 dark:bg-red-900 dark:hover:bg-red-800 border-none cursor-pointer shadow-sm"
                          >
                            Approve & Award
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 bg-muted/10 dark:bg-muted/5 rounded-xl border border-dashed border-border text-center space-y-3">
                      <div className="text-sm text-muted-foreground">
                        This claim has been processed and is marked as{" "}
                        <span className="font-semibold text-foreground">{activeClaim.status}</span>.
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset Status
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
