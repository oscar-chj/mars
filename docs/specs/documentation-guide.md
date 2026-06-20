# Community Merits: Documentation & UAT Guide

This document acts as a template and guide for compiling the project report, user journeys, and User Acceptance Testing (UAT) guidelines for the **Community Merits** application.

---

## 1. The 6 User Journeys

### UC1: Student Claim Submission
1.  **Entry**: The Student navigates to the Dashboard page.
2.  **Action**: The Student clicks the **"Claim Community Merit"** button, opening a form modal.
3.  **Inputs**: The Student fills in: Event Name, Category, Date, and Organizer.
4.  **File Upload**: The Student drops a certificate PNG/JPG file. The browser converts it to a Base64 text string for local storage.
5.  **Execution**: The Student clicks **"Submit"**. A new claim is appended to Zustand state (Status: `PENDING`). An alert reports: *"Confirmation email sent to student!"*

### UC2: Student Claims Dashboard
1.  **Entry**: The Student opens their Dashboard page.
2.  **Visuals**: A card shows their cumulative points, and a table lists past claims.
3.  **State Progression**: The new claim starts as `PENDING` (yellow). Once verified, the badge changes to `APPROVED` (green) or `REJECTED` (red) with total point balances updating.

### UC3: Admin Claims Queue
1.  **Entry**: The Admin opens `/admin/claims` to view the claims review inbox.
2.  **Visuals**: A counter badge shows pending claims. A clean list shows all submissions sorted by date.
3.  **Action**: The Admin clicks a pending claim row to start verification.

### UC4: Admin Verification Detail Panel (Split-Screen)
1.  **Visuals**: Clicking a claim splits the view:
    *   *Left Panel*: Claim details (Student, matric number, event).
    *   *Right Panel*: Renders the Base64 certificate image preview in high resolution.
2.  **Actions**: The Admin assigns a points value and clicks **"Approve"** (or **"Reject"**).
3.  **Execution**: Zustand store updates the claim status, adds points to student's profile, logs the action, and triggers the SMTP notification email.

### UC5: Student Leaderboard
1.  **Entry**: Any user clicks the **"Leaderboard"** tab in the main navigation.
2.  **Visuals**: Displays a podium graphics for the top 3 spots, followed by a vertical table ranking all registered students.
3.  **Real-Time Update**: Approving a claim instantly recalculates rankings, moving the student up the leaderboard.

### UC6: Transactional Email Notification System (Running Simulator)
1.  **Automatic Triggers**: Submission and decision events automatically dispatch simulated emails.
2.  **Logs Interface**: The Admin navigates to `/admin/logs`.
3.  **Visuals**: A table displaying sent history. Clicking a row slides open the **Email Inspector** showing the fully styled email message template.

---

## 2. Incremental Exploration Guide (UAT Phases)

To demonstrate the application incremental progress in your documentation, structure your User Acceptance Testing (UAT) into horizontal phases:

### Phase 1 UAT: Visual and Navigation Check
*   Verify that all pages under the router load correctly.
*   Check that the layout styles (Tailwind v4 / Shadcn UI) render consistently.
*   Ensure the navigation and switcher bars display on all screen views.

### Phase 2 UAT: Interactive User Flows (Current State)
*   Submit a claim as a student. Ensure file name/Base64 preview works.
*   Toggle view to Admin. Verify the claim is queued in the Admin inbox.
*   Select the claim, input points, and click Approve.
*   Toggle back to Student. Check if the points increment and status updates to Approved.
*   Open Admin Logs. Check if two mock emails (Submission + Approval decision) are logged and can be inspected.

### Phase 3 UAT: Production Readiness
*   Verify real database persistence across different browsers and devices.
*   Test transactional email notifications landing in actual user inboxes.
