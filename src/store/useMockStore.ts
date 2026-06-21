import { Claim, Student, SystemLog } from "@/types/claims"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface MockStore {
  claims: Claim[]
  students: Record<string, Student>
  logs: SystemLog[]

  claims1: Claim[]
  students1: Record<string, Student>
  logs1: SystemLog[]

  claims2: Claim[]
  students2: Record<string, Student>
  logs2: SystemLog[]

  claims3: Claim[]
  students3: Record<string, Student>
  logs3: SystemLog[]

  claims4: Claim[]
  students4: Record<string, Student>
  logs4: SystemLog[]

  submitClaim: (
    claim: Omit<Claim, "id" | "status" | "pointsAwarded"> & { id?: string }
  ) => void
  approveClaim: (claimId: string, points: number) => void
  rejectClaim: (claimId: string) => void
  addLog: (log: SystemLog) => void
  resetStore: () => void
  setIteration: (iteration: number) => void
}

const getActiveIteration = (): number => {
  if (typeof window !== "undefined") {
    try {
      const active = window.localStorage.getItem("mars_iteration")
      if (active === "2") {
        return 2
      }
      if (active === "3") {
        return 3
      }
      if (active === "4") {
        return 4
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Ignore localStorage error if any (e.g. security sandboxing)
    }
  }
  return 1
}

const getInitialStudents = (iteration: number): Record<string, Student> => {
  const isIteration2 = iteration === 2 || iteration === 3 || iteration === 4
  return {
    alice: {
      id: "alice",
      name: "Alice Chen",
      email: "alice@student.edu",
      matricNumber: isIteration2 ? "BC223014" : "U2320491A",
      points: iteration === 4 ? 40 : 120,
    },
    david: {
      id: "david",
      name: "David Lee",
      email: "david@student.edu",
      matricNumber: isIteration2 ? "BC223055" : "U2320555D",
      points: 0,
    },
    emma: {
      id: "emma",
      name: "Emma Stone",
      email: "emma@student.edu",
      matricNumber: isIteration2 ? "BC223099" : "U2320999E",
      points: 0,
    },
  }
}

const getInitialClaims = (): Claim[] => [
  {
    id: "claim-1",
    studentId: "alice",
    studentName: "Alice Chen",
    eventName: "Clean Energy Project Presentation",
    category: "ACADEMIC",
    date: "2026-06-19",
    organizer: "Science Department",
    proofFileName: "clean_energy_presentation.pdf",
    proofBase64: "",
    pointsAwarded: null,
    status: "PENDING",
  },
  {
    id: "claim-2",
    studentId: "david",
    studentName: "David Lee",
    eventName: "Youth Coding Workshop Coordinator",
    category: "ACADEMIC",
    date: "2026-06-18",
    organizer: "School of Computing",
    proofFileName: "youth_coding_workshop.pdf",
    proofBase64: "",
    pointsAwarded: null,
    status: "PENDING",
  },
  {
    id: "claim-3",
    studentId: "emma",
    studentName: "Emma Stone",
    eventName: "Sports Day Volunteer",
    category: "VOLUNTEERING",
    date: "2026-06-12",
    organizer: "Sports Club",
    proofFileName: "sports_volunteer_cert.pdf",
    proofBase64: "",
    pointsAwarded: null,
    status: "PENDING",
  },
  {
    id: "claim-4",
    studentId: "alice",
    studentName: "Alice Chen",
    eventName: "Food Bank Drive",
    category: "VOLUNTEERING",
    date: "2026-06-15",
    organizer: "National Food Drive",
    proofFileName: "food_bank_drive_merit.pdf",
    proofBase64: "",
    pointsAwarded: 40,
    status: "APPROVED",
  },
  {
    id: "claim-5",
    studentId: "alice",
    studentName: "Alice Chen",
    eventName: "Charity Bazaar Coordinator",
    category: "VOLUNTEERING",
    date: "2026-05-20",
    organizer: "Rotary Club",
    proofFileName: "charity_bazaar_volunteering.pdf",
    proofBase64: "",
    pointsAwarded: null,
    status: "REJECTED",
  },
]

const getInitialLogs = (): SystemLog[] => [
  {
    id: "log-1",
    timestamp: "2026-06-19 14:30:22",
    eventType: "CLAIM_SUBMISSION",
    description: `Email dispatch: Claim Submission Confirmation for Clean Energy Project Presentation`,
    recipientEmail: "alice@student.edu",
    emailSubject: "Claim Submission Confirmation",
    emailBody: "",
    emailStatus: "DELIVERED",
  },
  {
    id: "log-2",
    timestamp: "2026-06-18 10:15:45",
    eventType: "CLAIM_SUBMISSION",
    description: `Email dispatch: Claim Submission Confirmation for Youth Coding Workshop Coordinator`,
    recipientEmail: "david@student.edu",
    emailSubject: "Claim Submission Confirmation",
    emailBody: "",
    emailStatus: "DELIVERED",
  },
  {
    id: "log-3",
    timestamp: "2026-06-15 16:45:10",
    eventType: "CLAIM_DECISION",
    description: `Email dispatch: Merit Claim Approved! (+40 points awarded)`,
    recipientEmail: "alice@student.edu",
    emailSubject: "Merit Claim Approved!",
    emailBody: "",
    emailStatus: "DELIVERED",
  },
  {
    id: "log-4",
    timestamp: "2026-05-20 11:20:00",
    eventType: "CLAIM_DECISION",
    description: `Email dispatch: Merit Claim Status Update (Rejection notification)`,
    recipientEmail: "alice@student.edu",
    emailSubject: "Merit Claim Status Update",
    emailBody: "",
    emailStatus: "DELIVERED",
  },
  {
    id: "log-5",
    timestamp: "2026-06-20 10:00:00",
    eventType: "CLAIM_SUBMISSION",
    description: `Email dispatch: Claim Submission Confirmation for Sports Day Volunteer`,
    recipientEmail: "emma@student.edu",
    emailSubject: "Claim Submission Confirmation",
    emailBody: "",
    emailStatus: "SENT",
  },
  {
    id: "log-6",
    timestamp: "2026-06-14 09:12:33",
    eventType: "CLAIM_DECISION",
    description: `Email dispatch: Merit Claim Status Update (Bounced delivery)`,
    recipientEmail: "invalid-student@bounced.edu",
    emailSubject: "Merit Claim Status Update",
    emailBody: "",
    emailStatus: "BOUNCED",
  },
]

const getFormattedDate = (dateObj: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`
}

export const useMockStore = create<MockStore>()(
  persist(
    (set) => ({
      claims1: getInitialClaims(),
      students1: getInitialStudents(1),
      logs1: getInitialLogs(),

      claims2: getInitialClaims(),
      students2: getInitialStudents(2),
      logs2: getInitialLogs(),

      claims3: getInitialClaims(),
      students3: getInitialStudents(2),
      logs3: getInitialLogs(),

      claims4: getInitialClaims(),
      students4: getInitialStudents(4),
      logs4: getInitialLogs(),

      claims: getInitialClaims(),
      students: getInitialStudents(getActiveIteration()),
      logs: getInitialLogs(),

      submitClaim: (claim) =>
        set((state) => {
          const claimId = claim.id || `claim-${Date.now()}`
          const newClaim: Claim = {
            ...claim,
            id: claimId,
            status: "PENDING",
            pointsAwarded: null,
          }

          const now = new Date()
          const timestamp = getFormattedDate(now)

          const newLog: SystemLog = {
            id: `log-${Date.now()}`,
            timestamp,
            eventType: "CLAIM_SUBMISSION",
            description: `Email dispatch: Claim Submission Confirmation for ${claim.eventName}`,
            recipientEmail:
              claim.studentId === "alice"
                ? "alice@student.edu"
                : claim.studentId === "david"
                  ? "david@student.edu"
                  : "emma@student.edu",
            emailSubject: "Claim Submission Confirmation",
            emailBody: "",
            emailStatus: "DELIVERED",
          }

          const activeIteration = getActiveIteration()
          const newClaims = [newClaim, ...state.claims]
          const newLogs = [newLog, ...state.logs]

          if (activeIteration === 4) {
            return {
              claims: newClaims,
              logs: newLogs,
              claims4: newClaims,
              logs4: newLogs,
            }
          } else if (activeIteration === 3) {
            return {
              claims: newClaims,
              logs: newLogs,
              claims3: newClaims,
              logs3: newLogs,
            }
          } else if (activeIteration === 2) {
            return {
              claims: newClaims,
              logs: newLogs,
              claims2: newClaims,
              logs2: newLogs,
            }
          } else {
            return {
              claims: newClaims,
              logs: newLogs,
              claims1: newClaims,
              logs1: newLogs,
            }
          }
        }),

      approveClaim: (claimId, points) =>
        set((state) => {
          const updatedClaims = state.claims.map((c) =>
            c.id === claimId
              ? { ...c, status: "APPROVED" as const, pointsAwarded: points }
              : c
          )

          const targetClaim = state.claims.find((c) => c.id === claimId)
          if (!targetClaim) return {}

          // Update student points
          const studentId = targetClaim.studentId
          const currentStudent = state.students[studentId]
          const updatedStudents = { ...state.students }
          if (currentStudent) {
            updatedStudents[studentId] = {
              ...currentStudent,
              points: currentStudent.points + points,
            }
          }

          const now = new Date()
          const timestamp = getFormattedDate(now)

          const newLog: SystemLog = {
            id: `log-${Date.now()}`,
            timestamp,
            eventType: "CLAIM_DECISION",
            description: `Email dispatch: Merit Claim Approved! (+${points} points awarded)`,
            recipientEmail: currentStudent
              ? currentStudent.email
              : "student@student.edu",
            emailSubject: "Merit Claim Approved!",
            emailBody: "",
            emailStatus: "DELIVERED",
          }

          const newLogs = [newLog, ...state.logs]

          const activeIteration = getActiveIteration()
          if (activeIteration === 4) {
            return {
              claims: updatedClaims,
              students: updatedStudents,
              logs: newLogs,
              claims4: updatedClaims,
              students4: updatedStudents,
              logs4: newLogs,
            }
          } else if (activeIteration === 3) {
            return {
              claims: updatedClaims,
              students: updatedStudents,
              logs: newLogs,
              claims3: updatedClaims,
              students3: updatedStudents,
              logs3: newLogs,
            }
          } else if (activeIteration === 2) {
            return {
              claims: updatedClaims,
              students: updatedStudents,
              logs: newLogs,
              claims2: updatedClaims,
              students2: updatedStudents,
              logs2: newLogs,
            }
          } else {
            return {
              claims: updatedClaims,
              students: updatedStudents,
              logs: newLogs,
              claims1: updatedClaims,
              students1: updatedStudents,
              logs1: newLogs,
            }
          }
        }),

      rejectClaim: (claimId) =>
        set((state) => {
          const updatedClaims = state.claims.map((c) =>
            c.id === claimId
              ? { ...c, status: "REJECTED" as const, pointsAwarded: null }
              : c
          )

          const targetClaim = state.claims.find((c) => c.id === claimId)
          if (!targetClaim) return {}

          const currentStudent = state.students[targetClaim.studentId]

          const now = new Date()
          const timestamp = getFormattedDate(now)

          const newLog: SystemLog = {
            id: `log-${Date.now()}`,
            timestamp,
            eventType: "CLAIM_DECISION",
            description: `Email dispatch: Merit Claim Status Update (Rejection notification)`,
            recipientEmail: currentStudent
              ? currentStudent.email
              : "student@student.edu",
            emailSubject: "Merit Claim Status Update",
            emailBody: "",
            emailStatus: "DELIVERED",
          }

          const newLogs = [newLog, ...state.logs]

          const activeIteration = getActiveIteration()
          if (activeIteration === 4) {
            return {
              claims: updatedClaims,
              logs: newLogs,
              claims4: updatedClaims,
              logs4: newLogs,
            }
          } else if (activeIteration === 3) {
            return {
              claims: updatedClaims,
              logs: newLogs,
              claims3: updatedClaims,
              logs3: newLogs,
            }
          } else if (activeIteration === 2) {
            return {
              claims: updatedClaims,
              logs: newLogs,
              claims2: updatedClaims,
              logs2: newLogs,
            }
          } else {
            return {
              claims: updatedClaims,
              logs: newLogs,
              claims1: updatedClaims,
              logs1: newLogs,
            }
          }
        }),

      addLog: (log) =>
        set((state) => {
          const newLogs = [log, ...state.logs]
          const activeIteration = getActiveIteration()
          if (activeIteration === 4) {
            return {
              logs: newLogs,
              logs4: newLogs,
            }
          } else if (activeIteration === 3) {
            return {
              logs: newLogs,
              logs3: newLogs,
            }
          } else if (activeIteration === 2) {
            return {
              logs: newLogs,
              logs2: newLogs,
            }
          } else {
            return {
              logs: newLogs,
              logs1: newLogs,
            }
          }
        }),

      resetStore: () =>
        set(() => {
          const activeIteration = getActiveIteration()
          if (activeIteration === 4) {
            const initialClaims = getInitialClaims()
            const initialStudents = getInitialStudents(4)
            const initialLogs = getInitialLogs()
            return {
              claims: initialClaims,
              students: initialStudents,
              logs: initialLogs,
              claims4: initialClaims,
              students4: initialStudents,
              logs4: initialLogs,
            }
          } else if (activeIteration === 3) {
            const initialClaims = getInitialClaims()
            const initialStudents = getInitialStudents(2)
            const initialLogs = getInitialLogs()
            return {
              claims: initialClaims,
              students: initialStudents,
              logs: initialLogs,
              claims3: initialClaims,
              students3: initialStudents,
              logs3: initialLogs,
            }
          } else if (activeIteration === 2) {
            const initialClaims = getInitialClaims()
            const initialStudents = getInitialStudents(2)
            const initialLogs = getInitialLogs()
            return {
              claims: initialClaims,
              students: initialStudents,
              logs: initialLogs,
              claims2: initialClaims,
              students2: initialStudents,
              logs2: initialLogs,
            }
          } else {
            const initialClaims = getInitialClaims()
            const initialStudents = getInitialStudents(1)
            const initialLogs = getInitialLogs()
            return {
              claims: initialClaims,
              students: initialStudents,
              logs: initialLogs,
              claims1: initialClaims,
              students1: initialStudents,
              logs1: initialLogs,
            }
          }
        }),

      setIteration: (iteration) => {
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem("mars_iteration", String(iteration))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            // Ignore
          }
        }
        set((state) => {
          if (iteration === 4) {
            return {
              claims: state.claims4,
              students: state.students4,
              logs: state.logs4,
            }
          } else if (iteration === 3) {
            return {
              claims: state.claims3,
              students: state.students3,
              logs: state.logs3,
            }
          } else if (iteration === 2) {
            return {
              claims: state.claims2,
              students: state.students2,
              logs: state.logs2,
            }
          } else {
            return {
              claims: state.claims1,
              students: state.students1,
              logs: state.logs1,
            }
          }
        })
      },
    }),
    {
      name: "mars-mock-store",
      partialize: (state) => ({
        claims1: state.claims1.map((c) => ({ ...c, proofBase64: "" })),
        students1: state.students1,
        logs1: state.logs1,
        claims2: state.claims2.map((c) => ({ ...c, proofBase64: "" })),
        students2: state.students2,
        logs2: state.logs2,
        claims3: state.claims3.map((c) => ({ ...c, proofBase64: "" })),
        students3: state.students3,
        logs3: state.logs3,
        claims4: state.claims4.map((c) => ({ ...c, proofBase64: "" })),
        students4: state.students4,
        logs4: state.logs4,
        claims: state.claims.map((c) => ({ ...c, proofBase64: "" })),
        students: state.students,
        logs: state.logs,
      }),
    }
  )
)
