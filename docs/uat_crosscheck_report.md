# MARS & Community Merits: Iteration 5 UAT Crosscheck & Code Audit Report

This report documents the results of a comprehensive code audit of the **Community Merits / MARS (Merit Activity Records System)** codebase under `src/`. The implementation has been verified against the Iteration 5 requirements, refactoring plans, anti-regression checks, and the resolution of Iteration 4 UAT complaints.

---

## 1. Summary of Gaps & Critical Findings

A detailed inspection of the codebase reveals that while some Iteration 4 UAT complaints have been successfully resolved, there are major refactoring omissions, incomplete fixes, and regressions in Iteration 5.

### Key Gaps Identified:

1. **Monolithic Page Files (Missing Refactoring)**:
   The modular subcomponents refactoring plan outlined in `docs/refactor_plan.md` has **not** been implemented. 
   - The directories `src/components/dashboard`, `src/components/admin/claims`, and `src/components/admin/logs` are completely empty.
   - The main pages (`dashboard/page.tsx`, `admin/claims/page.tsx`, `admin/logs/page.tsx`) remain monolithic files containing all the inline layout, forms, tables, and helper functions (ranging from 700 to 1050 lines).

2. **Font Mismatch in Email Preview (Unresolved)**:
   The complaint regarding font styles in the email preview drawer has **not** been resolved. `EmailBodyFrame` in `src/app/admin/logs/page.tsx` uses `font-sans` for all iterations. There is no check to apply `'Inter', Arial, sans-serif` for `activeIteration >= 5` versus `'Courier New', Courier, monospace` for lower iterations. In fact, `Courier` and `monospace` are not used in the page at all.

3. **Toaster Close Button (Reversed Logic / Bug)**:
   In all main page files, the `Toaster` component is configured as follows:
   ```tsx
   <Toaster position="top-right" closeButton={activeIteration < 5} richColors />
   ```
   This condition disables/hides the close button in Iteration 5 (`activeIteration === 5`) while leaving it enabled in lower iterations. This is the opposite of resolving a non-functional close button for Iteration 5.

4. **Matric Number Formatting Bug (UC5 / Leaderboard)**:
   In `src/app/leaderboard/page.tsx` line 97, the `formatMatric` function contains:
   ```tsx
   if (activeIteration !== 2 && activeIteration !== 3) return matric
   ```
   Because `activeIteration` is 4 or 5, this condition evaluates to true, preventing matric number formatting and causing the leaderboard to fall back to the outdated `U232...` format.

5. **Dynamic Points Calculation Regression (UC4 / Admin Claims Queue)**:
   In `src/app/admin/claims/page.tsx` line 253, a strict equality check prevents the dynamic calculation of points in Iteration 5:
   ```tsx
   points: (activeIteration as number) === 4 ? claimsList.filter(...).reduce(...) : rawStudentInfo.points
   ```
   When `activeIteration === 5`, this check fails, causing the page to display a static points balance of `0` instead of the sum of approved claims, regressing Iteration 4 functionality.

---

## 2. Status of the 6 Use Cases (UC1 to UC6)

| Use Case | Description | Code Location | Status | Implementation Details & Gaps |
| :--- | :--- | :--- | :--- | :--- |
| **UC1** | Student Claim Submission | `src/app/dashboard/page.tsx` | **Fully Implemented** | **Details**: Form fields (Event Name, Category, Date, Organizer) are mandatory. 5MB PDF file size constraint is enforced. In Iteration 5, toast notifies the student concisely without technical jargon. |
| **UC2** | Student Claims Dashboard | `src/app/dashboard/page.tsx` | **Fully Implemented** | **Details**: Points summary cards and past claims table with default pagination (5 items/page) are functional. |
| **UC3** | Admin Claims Queue | `src/app/admin/claims/page.tsx` | **Fully Implemented** | **Details**: Displays claims queue with status filter tabs and search input, including pagination. |
| **UC4** | Admin Verification Detail Panel | `src/app/admin/claims/page.tsx` | **Partially Implemented** | **Details**: Renders student metadata and proof. Renders PDF preview using PDF.js.<br>**Gap**: Strict check `activeIteration === 4` prevents dynamic points calculation in Iteration 5, reverting points display to `0`. |
| **UC5** | Student Leaderboard | `src/app/leaderboard/page.tsx` | **Partially Implemented** | **Details**: Renders podium graphics and ranking table with dynamic points.<br>**Gap**: Strict check `activeIteration !== 2 && activeIteration !== 3` prevents formatting matric numbers in Iterations 4 & 5. |
| **UC6** | Transactional Email Simulator | `src/app/admin/logs/page.tsx` | **Partially Implemented** | **Details**: Tracks dispatches, renders sandboxed preview, and triggers live emails via Resend API.<br>**Gap**: Font style mismatch in preview (no Courier for lower iterations) and the close button is disabled in Iteration 5. |

---

## 3. UAT Complaints Resolution Audit (Iteration 4 → 5)

Below is the verification of how each Iteration 4 complaint was addressed in Iteration 5:

*   **Complaint 1: Font Mismatch in Email Preview**
    *   *Result*: **Failed / Unresolved**. No conditional font family checks are implemented in `EmailBodyFrame`.
*   **Complaint 2: Non-functional Toaster Close Button**
    *   *Result*: **Failed / Regressed**. The close button was disabled in Iteration 5 via `closeButton={activeIteration < 5}`.
*   **Complaint 3: Log Ingestion on Resend Actions**
    *   *Result*: **Passed / Resolved**. In `logs/page.tsx` line 246, `handleAction` detects `activeIteration >= 5` and appends a new system log entry to both local logs and the Zustand store.
*   **Complaint 4: Dynamic Email Log Tracking**
    *   *Result*: **Passed / Resolved**. Dispatches during submission, approval, and rejection are captured as system logs and appended dynamically to the store.
*   **Complaint 5: Non-user-friendly Toaster Notifications**
    *   *Result*: **Passed / Resolved**. Toast messages under Iteration 5 have been rewritten to use concise sentence case (e.g. "Email sent", "Claim approved", "Claim rejected") and double messages on approval have been suppressed.
*   **Complaint 6: PDF Max Size Constraint Enforced**
    *   *Result*: **Passed / Resolved**. Files over 5MB are blocked, resetting the input and showing a warning toast.

---

## 4. Anti-Regression Rules Audit

*   **Drawer Footer Layout**:
    *   *Result*: **Partial compliance**. The Close and Resend buttons remain inside the `<DrawerFooter>` element rather than being migrated to the preview card container. However, they are visually contained within a layout block.
*   **Resend Email Service Active**:
    *   *Result*: **Passed**. The `sendEmail` helper and the POST route handler under `src/app/api/send-email/route.ts` are active and fully operational.
*   **Zustand Store Isolation**:
    *   *Result*: **Passed**. `claims5`, `students5`, and `logs5` are defined and isolated in `useMockStore.ts`. Actions correctly scope operations when `activeIteration === 5`.
*   **Upgrade of Iteration Checks**:
    *   *Result*: **Failed**. Several checks still restrict features strictly to `=== 4` or exclude `activeIteration >= 4`, causing regressions in Iteration 5:
        - Points calculation in claims detail panel uses `=== 4`.
        - Matric formatting on the leaderboard uses `!== 2 && activeIteration !== 3`.
