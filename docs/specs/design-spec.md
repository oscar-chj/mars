# Community Merits: Design Specification

This document details the architecture and flow for implementing the standalone **Community Merits** Next.js application. All features are designed to be built incrementally using the Extreme Prototyping methodology.

---

## 1. Core Architecture & Data Modeling

To keep the application decoupled and robust, we define explicit TypeScript interfaces for the system models:

### 1.1 TypeScript Interfaces (`src/types/claims.ts`)

```typescript
export interface Student {
  id: string;
  name: string;
  email: string;
  matricNumber: string;
  points: number;
}

export interface Claim {
  id: string;
  studentId: string;
  studentName: string;
  eventName: string;
  category: 'VOLUNTEERING' | 'SPORTS' | 'CULTURAL' | 'ACADEMIC';
  date: string;
  organizer: string;
  proofFileName: string;
  proofBase64: string; // Base64 encoding for client-side storage persistence
  pointsAwarded: number | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  eventType: 'CLAIM_SUBMISSION' | 'CLAIM_DECISION' | 'EMAIL_DELIVERED';
  description: string;
  recipientEmail: string;
  emailSubject: string;
  emailBody: string;
  emailStatus: 'SENT' | 'DELIVERED' | 'BOUNCED';
}
```

---

## 2. Directory & Route Map

All views live under the clean Next.js app directory structure:

```
src/
├── app/
│   ├── layout.tsx           # Global shell & persistent role toggle switcher
│   ├── page.tsx             # Landing / welcome portal page
│   ├── dashboard/           # Student Portal (UC1, UC2)
│   │   └── page.tsx
│   ├── leaderboard/         # Public Leaderboard (UC5)
│   │   └── page.tsx
│   └── admin/
│       ├── claims/          # Admin Claims Queue & Approvals (UC3, UC4)
│       │   └── page.tsx
│       └── logs/            # Admin Audit Logs & SMTP Tracker (UC6)
│           └── page.tsx
├── components/
│   ├── ui/                  # Shadcn UI primitives
│   └── prototype/           # Shared prototype layout components
└── store/
    └── useMockStore.ts      # Zustand client database state simulator
```

---

## 3. Incremental Implementation Directive

To ensure maximum focus on quality and to validate design constraints early, developers must implement this project **horizontally and incrementally**, rather than vertically.

```
┌────────────────────────────────────────────────────────┐
│  MILESTONE 1: Complete Phase 1 (Static UI) for ALL UCs │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│  MILESTONE 2: Complete Phase 2 (Zustand) for ALL UCs   │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│  MILESTONE 3: Complete Phase 3 (Live DB) for ALL UCs   │
└────────────────────────────────────────────────────────┘
```

### Milestone 1: Complete Phase 1 (Static UI) for All Use Cases
Before adding any state logic, event handlers, or local storage, build the visual shells for all screens using Shadcn UI and Tailwind CSS v4:
*   **UC1 & UC2 (Student Dashboard)**: Draw the student dashboard cards showing cumulative points, the "Claim Community Merit" dialog form modal, the visual file upload dropzone mockup, and the past claims list table.
*   **UC3 & UC4 (Admin Claims Panel)**: Draw the admin pending claims queue table list and the split-screen detail preview panel (showing claim metadata and a placeholder certificate image preview).
*   **UC5 (Student Leaderboard)**: Draw the podium graphic and student ranking leaderboard table.
*   **UC6 (SMTP Logs Screen)**: Draw the admin logs page containing the system logs list table and the slide-out mock email inspector card.

### Milestone 2: Complete Phase 2 (Interactive Zustand) for All Use Cases
Once all static screens are approved, connect the interactive logic using Zustand and LocalStorage:
*   **Data Sync**: Submitting a claim adds a row locally; toggling roles instantly updates the admin queue.
*   **Base64 File Conversion**: Convert student-uploaded PNGs into Base64 strings to save inside the local store, letting the Admin preview the actual uploaded files.
*   **Email Logger Trigger**: Connect state actions (submissions, approvals, rejections) to automatically generate a corresponding transactional log in the SMTP logs page.

### Milestone 3: Complete Phase 3 (Database & API Integration)
In the final step, replace the mock store hook with actual server actions:
*   Convert Zustand store into **Prisma queries** targeting a PostgreSQL/SQLite database.
*   Connect file uploads to a cloud bucket or local static directory.
*   Integrate a live email SMTP service (like Resend) to fire real emails to students and administrators.
