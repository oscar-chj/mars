"use client"

import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  XCircle,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast, Toaster } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePhase } from "@/context/PhaseContext"
import { cn } from "@/lib/utils"
import { useMockStore } from "@/store/useMockStore"
import { Claim, Student } from "@/types/claims"
import { sendEmail } from "@/lib/email"
import { generateApprovalHtml, generateRejectionHtml } from "@/lib/email-templates"


export default function AdminClaimsPage() {
  const { activePhase, activeIteration } = usePhase()
  const store = useMockStore()

  const [mounted, setMounted] = useState(false)
  const [activeClaimId, setActiveClaimId] = useState<string>("claim-1")
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL")
  const [pointsInput, setPointsInput] = useState<string>("")
  const [mobileShowDetail, setMobileShowDetail] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Local state for Phase 1 simulation
  const [localClaims, setLocalClaims] = useState<Record<number, Claim[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
  })
  const [localStudents, setLocalStudents] = useState<
    Record<number, Record<string, Student>>
  >({
    1: {},
    2: {},
    3: {},
    4: {},
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Initial Mock Students Data
  const getInitialStudents = (iteration: number): Record<string, Student> => {
    const isIteration1 = iteration === 1
    const base = isIteration1
      ? {
          alice: {
            id: "alice",
            name: "Alice Chen",
            email: "alice@student.edu",
            matricNumber: "U2320491A",
            points: 120,
          },
          david: {
            id: "david",
            name: "David Lee",
            email: "david@student.edu",
            matricNumber: "U2320555D",
            points: 0,
          },
          emma: {
            id: "emma",
            name: "Emma Stone",
            email: "emma@student.edu",
            matricNumber: "U2320999E",
            points: 0,
          },
        }
      : {
          alice: {
            id: "alice",
            name: "Alice Chen",
            email: "alice@student.edu",
            matricNumber: "BC223014",
            points: 120,
          },
          david: {
            id: "david",
            name: "David Lee",
            email: "david@student.edu",
            matricNumber: "BC223055",
            points: 0,
          },
          emma: {
            id: "emma",
            name: "Emma Stone",
            email: "emma@student.edu",
            matricNumber: "BC223099",
            points: 0,
          },
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

  const isPhase1Claims = activePhase === 1

  // Data selection based on Phase
  const claimsList = isPhase1Claims
    ? getInitialClaims(activeIteration)
    : store.claims

  const studentsMap = isPhase1Claims
    ? getInitialStudents(activeIteration)
    : store.students

  const formatMatric = (matric: string) => {
    if (activeIteration !== 2 && activeIteration !== 3) return matric
    if (matric === "U2320491A" || matric === "alice") return "BC223014"
    if (matric === "U2320555D" || matric === "david") return "BC223055"
    if (matric === "U2320999E" || matric === "emma") return "BC223099"
    if (matric === "220555") return "BC223055"
    if (matric === "220999") return "BC223099"
    return matric
  }

  // Find active claim
  const activeClaim =
    claimsList.find((c) => c.id === activeClaimId) || claimsList[0]

  const rawStudentInfo = activeClaim
    ? studentsMap[activeClaim.studentId] || {
        id: activeClaim.studentId,
        name: activeClaim.studentName,
        email: `${activeClaim.studentName.toLowerCase().replace(/\s+/g, "")}@student.edu`,
        matricNumber:
          activeIteration >= 2
            ? "BC223014"
            : "U2320491A",
        points: 0,
      }
    : null

  const activeStudentInfo = rawStudentInfo
    ? {
        ...rawStudentInfo,
        points:
          (activeIteration as number) >= 4
            ? claimsList
                .filter(
                  (c) =>
                    c.studentId === rawStudentInfo.id &&
                    c.status === "APPROVED" &&
                    c.pointsAwarded !== null
                )
                .reduce((sum, c) => sum + (c.pointsAwarded || 0), 0)
            : rawStudentInfo.points,
      }
    : null

  // Reset pagination when filter or data changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1)
  }, [filter, claimsList.length])

  // Prefill points input
  const defaultPoints =
    activeClaim?.status === "APPROVED" && activeClaim.pointsAwarded !== null
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
      toast.error("Enter a valid positive number of points to award")
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
        [activeIteration as number]: [
          updatedClaim,
          ...(prev[activeIteration as number] || []).filter(
            (c) => c.id !== activeClaim.id
          ),
        ],
      }))

      // Update student locally
      const currentStud = studentsMap[activeClaim.studentId]
      if (currentStud) {
        setLocalStudents((prev) => ({
          ...prev,
          [activeIteration as number]: {
            ...(prev[activeIteration as number] || {}),
            [activeClaim.studentId]: {
              ...currentStud,
              points: currentStud.points + pts,
            },
          },
        }))
      }
      if (activeIteration >= 5) {
        toast.success("Claim approved")
      } else {
        toast.success(
          `[Static mock] Claim approved and student awarded ${pts} points locally`
        )
      }
    } else {
      // Zustand global update
      store.approveClaim(activeClaim.id, pts)
      if (activeIteration >= 5) {
        toast.success("Claim approved")
      } else {
        toast.success(`Claim approved and student awarded ${pts} points`)
      }
      if (activeIteration >= 4 && activePhase === 3) {
        const student = store.students[activeClaim.studentId]
        const currentPoints = student ? student.points : 0
        const newBalance = currentPoints + pts
        const html = generateApprovalHtml(activeClaim.studentName, activeClaim.eventName, pts, newBalance)
        sendEmail({
          to: "alice@student.edu",
          subject: "Claim Approved",
          html,
        }).then((res) => {
          if (activeIteration < 5) {
            if (res.error) {
              toast.error("Could not send approval email. Try again")
            } else {
              toast.success("Approval email sent")
            }
          }
        })
      }
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
        [activeIteration as number]: [
          updatedClaim,
          ...(prev[activeIteration as number] || []).filter(
            (c) => c.id !== activeClaim.id
          ),
        ],
      }))
      if (activeIteration >= 5) {
        toast.error("Claim rejected")
      } else {
        toast.error("[Static mock] Claim rejected locally")
      }
    } else {
      store.rejectClaim(activeClaim.id)
      if (activeIteration >= 5) {
        toast.error("Claim rejected")
      } else {
        toast.error("Claim rejected and student notified")
      }
      if (activeIteration >= 4 && activePhase === 3) {
        const html = generateRejectionHtml(
          activeClaim.studentName,
          activeClaim.eventName,
          "Does not meet the guidelines for this category."
        )
        sendEmail({
          to: "alice@student.edu",
          subject: "Claim Rejected",
          html,
        }).then((res) => {
          if (activeIteration < 5) {
            if (res.error) {
              toast.error("Could not send rejection email. Try again")
            } else {
              toast.success("Rejection email sent")
            }
          }
        })
      }
    }
  }

  // Reset Claim Handler (Test utility)
  const handleReset = () => {
    if (isPhase1Claims) {
      if (!activeClaim) return
      // Remove from local modifications list to reset to default
      setLocalClaims((prev) => ({
        ...prev,
        [activeIteration as number]: (
          prev[activeIteration as number] || []
        ).filter((c) => c.id !== activeClaim.id),
      }))
      toast.info("[Static mock] Claim reset to default pending status")
    } else {
      store.resetStore()
      toast.info("Zustand store reset to initial values")
    }
  }

  const getStatusBadge = (status: Claim["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            className="border-amber-500/20 bg-amber-500/10 font-medium text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
            variant="outline"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge
            className="border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-600 hover:bg-emerald-500/20 dark:text-amber-400"
            variant="outline"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge
            className="border-destructive/20 bg-destructive/10 font-medium text-destructive hover:bg-destructive/20"
            variant="outline"
          >
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
    }
  }

  const getCategoryBadge = (category: Claim["category"]) => {
    switch (category) {
      case "ACADEMIC":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400"
          >
            Academic
          </Badge>
        )
      case "VOLUNTEERING":
        return (
          <Badge
            variant="outline"
            className="border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400"
          >
            Volunteering
          </Badge>
        )
      case "SPORTS":
        return (
          <Badge
            variant="outline"
            className="border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400"
          >
            Sports
          </Badge>
        )
      case "CULTURAL":
        return (
          <Badge
            variant="outline"
            className="border-pink-500/20 bg-pink-500/5 text-pink-600 dark:text-pink-400"
          >
            Cultural
          </Badge>
        )
    }
  }

  // Pagination
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage)
  const paginatedClaims = filteredClaims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (!mounted) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="font-medium text-muted-foreground">
          Loading claims inbox...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeIteration >= 2
              ? "Claims queue"
              : "Admin claims inbox"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review submitted student claims, verify certificates, and award
            merit points.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className="border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-600 dark:text-amber-400"
            variant="outline"
          >
            {pendingCount} pending
          </Badge>
        </div>
      </div>

      {/* Split-Screen Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Panel: Claims List */}
        <div
          className={cn(
            "space-y-4 lg:col-span-5",
            mobileShowDetail ? "hidden lg:block" : "block"
          )}
        >
          <Card className="border shadow-sm">
            <CardHeader className="space-y-3 pb-3">
              <CardTitle className="text-lg font-semibold">
                Claims queue
              </CardTitle>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as never)}>
                <TabsList>
                  <TabsTrigger value="ALL">All</TabsTrigger>
                  <TabsTrigger value="PENDING">Pending</TabsTrigger>
                  <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                  <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  Showing {paginatedClaims.length} of {filteredClaims.length}
                </span>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 cursor-pointer"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 cursor-pointer"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredClaims.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No claims found matching this filter.
                </div>
              ) : (
                <div className="flex max-h-[calc(100vh-280px)] flex-col justify-between">
                  <div className="divide-y divide-border overflow-y-auto">
                    {paginatedClaims.map((claim) => {
                      const isActive = claim.id === activeClaimId
                      return (
                        <div
                          key={claim.id}
                          onClick={() => {
                            setActiveClaimId(claim.id)
                            setMobileShowDetail(true)
                          }}
                          className={cn(
                            "cursor-pointer space-y-2 p-4 text-left transition-all select-none",
                            isActive
                              ? "border-l-4 border-primary bg-muted/80 font-medium dark:bg-muted/30"
                              : "hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="truncate font-semibold text-foreground">
                              {claim.studentName}
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {claim.date}
                            </span>
                          </div>
                          <div className="line-clamp-1 text-sm text-muted-foreground">
                            {claim.eventName}
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-1">
                            {getCategoryBadge(claim.category)}
                            {getStatusBadge(claim.status)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Detail Preview Panel */}
        {activeClaim && (
          <div
            className={cn(
              "space-y-4 lg:col-span-7",
              !mobileShowDetail ? "hidden lg:block" : "block"
            )}
          >
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold">
                    Claim details
                  </CardTitle>
                  <CardDescription>
                    Verify the submitted details and proof below.
                  </CardDescription>
                </div>
                {/* Back Button for mobile view */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileShowDetail(false)}
                  className="cursor-pointer lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to queue</span>
                </Button>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Metadata Grid */}
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-muted/20 p-4 text-sm md:grid-cols-2 dark:bg-muted/5">
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Student name
                    </span>
                    <span className="font-medium text-foreground">
                      {activeClaim.studentName}
                    </span>
                  </div>
                  {activeStudentInfo && (
                    <>
                      <div>
                        <span className="block text-xs text-muted-foreground">
                          Matric number
                        </span>
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {formatMatric(activeStudentInfo.matricNumber)}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">
                          Total points
                        </span>
                        <span className="font-semibold text-foreground">
                          {activeStudentInfo.points} pts
                        </span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="block text-xs text-muted-foreground">
                          Email address
                        </span>
                        <span className="font-medium text-foreground">
                          {activeStudentInfo.email}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="mt-1 border-t border-border pt-2 md:col-span-2">
                    <span className="block text-xs text-muted-foreground">
                      Event name
                    </span>
                    <span className="font-medium text-foreground">
                      {activeClaim.eventName}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Organizer
                    </span>
                    <span className="font-medium text-foreground">
                      {activeClaim.organizer}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Category
                    </span>
                    <div className="mt-0.5">
                      {getCategoryBadge(activeClaim.category)}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Date of submission or event
                    </span>
                    <span className="font-medium text-foreground">
                      {activeClaim.date}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Review status
                    </span>
                    <div className="mt-0.5">
                      {getStatusBadge(activeClaim.status)}
                    </div>
                  </div>
                  {activeClaim.status === "APPROVED" &&
                    activeClaim.pointsAwarded !== null && (
                      <div className="mt-1 border-t border-border pt-2 md:col-span-2">
                        <span className="block text-xs text-muted-foreground">
                          Points awarded
                        </span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {activeClaim.pointsAwarded} points
                        </span>
                      </div>
                    )}
                </div>

                {/* Certificate Preview Box */}
                <div className="space-y-2">
                  <span className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Certificate preview
                  </span>

                  {(activeIteration as number) >= 4 ? (
                    activeClaim.proofBase64 &&
                    activeClaim.proofBase64.startsWith(
                      "data:application/pdf;base64,"
                    ) ? (
                      <PdfRenderer base64={activeClaim.proofBase64} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activeClaim.proofBase64 || "/mock-cert.png"}
                        alt="Certificate preview"
                        className="mx-auto max-h-[500px] w-full rounded-md border border-border bg-muted/5 object-contain shadow-inner"
                      />
                    )
                  ) : (
                    /* Default beautiful simulated template */
                    <div className="relative mx-auto flex min-h-[350px] max-w-xl flex-col justify-between rounded-lg border-8 border-double border-amber-800/10 bg-amber-50/40 p-6 font-serif text-amber-950 shadow-inner select-none dark:bg-amber-950/10 dark:text-amber-100">
                      {/* Inner Gold Thin Border */}
                      <div className="pointer-events-none absolute inset-2 rounded-md border-2 border-amber-700/20" />

                      {/* Cert Decorative Corner Indicators */}
                      <div className="absolute top-4 left-4 h-4 w-4 border-t border-l border-amber-700/40" />
                      <div className="absolute top-4 right-4 h-4 w-4 border-t border-r border-amber-700/40" />
                      <div className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-amber-700/40" />
                      <div className="absolute right-4 bottom-4 h-4 w-4 border-r border-b border-amber-700/40" />

                      {/* Cert Title */}
                      <div className="z-10 space-y-1 pt-2 text-center">
                        <div className="font-sans text-[10px] font-semibold tracking-widest text-amber-800/80 uppercase dark:text-amber-300/80">
                          Certificate of achievement
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-amber-900 dark:text-amber-400">
                          {activeIteration >= 2
                            ? "Activity record recording"
                            : "Community merit"}
                        </h3>
                      </div>

                      {/* Cert Recipient Body */}
                      <div className="z-10 my-4 space-y-2 text-center">
                        <p className="text-xs text-amber-800/70 italic dark:text-amber-300/70">
                          This is proudly presented to
                        </p>
                        <p className="inline-block border-b border-amber-700/20 px-6 pb-1 font-sans text-xl font-bold tracking-wide text-foreground">
                          {activeClaim.studentName}
                        </p>
                        <p className="text-xs text-amber-800/70 italic dark:text-amber-300/70">
                          for active participation and outstanding contribution
                          in
                        </p>
                        <p className="mx-auto line-clamp-2 max-w-md px-4 font-sans text-sm font-semibold text-amber-950 dark:text-amber-200">
                          {activeClaim.eventName}
                        </p>
                      </div>

                      {/* Cert Signatures and Seal */}
                      <div className="z-10 flex w-full items-end justify-between px-2 pt-2">
                        {/* Date segment */}
                        <div className="space-y-0.5 text-left">
                          <span className="block font-sans text-[9px] text-amber-800/60 uppercase dark:text-amber-400/60">
                            Date of activity
                          </span>
                          <span className="block font-sans text-xs font-semibold text-foreground">
                            {activeClaim.date}
                          </span>
                        </div>

                        {/* Gold Ribbon Seal */}
                        <div className="-mb-2 flex scale-90 flex-col items-center justify-center">
                          <div className="relative flex items-center justify-center">
                            {/* Outer ribbons mockup */}
                            <div className="absolute top-4 h-8 w-2 origin-top rotate-12 rounded-b bg-amber-500/80" />
                            <div className="absolute top-4 h-8 w-2 origin-top -rotate-12 rounded-b bg-amber-500/80" />
                            <Award className="z-10 h-10 w-10 fill-amber-400/70 text-amber-500 drop-shadow-md" />
                          </div>
                          <span className="z-10 mt-0.5 font-sans text-[8px] font-bold tracking-tighter text-amber-600 uppercase dark:text-amber-400">
                            Official seal
                          </span>
                        </div>

                        {/* Signature line */}
                        <div className="space-y-0.5 text-right">
                          <span className="block font-sans text-[9px] text-amber-800/60 uppercase dark:text-amber-400/60">
                            Authorized signature
                          </span>
                          <span className="block border-t border-amber-700/20 px-1 pt-0.5 font-serif text-xs font-medium text-amber-900/90 italic dark:text-amber-300/90">
                            {activeIteration >= 2
                              ? "MARS registrar"
                              : "Org. committee"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Verification Actions Box */}
                <div className="border-t border-border pt-4">
                  {activeClaim.status === "PENDING" ? (
                    <div className="space-y-4">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="max-w-xs flex-1 space-y-1.5">
                          <Label
                            htmlFor="pointsAwarded"
                            className="text-sm font-semibold"
                          >
                            Points to award
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
                            className="cursor-pointer border-destructive text-destructive hover:bg-destructive/10"
                          >
                            Reject claim
                          </Button>
                          <Button
                            onClick={handleApprove}
                            className="cursor-pointer border-none bg-red-800 text-white shadow-sm hover:bg-red-900 dark:bg-red-900 dark:hover:bg-red-800"
                          >
                            Approve and award
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-border bg-muted/10 p-4 text-center dark:bg-muted/5">
                      <div className="text-sm text-muted-foreground">
                        This claim has been processed and is marked as{" "}
                        <span className="font-semibold text-foreground">
                          {activeClaim.status.toLowerCase()}
                        </span>
                        .
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="cursor-pointer text-xs"
                      >
                        <RotateCcw className="mr-1 h-3 w-3" />
                        Reset status
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Toaster position="top-right" closeButton={activeIteration < 5} richColors />
    </div>
  )
}

function PdfRenderer({ base64 }: { base64: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)

    async function renderPdf() {
      try {
        const base64Data = base64.replace(/^data:application\/pdf;base64,/, "")
        const binaryString = window.atob(base64Data)
        const len = binaryString.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }

        const pdfjs = await import("pdfjs-dist")
        // Set workerSrc
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"

        const loadingTask = pdfjs.getDocument({ data: bytes })
        const pdf = await loadingTask.promise

        if (!active) return

        const page = await pdf.getPage(1)
        if (!active) return

        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d")
        if (!context) {
          throw new Error("Could not get 2d context")
        }

        // Adjust scale/viewport to match parent container width
        const viewport = page.getViewport({ scale: 1.5 })
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          canvas: canvas,
          viewport: viewport,
        }

        await page.render(renderContext).promise
        if (active) {
          setLoading(false)
        }
      } catch (err) {
        console.error("Error rendering PDF:", err)
        if (active) {
          setError(err instanceof Error ? err.message : "Could not render PDF")
          setLoading(false)
        }
      }
    }

    renderPdf()

    return () => {
      active = false
    }
  }, [base64])

  if (error) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
        Error loading PDF proof: {error}
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[350px] items-center justify-center rounded-md border border-border bg-muted/10">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 text-sm text-muted-foreground">
          Loading PDF proof...
        </div>
      )}
      <canvas
        id="pdf-canvas"
        ref={canvasRef}
        className="max-h-[500px] w-full rounded-md object-contain"
      />
    </div>
  )
}
