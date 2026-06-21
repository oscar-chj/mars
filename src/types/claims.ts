export interface Student {
  id: string
  name: string
  email: string
  matricNumber: string
  points: number
}

export interface Claim {
  id: string
  studentId: string
  studentName: string
  eventName: string
  category: "VOLUNTEERING" | "SPORTS" | "CULTURAL" | "ACADEMIC"
  date: string
  organizer: string
  proofFileName: string
  proofBase64: string // Base64 encoding for client-side storage persistence
  pointsAwarded: number | null
  status: "PENDING" | "APPROVED" | "REJECTED"
}

export interface SystemLog {
  id: string
  timestamp: string
  eventType: "CLAIM_SUBMISSION" | "CLAIM_DECISION" | "EMAIL_DELIVERED"
  description: string
  recipientEmail: string
  emailSubject: string
  emailBody: string
  emailStatus: "SENT" | "DELIVERED" | "BOUNCED"
}
