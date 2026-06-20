"use client"

import React, { useState, useEffect } from "react"
import { Award, Clock, CheckCircle2, Plus, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
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
import { useMockStore } from "@/store/useMockStore"
import { Claim, Student } from "@/types/claims"

export default function StudentDashboardPage() {
  const { activePhase } = usePhase()
  const store = useMockStore()
  
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [eventName, setEventName] = useState("")
  const [category, setCategory] = useState<'VOLUNTEERING' | 'SPORTS' | 'CULTURAL' | 'ACADEMIC'>("VOLUNTEERING")
  const [rawDateString, setRawDateString] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileBase64, setFileBase64] = useState("")

  // Local state for Phase 1 simulation
  const [localClaims, setLocalClaims] = useState<Record<number, Claim[]>>({
    1: [],
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Initial Mock Claims (Phase 1)
  const getPhase1Claims = (iteration: number): Claim[] => {
    const base = [
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

    return [...localClaims[iteration], ...base]
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-muted-foreground font-medium">Loading dashboard...</div>
      </div>
    )
  }

  // Load from store or local state based on Phase
  const isPhase1 = activePhase === 1

  const activeStudent: Student = isPhase1
    ? {
        id: "alice",
        name: "Alice Chen",
        email: "alice@student.edu",
        matricNumber: "U2320491A",
        points: 120,
      }
    : store.students["alice"] || {
        id: "alice",
        name: "Alice Chen",
        email: "alice@student.edu",
        matricNumber: "U2320491A",
        points: 120,
      }

  const claimsList = isPhase1
    ? getPhase1Claims(1)
    : store.claims.filter((c) => c.studentId === "alice")

  // Calculated Stats
  const totalPoints = activeStudent.points
  const pendingCount = claimsList.filter((c) => c.status === "PENDING").length
  const approvedCount = claimsList.filter((c) => c.status === "APPROVED").length

  // File Selector handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // File upload Base64 reader
      const reader = new FileReader()
      reader.onloadend = () => {
        setFileBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Claim Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formattedDate = rawDateString
    if (!formattedDate) return

    const newClaimPayload = {
      studentId: "alice",
      studentName: "Alice Chen",
      eventName,
      category,
      date: formattedDate,
      organizer,
      proofFileName: fileName || "proof_certificate.png",
      proofBase64: fileBase64,
    }

    if (isPhase1) {
      const newClaim: Claim = {
        ...newClaimPayload,
        id: `local-claim-${Date.now()}`,
        status: "PENDING",
        pointsAwarded: null,
      }
      setLocalClaims((prev) => ({
        ...prev,
        [1]: [newClaim, ...prev[1]],
      }))
    } else {
      store.submitClaim(newClaimPayload)
    }

    // Reset Form & Close Dialog
    setEventName("")
    setCategory("VOLUNTEERING")
    setRawDateString("")
    setFileName("")
    setFileBase64("")
    setIsOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 font-medium" variant="outline">
            PENDING
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 font-medium" variant="outline">
            APPROVED
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 font-medium" variant="outline">
            REJECTED
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
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
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {activeStudent.name}!</h1>
          <p className="text-muted-foreground mt-1">Matric: {activeStudent.matricNumber}</p>
        </div>

        {/* Claim Community Merit Button & Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-sm cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Claim Community Merit</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Claim Community Merit</DialogTitle>
              <DialogDescription>
                Submit details and proof for your community activity to earn merit points.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  placeholder="e.g. Charity Food Drive 2026"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VOLUNTEERING">VOLUNTEERING</SelectItem>
                    <SelectItem value="SPORTS">SPORTS</SelectItem>
                    <SelectItem value="CULTURAL">CULTURAL</SelectItem>
                    <SelectItem value="ACADEMIC">ACADEMIC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={rawDateString}
                  onChange={(e) => setRawDateString(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  placeholder="e.g. Rotary Club / Youth Council"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Proof File Upload</Label>
                <Label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      {fileName ? `Selected: ${fileName}` : "Drag & drop your certificate here, or click to browse."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: PNG, JPG (max 5MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="cursor-pointer">Submit Claim</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cumulative Merits</CardTitle>
            <Award className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{totalPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">Total points earned to date</p>
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            <Clock className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Claims awaiting admin review</p>
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved Claims</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{approvedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Claims verified by administration</p>
          </CardContent>
        </Card>
      </div>

      {/* Claims Table Card */}
      <Card className="border shadow-xs">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Your Merit Activities</CardTitle>
          <CardDescription>A comprehensive history of your submitted community service claims.</CardDescription>
        </CardHeader>
        <CardContent>
          {claimsList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No merit claims recorded yet. Click &quot;Claim Community Merit&quot; above to log your first activity.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date of Activity</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claimsList.map((claim) => (
                    <TableRow key={claim.id} className="transition-colors hover:bg-muted/40">
                      <TableCell className="font-semibold text-foreground">{claim.eventName}</TableCell>
                      <TableCell>{getCategoryBadge(claim.category)}</TableCell>
                      <TableCell className="text-muted-foreground">{claim.date}</TableCell>
                      <TableCell className="text-muted-foreground">{claim.organizer}</TableCell>
                      <TableCell>{getStatusBadge(claim.status)}</TableCell>
                      <TableCell className="text-right font-bold text-foreground">
                        {claim.pointsAwarded !== null ? `+${claim.pointsAwarded}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
