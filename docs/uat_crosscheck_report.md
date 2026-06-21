# MARS & Community Merits: UAT Crosscheck & Code Audit Report

This report documents the results of a comprehensive code audit of the **Community Merits / MARS (Merit Activity Records System)** codebase under `src/`. The implementation has been crosschecked against the 6 Use Cases (UC1 to UC6) defined in `docs/specs/documentation-guide.md` and the user feedback logged in `docs/uat/iteration-1.md`, `docs/uat/iteration-2.md`, and `docs/uat/iteration-3.md`.

---

## 1. Summary of Gaps & Critical Findings

While the application supports toggling between Iterations 1, 2, 3, and 4 (including Phases 1, 2, and 3), there are several major implementation gaps and regressions—especially under **Iteration 4**—due to scoping conditionals and missing features.

### Key Gaps Identified:
1. **Zustand State Isolation Gap (Major)**: 
   The Zustand store (`src/store/useMockStore.ts`) does not define or isolate Iteration 4 state. It lacks `claims4`, `students4`, and `logs4`. When `activeIteration === 4`, the store defaults to reading and writing Iteration 1 state (`claims1`, `students1`, `logs1`), violating state isolation guidelines.
2. **UAT Fix Regressions in Iteration 4 (Major)**: 
   Several critical UAT fixes from Iterations 2 & 3 (such as custom Popover Date Pickers, Alphanumeric Matric Numbers, and MARS Branding) are constrained using explicit checks like `activeIteration === 2 || activeIteration === 3`. Consequently, when the user switches to **Iteration 4**, the system **regresses/falls back to Iteration 1 behavior** (browser-default date input, old matric number formats, and generic "Community Merits" branding).
3. **Resend Email Service Integration (Missing)**: 
   The transactional email integration (API routes, React Email templates, actual mail dispatching, and drawer action buttons triggering live dispatches) planned for Iteration 4 Phase 3 is completely unimplemented. The `resend` and `@react-email/components` packages are missing from `package.json`.
4. **Lack of Submission Confirmation Alert (Gap)**: 
   UC1 specifies that a successful claim submission should show an alert reporting *"Confirmation email sent to student!"*. No screen alert or toast notification is triggered on submission in `dashboard/page.tsx`.

---

## 2. Status of the 6 Use Cases (UC1 to UC6)

| Use Case | Description | Code Location | Status | Implementation Details & Gaps |
| :--- | :--- | :--- | :--- | :--- |
| **UC1** | Student Claim Submission | `src/app/dashboard/page.tsx` | **Partially Implemented** | **Details**: Form inputs (Event Name, Category, Date, Organizer) and Base64 proof upload are fully functional.<br>**Gap**: No toast or window alert is shown reporting *"Confirmation email sent to student!"* on submission. |
| **UC2** | Student Claims Dashboard | `src/app/dashboard/page.tsx` | **Fully Implemented** | **Details**: Displays cumulative points card (dynamically summing approved claims history) and past claims table with color-coded status badges. |
| **UC3** | Admin Claims Queue | `src/app/admin/claims/page.tsx` | **Fully Implemented** | **Details**: Pending counter badge and filter tabs (`ALL`, `PENDING`, `APPROVED`, `REJECTED`) are fully functional. Clicking rows loads split-screen preview. |
| **UC4** | Admin Verification Detail Panel | `src/app/admin/claims/page.tsx` | **Fully Implemented** | **Details**: Displays student metadata (left) and certificate preview (right). Supports inputting points, approving, and rejecting claims. |
| **UC5** | Student Leaderboard | `src/app/leaderboard/page.tsx` | **Partially Implemented** | **Details**: Renders top 3 podium graphics and ranking table.<br>**Gap**: Leaderboard points do not reflect claims history in Iterations 1-3 ( Alice displays 120 points instead of 40). Dynamic calculations are implemented only for Iteration 4. |
| **UC6** | Transactional Email Simulator | `src/app/admin/logs/page.tsx` | **Partially Implemented** | **Details**: Activity table tracks mock emails. Inspecting a row opens the slide-out drawer containing simulated SMTP headers and a styled preview card.<br>**Gap**: Live dispatch service integration (planned for Iteration 4 Phase 3) is completely missing. |

---

## 3. UAT Complaints Resolution Audit

Below is a detailed audit of user feedback files to verify where and how each complaint is addressed.

### Iteration 1 (UAT Phase 1)
*   **Complaint 1: Generic Branding (Rename to MARS)**
    *   *Implementation*: `src/components/prototype/header.tsx` renders "MARS" when `activeIteration >= 2`.
    *   *Gap*: In `src/app/admin/logs/page.tsx`, the email frame signatures and headers fall back to "Community Merits" when `activeIteration === 4` because they check only `activeIteration === 2 || activeIteration === 3`.
*   **Complaint 2: Outdated Matriculation Numbers (Upgrade to alphanumeric standard e.g. `BC223014`)**
    *   *Implementation*: In Iterations 2 & 3, student data uses new matriculation numbers.
    *   *Gap*: `formatMatric` functions on Leaderboard, Claims, and Dashboard pages do not handle Iteration 4, causing them to fallback to the outdated `U232...` format.
*   **Complaint 3: Browser-Default Date Input (Replace with custom popover Calendar)**
    *   *Implementation*: A custom Calendar component is used in `dashboard/page.tsx`.
    *   *Gap*: Falls back to `<input type="date">` when `activeIteration === 4` due to the conditional statement `activeIteration === 2 || activeIteration === 3`.

### Iteration 2 (UAT Phase 2)
*   **Complaint 1: Page Header Inconsistency ("Audit Logs" vs "System Logs")**
    *   *Implementation*: Navigation headers and pages are renamed to "System Logs".
    *   *Gap*: Under Iteration 4, the title in `logs/page.tsx` reverts to "System Activity Logs", breaking matching titles.
*   **Complaint 2: Audit Logs Filter Reset Button Layout (Prevent layout jumps)**
    *   *Implementation*: In `src/app/admin/logs/page.tsx`, the Reset button is placed inside the flex container before the select dropdowns, preventing layout disturbance when it appears.
*   **Complaint 3: Redundant Page Dividers**
    *   *Implementation*: Additional dividers between title headers and content cards were removed from all pages.
*   **Complaint 4: Email Inspect Drawer Overflow & Width**
    *   *Implementation*: Set drawer width to `45vw` on desktop when `activeIteration === 4` (otherwise `35vw`). Added `overflow-y-auto` to allow scrolling and prevent viewport cut-offs.
*   **Complaint 5: Dashboard Value Inconsistency (Sum of claims history != total points)**
    *   *Implementation*: Dashboard card now calculates total points dynamically by summing up `pointsAwarded` of approved claims in the history list.
*   **Complaint 6: Page Reload Version Flashing & Hydration Mismatch**
    *   *Implementation*: Added `isReady` flag in `PhaseContext.tsx`. Header renders fallback/skeletons until `localStorage` is loaded, eliminating flash and Next.js hydration errors.
*   **Complaint 7: Redundant Navigation Buttons**
    *   *Implementation*: Extraneous buttons like "Back to Dashboard" or "Back to Admin Portal" have been completely removed.
*   **Complaint 8: Certificate Proof Upload and Preview (Show uploaded cert instead of system-generated template)**
    *   *Implementation*: Implemented for Iteration 4 only. If proof is present, it previews the uploaded image or PDF document. In Iterations 1-3, it still displays the gold-seal certificate template.

### Iteration 3 (UAT Phase 3)
*   **Complaint 1: Leaderboards Value Inconsistency (Alice Chen showing 120 points on leaderboard but 40 on dashboard)**
    *   *Implementation*: Ranks are computed dynamically for Iteration 4 by summing up actual approved claim points.
    *   *Gap*: Ranks remain static/inconsistent in Iterations 1-3.
*   **Complaint 2: Compulsory Form Fields & Document Upload**
    *   *Implementation*: Enforced on form in `dashboard/page.tsx` when `activeIteration === 4`. Submit button is disabled if fields are empty.
*   **Complaint 3: Certificate Proof Document Previewing (Preview student uploaded proof)**
    *   *Implementation*: Handled in Iteration 4 (using standard preview or PDF.js canvas).
*   **Complaint 4: Email Inspector Drawer Layout & Action Buttons**
    *   *Implementation*: Close, Resend, Force Send, and Retry buttons are positioned inside the preview card container (in `bg-zinc-50` box) in `logs/page.tsx` and are interactive.
*   **Complaint 5: No Pagination on Tables**
    *   *Implementation*: Pagination is added to Dashboard, Admin Claims, and Logs tables (5 items/page) for all iterations.
    *   *Gap*: Pagination on the Leaderboard rankings table is ONLY enabled when `activeIteration === 4`.
*   **Complaint 6: Page Header Branding Wording (Change "MARS Portal" to "MARS")**
    *   *Implementation*: Updated branding title to "MARS" in `header.tsx` for iterations >= 2.
*   **Complaint 7: Certificate File Type Constraints & PDF Preview**
    *   *Implementation*: PDF format constraint (accepts only `"application/pdf"`) and client-side PDF.js rendering are active when `activeIteration === 4`.
*   **Complaint 8: Email Dispatch Service Integration (Resend Integration)**
    *   *Status*: **NOT IMPLEMENTED**. There are no API endpoints, React email templates, or resend package installation. The manual "Simulate Dispatch" button has not been removed in Iteration 4.

---

## 4. Recommendations for Next Steps

To bring the codebase to complete compliance for Iteration 4 and resolve all gaps:
1. **Refactor Scoping Conditionals**: Change checks like `activeIteration === 2 || activeIteration === 3` to `activeIteration >= 2` so that UAT fixes automatically propagate to Iteration 4 (e.g. matric formatting, custom date popover, branding names).
2. **Update Zustand Store for Iteration 4**:
   * Add `claims4`, `students4`, and `logs4` to the Zustand store state.
   * Add case checks inside `submitClaim`, `approveClaim`, `rejectClaim`, `addLog`, `resetStore`, and `setIteration` to handle `activeIteration === 4` correctly.
   * Update `getActiveIteration()` helper in `useMockStore.ts` to recognize `localStorage.getItem("mars_iteration") === "4"`.
3. **Implement Resend API & Templates**:
   * Install `resend` and `@react-email/components` packages.
   * Create React Email template files under `src/components/emails/`.
   * Implement POST handler in `src/app/api/send-email/route.ts` to dispatch live emails.
   * Wire the API calls to submit and review actions in frontend pages.
4. **Add Toast/Alert on Claim Submission**: Add a sonner toast or window alert confirming *"Confirmation email sent to student!"* upon claim submission to satisfy UC1.
