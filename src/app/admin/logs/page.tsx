"use client"

import { CheckCircle2, ChevronLeft, ChevronRight, Mail, Play, RotateCcw, Search, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { Toaster, toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePhase } from "@/context/PhaseContext"
import { sendEmail } from "@/lib/email"
import { generateResendNotificationHtml } from "@/lib/email-templates"
import { cn } from "@/lib/utils"
import { useMockStore } from "@/store/useMockStore"
import { SystemLog } from "@/types/claims"

function EmailBodyFrame({ log }: { log: SystemLog }) {
  const { activeIteration } = usePhase()
  const getStudentName = (email: string) => {
    if (email.includes("alice")) return "Alice Chen"
    if (email.includes("david")) return "David Lee"
    if (email.includes("emma")) return "Emma Stone"
    return null
  }

  const name = getStudentName(log.recipientEmail)
  const isSubmission = log.eventType === "CLAIM_SUBMISSION"
  const isApproval = log.emailSubject.includes("Approved")

  return (
    <div className="w-full overflow-hidden rounded-md border border-border bg-card font-sans shadow-sm">
      {/* Header Banner */}
      <div className="border-b border-border bg-primary px-6 py-4 text-center text-base font-bold tracking-wide text-primary-foreground">
        {activeIteration >= 2
          ? "MARS Student Administration"
          : "Community Merits Program"}
      </div>

      {/* Body Content */}
      <div className="space-y-4 p-6 text-sm leading-relaxed text-foreground">
        <p className="font-semibold">Dear {name || "Student"},</p>

        {isSubmission ? (
          <>
            <p>
              We have received your community merit claim and it is currently
              awaiting review by the Office of Student Affairs.
            </p>
            <p>
              Once the review process is complete, you will receive another
              update detailing the outcome of your claim.
            </p>
            <p>
              Thank you for your active participation and contributions to our
              community!
            </p>
          </>
        ) : isApproval ? (
          <>
            <p>Congratulations! Your merit claim has been approved.</p>
            <div className="space-y-2 rounded-md border border-border/50 bg-muted/50 p-4 font-medium">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points Awarded:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  +40 Points
                </span>
              </div>
              <div className="flex justify-between border-t border-border/30 pt-2">
                <span className="text-muted-foreground">
                  New Points Balance:
                </span>
                <span className="font-bold text-foreground">120 Points</span>
              </div>
            </div>
            <p>
              Thank you for your dedication to community involvement and
              excellence.
            </p>
          </>
        ) : (
          <>
            <p>
              Your merit claim has been reviewed. Unfortunately, it does not
              meet the guidelines for this category and has been rejected.
            </p>
            <div className="space-y-1 rounded-md border border-destructive/10 bg-destructive/5 p-4 text-destructive">
              <p className="text-xs font-semibold tracking-wider uppercase">
                Rejection Reason:
              </p>
              <p className="text-sm font-normal">
                Certificate proof missing or invalid.
              </p>
            </div>
            <p>
              Please resubmit with correct documentation or review the claim
              guidelines if applicable.
            </p>
          </>
        )}

        {/* Signature */}
        <div className="mt-6 space-y-0.5 border-t border-border pt-4 text-xs text-muted-foreground">
          <p className="font-semibold">
            {activeIteration >= 2
              ? "MARS Registrar"
              : "Office of Student Affairs"}
          </p>
          <p>
            {activeIteration >= 2
              ? "MARS Office of Records"
              : "Community Merits Commission"}
          </p>
        </div>
      </div>
    </div>
  )
}

const baseLogs: SystemLog[] = [
  {
    id: "log-1",
    timestamp: "2026-06-19 14:30:22",
    eventType: "CLAIM_SUBMISSION" as const,
    description: `Email dispatch: Claim Submission Confirmation for Clean Energy Project Presentation`,
    recipientEmail: "alice@student.edu",
    emailSubject: "Claim Submission Confirmation",
    emailBody: "",
    emailStatus: "DELIVERED" as const,
  },
  {
    id: "log-2",
    timestamp: "2026-06-18 10:15:45",
    eventType: "CLAIM_SUBMISSION" as const,
    description: `Email dispatch: Claim Submission Confirmation for Youth Coding Workshop Coordinator`,
    recipientEmail: "david@student.edu",
    emailSubject: "Claim Submission Confirmation",
    emailBody: "",
    emailStatus: "DELIVERED" as const,
  },
  {
    id: "log-3",
    timestamp: "2026-06-15 16:45:10",
    eventType: "CLAIM_DECISION" as const,
    description: `Email dispatch: Merit Claim Approved! (+40 points awarded)`,
    recipientEmail: "alice@student.edu",
    emailSubject: "Merit Claim Approved!",
    emailBody: "",
    emailStatus: "DELIVERED" as const,
  },
  {
    id: "log-4",
    timestamp: "2026-05-20 11:20:00",
    eventType: "CLAIM_DECISION" as const,
    description: `Email dispatch: Merit Claim Status Update (Rejection notification)`,
    recipientEmail: "alice@student.edu",
    emailSubject: "Merit Claim Status Update",
    emailBody: "",
    emailStatus: "DELIVERED" as const,
  },
  {
    id: "log-5",
    timestamp: "2026-06-20 10:00:00",
    eventType: "CLAIM_SUBMISSION" as const,
    description: `Email dispatch: Claim Submission Confirmation for Sports Day Volunteer`,
    recipientEmail: "emma@student.edu",
    emailSubject: "Claim Submission Confirmation",
    emailBody: "",
    emailStatus: "SENT" as const,
  },
  {
    id: "log-6",
    timestamp: "2026-06-14 09:12:33",
    eventType: "CLAIM_DECISION" as const,
    description: `Email dispatch: Merit Claim Status Update (Bounced delivery)`,
    recipientEmail: "invalid-student@bounced.edu",
    emailSubject: "Merit Claim Status Update",
    emailBody: "",
    emailStatus: "BOUNCED" as const,
  },
]

export default function AdminLogsPage() {
  const { activePhase, activeIteration } = usePhase()
  const store = useMockStore()

  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [eventFilter, setEventFilter] = useState("ALL")
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Local logs state for Phase 1 simulation
  const [localLogs, setLocalLogs] = useState<Record<number, SystemLog[]>>(
    () => ({
      1: [...baseLogs],
      2: [...baseLogs],
      3: [...baseLogs],
      4: [...baseLogs],
      5: [...baseLogs],
    })
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Initial Mock logs
  const getInitialLogs = (iteration: number): SystemLog[] => {
    return localLogs[iteration] || baseLogs
  }

  const handleAction = (actionName: string) => {
    if (!selectedLog) return

    if (activeIteration >= 5) {
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, "0")
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

      const emailSubject = selectedLog.emailSubject.startsWith(actionName)
        ? selectedLog.emailSubject
        : `${actionName}: ${selectedLog.emailSubject}`

      const newLog: SystemLog = {
        id: `log-${Date.now()}`,
        timestamp,
        eventType: selectedLog.eventType,
        description: `Email dispatch: ${actionName} for ${selectedLog.emailSubject}`,
        recipientEmail: selectedLog.recipientEmail,
        emailSubject,
        emailBody: "",
        emailStatus: "DELIVERED" as const,
      }

      setLocalLogs((prev) => {
        const updated = { ...prev }
        const currentLogs = prev[activeIteration] || baseLogs
        updated[activeIteration] = [newLog, ...currentLogs]
        return updated
      })

      if (activePhase !== 1) {
        store.addLog(newLog)
      }
    } else {
      const updatedLog = { ...selectedLog, emailStatus: "DELIVERED" as const }
      setSelectedLog(updatedLog)

      // Update locally in localLogs state
      setLocalLogs((prev) => {
        const updated = { ...prev }
        const currentLogs = prev[activeIteration] || []
        updated[activeIteration] = currentLogs.map((log) =>
          log.id === selectedLog.id
            ? { ...log, emailStatus: "DELIVERED" as const }
            : log
        )
        return updated
      })

      // Also update mock store if we are not in phase 1 claims
      if (activePhase !== 1) {
        useMockStore.setState((state) => {
          const updatedLogs = state.logs.map((log) =>
            log.id === selectedLog.id
              ? { ...log, emailStatus: "DELIVERED" as const }
              : log
          )
          const currentIter =
            state.claims === state.claims4
              ? 4
              : state.claims === state.claims3
                ? 3
                : state.claims === state.claims2
                  ? 2
                  : 1
          if (currentIter === 4) {
            return { logs: updatedLogs, logs4: updatedLogs }
          } else if (currentIter === 3) {
            return { logs: updatedLogs, logs3: updatedLogs }
          } else if (currentIter === 2) {
            return { logs: updatedLogs, logs2: updatedLogs }
          } else {
            return { logs: updatedLogs, logs1: updatedLogs }
          }
        })
      }
    }

    if (activeIteration >= 4 && activePhase === 3) {
      const html = generateResendNotificationHtml(
        selectedLog.recipientEmail,
        selectedLog.emailSubject,
        actionName
      )
      sendEmail({
        to: selectedLog.recipientEmail,
        subject: selectedLog.emailSubject.startsWith(actionName)
          ? selectedLog.emailSubject
          : `${actionName}: ${selectedLog.emailSubject}`,
        html,
      }).then((res) => {
        if (res.error) {
          if (activeIteration >= 5) {
            toast.error("Could not execute action. Try again")
          } else {
            toast.error(`Failed to execute ${actionName}`)
          }
        } else {
          if (activeIteration >= 5) {
            toast.success("Email sent")
          } else {
            toast.success(`${actionName} sent successfully!`)
          }
        }
      })
    } else {
      if (activeIteration >= 5) {
        toast.success("Email sent")
      } else {
        toast.success(`${actionName} Success`, {
          description: `Log status has been updated to DELIVERED.`,
        })
      }
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="font-medium text-muted-foreground">Loading logs...</div>
      </div>
    )
  }

  const isPhase1Claims = activePhase === 1

  // Select logs list
  const logsList = isPhase1Claims ? getInitialLogs(activeIteration) : store.logs

  // Filter logs based on search criteria and selections
  const filteredLogs = logsList.filter((log) => {
    const matchesSearch =
      log.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.emailSubject.toLowerCase().includes(search.toLowerCase()) ||
      log.eventType.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "ALL" || log.emailStatus === statusFilter
    const matchesEvent = eventFilter === "ALL" || log.eventType === eventFilter

    return matchesSearch && matchesStatus && matchesEvent
  })

  // Pagination calculation
  const totalItems = filteredLogs.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex)



  // Simulated notification triggers for testability
  const handleSimulateDispatch = () => {
    const randomEvent =
      Math.random() > 0.5 ? "CLAIM_SUBMISSION" : "CLAIM_DECISION"
    const randomRecipient =
      Math.random() > 0.6
        ? "emma@student.edu"
        : Math.random() > 0.3
          ? "david@student.edu"
          : "invalid-student@bounced.edu"
    const randomStatus = randomRecipient.includes("bounced")
      ? "BOUNCED"
      : Math.random() > 0.2
        ? "DELIVERED"
        : "SENT"

    let subject = ""
    if (randomEvent === "CLAIM_SUBMISSION") {
      subject = "Claim Submission Confirmation"
    } else {
      subject =
        Math.random() > 0.5
          ? "Merit Claim Approved!"
          : "Merit Claim Status Update"
    }

    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp,
      eventType: randomEvent,
      description: `Email dispatch: ${subject} for simulated transaction`,
      recipientEmail: randomRecipient,
      emailSubject: subject,
      emailBody: "",
      emailStatus: randomStatus,
    }

    if (isPhase1Claims) {
      setLocalLogs((prev) => ({
        ...prev,
        [activeIteration]: [newLog, ...(prev[activeIteration] || [])],
      }))
    } else {
      store.addLog(newLog)
    }
  }

  // Status Badge Helper
  const getStatusBadge = (status: SystemLog["emailStatus"]) => {
    switch (status) {
      case "DELIVERED":
        return (
          <Badge
            className="border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
            variant="outline"
          >
            DELIVERED
          </Badge>
        )
      case "SENT":
        return (
          <Badge
            className="border-blue-500/20 bg-blue-500/10 font-medium text-blue-600 dark:text-blue-400"
            variant="outline"
          >
            SENT
          </Badge>
        )
      case "BOUNCED":
        return (
          <Badge
            className="border-destructive/20 bg-destructive/10 font-medium text-destructive"
            variant="outline"
          >
            BOUNCED
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Stats calculation
  const totalCount = logsList.length
  const deliveredCount = logsList.filter(
    (l) => l.emailStatus === "DELIVERED"
  ).length
  const sentCount = logsList.filter((l) => l.emailStatus === "SENT").length
  const bouncedCount = logsList.filter(
    (l) => l.emailStatus === "BOUNCED"
  ).length

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {activeIteration >= 2 ? "System logs" : "System activity logs"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor system events and email delivery status.
          </p>
        </div>
        {!(activeIteration >= 4 && activePhase === 3) && (
          <Button
            onClick={handleSimulateDispatch}
            className="flex cursor-pointer items-center gap-1.5 sm:self-end"
          >
            <Play className="h-4 w-4 fill-current" />
            Simulate dispatch
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">Logged events</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {deliveredCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Sent emails delivered
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {sentCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Emails sent
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivery failures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {bouncedCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Could not deliver emails
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-9"
          />
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {(search || statusFilter !== "ALL" || eventFilter !== "ALL") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("")
                setStatusFilter("ALL")
                setEventFilter("ALL")
                setCurrentPage(1)
              }}
              className="h-9 cursor-pointer px-2 text-muted-foreground lg:px-3"
            >
              Reset
              <RotateCcw className="ml-2 h-4 w-4" />
            </Button>
          )}

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[140px] cursor-pointer">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="ALL">
                All statuses
              </SelectItem>
              <SelectItem className="cursor-pointer" value="DELIVERED">
                Delivered
              </SelectItem>
              <SelectItem className="cursor-pointer" value="SENT">
                Sent
              </SelectItem>
              <SelectItem className="cursor-pointer" value="BOUNCED">
                Bounced
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={eventFilter}
            onValueChange={(val) => {
              setEventFilter(val)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="All event types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="ALL">
                All event types
              </SelectItem>
              <SelectItem className="cursor-pointer" value="CLAIM_SUBMISSION">
                Claim submission
              </SelectItem>
              <SelectItem className="cursor-pointer" value="CLAIM_DECISION">
                Claim decision
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} logs
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 cursor-pointer"
                  onClick={() => {
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-semibold">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 cursor-pointer"
                  onClick={() => {
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[180px]">Event type</TableHead>
                <TableHead className="w-[200px]">Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No matching logs found in system registry.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-semibold",
                          log.eventType === "CLAIM_SUBMISSION"
                            ? "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400"
                            : "border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400"
                        )}
                      >
                        {log.eventType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate font-medium">
                      {log.recipientEmail}
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {log.emailSubject}
                    </TableCell>
                    <TableCell>{getStatusBadge(log.emailStatus)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="cursor-pointer"
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Email Inspector (Slide-out Drawer) */}
      <Drawer
        direction="right"
        open={!!selectedLog}
        onOpenChange={(open) => !open && setSelectedLog(null)}
      >
        <DrawerContent
          className={cn(
            activeIteration >= 4 &&
              "data-[vaul-drawer-direction=right]:sm:max-w-[35vw]"
          )}
        >
          <div className="flex h-full flex-col overflow-hidden">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
                <Mail className="text-primary" />
                <span>Inspect email</span>
              </DrawerTitle>
            </DrawerHeader>

            {selectedLog && (
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-5">
                  {/* SMTP Header Details */}
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-xs">
                    <span className="font-medium text-muted-foreground">
                      From
                    </span>
                    <span className="truncate text-foreground">
                      no-reply@mars.upm.edu.my
                    </span>

                    <span className="font-medium text-muted-foreground">
                      To
                    </span>
                    <span className="truncate text-foreground">
                      {selectedLog.recipientEmail}
                    </span>

                    <span className="font-medium text-muted-foreground">
                      Subject
                    </span>
                    <span className="truncate font-semibold text-foreground">
                      {selectedLog.emailSubject}
                    </span>

                    <span className="font-medium text-muted-foreground">
                      Date
                    </span>
                    <span className="text-foreground">
                      {selectedLog.timestamp}
                    </span>

                    <span className="font-medium text-muted-foreground">
                      Status
                    </span>
                    <span>{getStatusBadge(selectedLog.emailStatus)}</span>
                  </div>

                  <Separator />

                  {/* Email Preview */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground">
                      Email preview
                    </span>
                    <EmailBodyFrame log={selectedLog} />
                  </div>
                </div>
              </div>
            )}

            <DrawerFooter>
              <div className="flex w-full flex-row items-center justify-between">
                <DrawerClose asChild>
                  <Button variant="outline" className="cursor-pointer">
                    Close
                  </Button>
                </DrawerClose>

                {/* Action buttons inside the preview card */}
                {selectedLog &&
                  (selectedLog.emailStatus === "BOUNCED" ||
                    selectedLog.emailStatus === "SENT" ||
                    selectedLog.emailStatus === "DELIVERED") && (
                    <div className="flex flex-col gap-2 p-4">
                      {selectedLog.emailStatus === "BOUNCED" && (
                        <Button
                          variant="destructive"
                          className="w-full cursor-pointer"
                          onClick={() => handleAction("Retry delivery")}
                        >
                          <Send />
                          Retry delivery
                        </Button>
                      )}
                      {selectedLog.emailStatus === "SENT" && (
                        <Button
                          variant="default"
                          className="w-full cursor-pointer"
                          onClick={() => handleAction("Force send")}
                        >
                          <CheckCircle2 />
                          Force send
                        </Button>
                      )}
                      {selectedLog.emailStatus === "DELIVERED" && (
                        <Button
                          variant="secondary"
                          className="w-full cursor-pointer"
                          onClick={() => handleAction("Resend email")}
                        >
                          <RotateCcw />
                          Resend email
                        </Button>
                      )}
                    </div>
                  )}
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <Toaster position="top-right" closeButton={activeIteration < 5} richColors />
    </div>
  )
}
