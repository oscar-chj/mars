"use client"

import { CheckCircle2, Mail, Play, RotateCcw, Search, Send } from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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
        {activeIteration === 2 || activeIteration === 3
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
            {activeIteration === 2 || activeIteration === 3
              ? "MARS Registrar"
              : "Office of Student Affairs"}
          </p>
          <p>
            {activeIteration === 2 || activeIteration === 3
              ? "MARS Office of Records"
              : "Community Merits Commission"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLogsPage() {
  const { activePhase, activeIteration } = usePhase()
  const store = useMockStore()

  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [eventFilter, setEventFilter] = useState("ALL")
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null)

  // Local logs state for Phase 1 simulation
  const [localLogs, setLocalLogs] = useState<Record<number, SystemLog[]>>({
    1: [],
    2: [],
    3: [],
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Initial Mock logs
  const getInitialLogs = (iteration: number): SystemLog[] => {
    const base = [
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

    return [...localLogs[iteration], ...base]
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
      eventType: randomEvent as never,
      description: `Email dispatch: ${subject} for simulated transaction`,
      recipientEmail: randomRecipient,
      emailSubject: subject,
      emailBody: "",
      emailStatus: randomStatus as never,
    }

    if (isPhase1Claims) {
      setLocalLogs((prev) => ({
        ...prev,
        [1]: [newLog, ...prev[1]],
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
            {activeIteration === 2 || activeIteration === 3 ? "System Logs" : "System Activity Logs"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor system events and email delivery status.
          </p>
        </div>
        <Button
          onClick={handleSimulateDispatch}
          className="flex cursor-pointer items-center gap-1.5 sm:self-end"
        >
          <Play className="h-4 w-4 fill-current" />
          Simulate Dispatch
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
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
              Sent emails successfully delivered
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
              Emails sent out
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Delivery Failures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {bouncedCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Failed delivery attempts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              }}
              className="h-9 cursor-pointer px-2 text-muted-foreground lg:px-3"
            >
              Reset
              <RotateCcw className="ml-2 h-4 w-4" />
            </Button>
          )}

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="ALL">
                All Statuses
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

          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="All Event Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="ALL">
                All Event Types
              </SelectItem>
              <SelectItem className="cursor-pointer" value="CLAIM_SUBMISSION">
                Claim Submission
              </SelectItem>
              <SelectItem className="cursor-pointer" value="CLAIM_DECISION">
                Claim Decision
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="overflow-hidden border shadow-sm">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[180px]">Event Type</TableHead>
                <TableHead className="w-[200px]">Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    No matching logs found in system registry.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
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
      {selectedLog && (
        <Drawer
          direction="right"
          open={!!selectedLog}
          onOpenChange={(open) => !open && setSelectedLog(null)}
        >
          <DrawerContent className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto sm:max-w-[35vw]">
            <DrawerHeader className="border-b border-border pb-4">
              <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
                <Mail className="h-5 w-5 text-primary" />
                <span>Email Inspector</span>
              </DrawerTitle>
              <DrawerDescription>
                View email details and delivery headers.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 space-y-6 py-6">
              {/* SMTP Header Details */}
              <div className="space-y-2.5 rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs">
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 font-semibold text-muted-foreground">
                    FROM:
                  </span>
                  <span className="truncate text-foreground">
                    no-reply@communitymerits.edu
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 font-semibold text-muted-foreground">
                    TO:
                  </span>
                  <span className="truncate text-foreground">
                    {selectedLog.recipientEmail}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 font-semibold text-muted-foreground">
                    SUBJECT:
                  </span>
                  <span className="truncate font-bold text-foreground">
                    {selectedLog.emailSubject}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="shrink-0 font-semibold text-muted-foreground">
                    DATE:
                  </span>
                  <span className="text-foreground">
                    {selectedLog.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-2.5">
                  <span className="font-semibold text-muted-foreground">
                    STATUS:
                  </span>
                  <span>{getStatusBadge(selectedLog.emailStatus)}</span>
                </div>
              </div>

              {/* Email Body Frame */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Email Preview
                </span>
                <div className="overflow-hidden rounded-lg border border-border bg-zinc-50 p-4 shadow-inner sm:p-6 dark:bg-zinc-950">
                  <EmailBodyFrame log={selectedLog} />
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-auto flex gap-2 border-t border-border pt-4">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={() => setSelectedLog(null)}
              >
                Close
              </Button>
              {selectedLog.emailStatus === "BOUNCED" && (
                <Button
                  variant="destructive"
                  className="flex flex-grow cursor-pointer items-center justify-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  Retry Delivery
                </Button>
              )}
              {selectedLog.emailStatus === "SENT" && (
                <Button
                  variant="default"
                  className="flex flex-grow cursor-pointer items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Force Send
                </Button>
              )}
              {selectedLog.emailStatus === "DELIVERED" && (
                <Button
                  variant="secondary"
                  className="flex flex-grow cursor-pointer items-center justify-center gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resend Email
                </Button>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}
