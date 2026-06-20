# Iteration 3 Complaints / UX Feedback

This document tracks UX and design complaints for Iteration 3, to be resolved in current or future phases.

## 1. Leaderboards Value Inconsistency
- **Complaint:** Leaderboards do not reflect actual user points (approved claims sum). Alice Chen shows 120 points on the leaderboard but has only 40 points on the dashboard based on her claims history.
- **Status:** Pending (to be resolved in Iteration 4).

## 2. Compulsory Form Fields & Document Upload
- **Complaint:** When submitting a claim, all fields (Event Name, Organizer, Category, Date) and uploading the proof certificate should be compulsory. The submit button must be disabled until these are provided.
- **Status:** Pending (to be resolved in Iteration 4).

## 3. Certificate Proof Document Previewing
- **Complaint:** Certificate preview on the admin side should show the document uploaded by the student rather than a simulated certificate template that the admin would issue.
- **Status:** Pending (to be resolved in Iteration 4).

## 4. Email Inspector Drawer Layout & Action Buttons
- **Complaint:** Email inspect drawer should be wider on desktop. The close and resend/retry buttons should be functional, and they must be positioned inside the email preview card container instead of the drawer footer.
- **Status:** Pending (to be resolved in Iteration 4).

## 5. No Pagination on Tables
- **Complaint:** Tables across all pages (Claims Queue, System Logs, Dashboard History, and Leaderboard) lack pagination. We should add pagination using the shadcn default pagination component.
- **Status:** Pending (to be resolved in Iteration 4).

## 6. Page Header Branding Wording
- **Complaint:** The branding title for iteration >= 2 should be updated from "MARS Portal" to "MARS" only.
- **Status:** Pending (to be resolved in Iteration 4).

## 7. Certificate File Type Constraints & PDF Preview
- **Complaint:** Enforce PDF format for certificate proof uploads. Preview the uploaded PDF inside the certificate preview section. Store the PDF document as a base64 string.
- **Status:** Pending (to be resolved in Iteration 4).

## 8. Email Dispatch Service Integration (Resend)
- **Complaint:** The email dispatcher is not sending actual emails. The system should send real emails to students when claims are submitted, approved, or rejected, and to admins on new submissions. The "Resend Email" button in the inspector should also trigger actual dispatches. Once functional, the manual 'Simulate Dispatch' button on the logs page should be removed.
- **Status:** Pending (to be resolved in Iteration 4).
