"use client"

import React, { useState, useEffect } from "react"
import { Shield, Search, Mail, AlertCircle, CheckCircle2, Clock, RotateCcw, Send, Play } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SystemLog } from "@/types/claims"
import { cn } from "@/lib/utils"
import { usePhase } from "@/context/PhaseContext"
import { useMockStore } from "@/store/useMockStore"

function EmailBodyFrame({ log }: { log: SystemLog }) {
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
    <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden w-full font-sans">
      {/* Header Banner */}
      <div className="bg-primary text-primary-foreground py-4 px-6 text-center font-bold tracking-wide border-b border-border text-base">
        Community Merits Program
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-4 text-foreground text-sm leading-relaxed">
        <p className="font-semibold">
          Dear {name || "Student"},
        </p>

        {isSubmission ? (
          <>
            <p>
              We have received your community merit claim and it is currently awaiting review by the Office of Student Affairs.
            </p>
            <p>
              Once the review process is complete, you will receive another update detailing the outcome of your claim.
            </p>
            <p>
              Thank you for your active participation and contributions to our community!
            </p>
          </>
        ) : isApproval ? (
          <>
            <p>
              Congratulations! Your merit claim has been approved.
            </p>
            <div className="bg-muted/50 p-4 rounded-md border border-border/50 space-y-2 font-medium">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Points Awarded:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">+40 Points</span>
              </div>
              <div className="flex justify-between border-t border-border/30 pt-2">
                <span className="text-muted-foreground">New Points Balance:</span>
                <span className="text-foreground font-bold">120 Points</span>
              </div>
            </div>
            <p>
              Thank you for your dedication to community involvement and excellence.
            </p>
          </>
        ) : (
          <>
            <p>
              Your merit claim has been reviewed. Unfortunately, it does not meet the guidelines for this category and has been rejected.
            </p>
            <div className="bg-destructive/5 text-destructive p-4 rounded-md border border-destructive/10 space-y-1">
              <p className="font-semibold text-xs uppercase tracking-wider">Rejection Reason:</p>
              <p className="text-sm font-normal">Certificate proof missing or invalid.</p>
            </div>
            <p>
              Please resubmit with correct documentation or review the claim guidelines if applicable.
            </p>
          </>
        )}

        {/* Signature */}
        <div className="border-t border-border pt-4 mt-6 text-xs text-muted-foreground space-y-0.5">
          <p className="font-semibold">Office of Student Affairs</p>
          <p>Community Merits Commission</p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLogsPage() {
  const { activePhase } = usePhase()
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
    setMounted(true)
  }, [])

  // Initial Mock logs
  const getInitialLogs = (iteration: number): SystemLog[] => {
    const isIteration1 = iteration === 1
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
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-muted-foreground font-medium">Loading logs...</div>
      </div>
    )
  }

  const isPhase1Claims = activePhase === 1

  // Select logs list
  const logsList = isPhase1Claims
    ? getInitialLogs(1)
    : store.logs

  // Filter logs based on search criteria and selections
  const filteredLogs = logsList.filter((log) => {
    const matchesSearch =
      log.recipientEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.emailSubject.toLowerCase().includes(search.toLowerCase()) ||
      log.eventType.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "ALL" || log.emailStatus === statusFilter
    const matchesEvent = eventFilter === "ALL" || log.eventType === eventFilter

    return matchesSearch && matchesStatus && matchesEvent
  })

  // Simulated notification triggers for testability
  const handleSimulateDispatch = () => {
    const randomEvent = Math.random() > 0.5 ? "CLAIM_SUBMISSION" : "CLAIM_DECISION"
    const randomRecipient = Math.random() > 0.6 ? "emma@student.edu" : Math.random() > 0.3 ? "david@student.edu" : "invalid-student@bounced.edu"
    const randomStatus = randomRecipient.includes("bounced") ? "BOUNCED" : Math.random() > 0.2 ? "DELIVERED" : "SENT"

    let subject = ""
    if (randomEvent === "CLAIM_SUBMISSION") {
      subject = "Claim Submission Confirmation"
    } else {
      subject = Math.random() > 0.5 ? "Merit Claim Approved!" : "Merit Claim Status Update"
    }

    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

    const newLog: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp,
      eventType: randomEvent as any,
      description: `Email dispatch: ${subject} for simulated transaction`,
      recipientEmail: randomRecipient,
      emailSubject: subject,
      emailBody: "",
      emailStatus: randomStatus as any,
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
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium" variant="outline">
            DELIVERED
          </Badge>
        )
      case "SENT":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-medium" variant="outline">
            SENT
          </Badge>
        )
      case "BOUNCED":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-medium" variant="outline">
            BOUNCED
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Stats calculation
  const totalCount = logsList.length
  const deliveredCount = logsList.filter((l) => l.emailStatus === "DELIVERED").length
  const sentCount = logsList.filter((l) => l.emailStatus === "SENT").length
  const bouncedCount = logsList.filter((l) => l.emailStatus === "BOUNCED").length

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Audit Logs & SMTP Tracker
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Track system transactions, transactional email delivery statuses, and audit email logs.
          </p>
        </div>
        <Button onClick={handleSimulateDispatch} className="sm:self-end flex items-center gap-1.5 cursor-pointer">
          <Play className="h-4 w-4 fill-current" />
          Simulate Dispatch
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Audit logs recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{deliveredCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Successful SMTP transmissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outgoing / Sent</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">In transit or queued</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounced</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{bouncedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Failed delivery attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by recipient, subject, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] cursor-pointer">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="ALL">All Statuses</SelectItem>
              <SelectItem className="cursor-pointer" value="DELIVERED">Delivered</SelectItem>
              <SelectItem className="cursor-pointer" value="SENT">Sent</SelectItem>
              <SelectItem className="cursor-pointer" value="BOUNCED">Bounced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="All Event Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="ALL">All Event Types</SelectItem>
              <SelectItem className="cursor-pointer" value="CLAIM_SUBMISSION">Claim Submission</SelectItem>
              <SelectItem className="cursor-pointer" value="CLAIM_DECISION">Claim Decision</SelectItem>
            </SelectContent>
          </Select>

          {(search || statusFilter !== "ALL" || eventFilter !== "ALL") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("")
                setStatusFilter("ALL")
                setEventFilter("ALL")
              }}
              className="h-9 px-2 lg:px-3 text-muted-foreground cursor-pointer"
            >
              Reset
              <RotateCcw className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[180px]">Event Type</TableHead>
                <TableHead className="w-[200px]">Recipient</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="text-right w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No matching logs found in system registry.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
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
                    <TableCell className="font-medium truncate max-w-[200px]">{log.recipientEmail}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{log.emailSubject}</TableCell>
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
        <Drawer direction="right" open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
          <DrawerContent className="sm:max-w-md md:max-w-lg flex flex-col h-full overflow-y-auto">
            <DrawerHeader className="pb-4 border-b border-border">
              <DrawerTitle className="flex items-center gap-2 text-xl font-bold">
                <Mail className="h-5 w-5 text-primary" />
                <span>Email Inspector</span>
              </DrawerTitle>
              <DrawerDescription>
                Inspect details of the transactional email template and SMTP headers.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 py-6 space-y-6">
              {/* SMTP Header Details */}
              <div className="space-y-2.5 bg-muted/40 p-4 rounded-lg border border-border text-xs font-mono">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground font-semibold shrink-0">FROM:</span>
                  <span className="text-foreground truncate">no-reply@communitymerits.edu</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground font-semibold shrink-0">TO:</span>
                  <span className="text-foreground truncate">{selectedLog.recipientEmail}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground font-semibold shrink-0">SUBJECT:</span>
                  <span className="text-foreground font-bold truncate">{selectedLog.emailSubject}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground font-semibold shrink-0">DATE:</span>
                  <span className="text-foreground">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-border/50">
                  <span className="text-muted-foreground font-semibold">STATUS:</span>
                  <span>{getStatusBadge(selectedLog.emailStatus)}</span>
                </div>
              </div>

              {/* Email Body Frame */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Email Body Frame (HTML Preview)
                </span>
                <div className="border border-border rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 shadow-inner">
                  <EmailBodyFrame log={selectedLog} />
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="border-t border-border pt-4 mt-auto flex gap-2">
              <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
              {selectedLog.emailStatus === "BOUNCED" && (
                <Button variant="destructive" className="flex-grow flex items-center justify-center gap-1.5 cursor-pointer">
                  <Send className="h-4 w-4" />
                  Retry Delivery
                </Button>
              )}
              {selectedLog.emailStatus === "SENT" && (
                <Button variant="default" className="flex-grow flex items-center justify-center gap-1.5 cursor-pointer">
                  <CheckCircle2 className="h-4 w-4" />
                  Force Send
                </Button>
              )}
              {selectedLog.emailStatus === "DELIVERED" && (
                <Button variant="secondary" className="flex-grow flex items-center justify-center gap-1.5 cursor-pointer">
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
