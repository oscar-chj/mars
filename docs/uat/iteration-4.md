# Iteration 4 Complaints / UX Feedback

This document tracks UX, styling, and service integration complaints for Iteration 4, to be resolved in future phases.

## 1. Log Ingestion on Resend Actions

- **Complaint:** When an admin clicks "Resend Email", "Retry Delivery", or "Force Send" in the logs inspector drawer, the new email dispatch event is not recorded as a new system log entry. Instead, it only updates the status of the inspected log. A new log event should be appended to the list to track the dispatch history.
- **Status:** Pending (to be resolved in Iteration 5 / Phase 3 fixes).

## 2. Dynamic Email Log Tracking

- **Complaint:** The system logs page does not dynamically append log entries in real time when actual emails are sent during actions like student claim submissions, admin approvals, or admin rejections. The logs should dynamically track and render all newly generated dispatch events.
- **Status:** Pending (to be resolved in Iteration 5 / Phase 3 fixes).

## 3. Non-user-friendly Toaster Notifications

- **Complaint:** The toast messages displayed to students and admins are overly technical (e.g., mentioning email confirmation success or double status messages on approval). Toasters should be concise, clear, and focused on user-facing notifications.
- **Status:** Pending (to be resolved in Iteration 5).

## 4. PDF Max Size Constraint Not Enforced

- **Complaint:** The student portal does not enforce the 5MB PDF file size limit when a student selects a file to upload. It allows files larger than 5MB to be processed.
- **Status:** Pending (to be resolved in Iteration 5).

## 5. UI Microcopy and UX Writing Compliance

- **Complaint:** Toast messages, button labels, titles, descriptions, and headers do not comply with the UX writing rules defined in docs/better-ux-writing.txt (e.g., they do not use sentence case, contain banned words like "successfully" or "failed to", include exclamation marks in error messages/standalone microcopy, or lack informative/concise phrasing).
- **Status:** Pending (to be resolved in Iteration 5).
