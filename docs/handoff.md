# Handoff: Iteration 5 Scope, Refactoring & Iteration 4 UAT Resolutions

The repository commit has been reset to `feat: implement iteration-4`. The next agent should resume work by implementing the **Iteration 4 UAT complaints** as new features/fixes in **Iteration 5**, alongside executing the **Modular Component Architecture Refactoring**.

---

## 1. Core Task Checklist

### A. Large-Scale Refactoring

- **Goal:** Decompose bloated pages into modular subcomponents under `src/components/` as outlined in [refactor_plan.md](file:///d:/GitHub%20Repositories/community-merits/docs/refactor_plan.md).
- **Refactor Tooling:** Ensure the refactoring agent uses the **refactor skills** from `awesome-copilot` under the same skills library.
- **Key Files to Split:**
  1.  **Student Dashboard** (`src/app/dashboard/page.tsx`) -> Split into:
      - `src/components/dashboard/PointsOverview.tsx`
      - `src/components/dashboard/SubmitClaimDialog.tsx`
      - `src/components/dashboard/ClaimsHistoryTable.tsx`
  2.  **Admin Claims Queue** (`src/app/admin/claims/page.tsx`) -> Split into:
      - `src/components/admin/claims/ClaimsTable.tsx`
      - `src/components/admin/claims/CertificateTemplate.tsx`
      - `src/components/admin/claims/PdfPreview.tsx`
      - `src/components/admin/claims/ClaimsFilters.tsx`
  3.  **System Logs Inspector** (`src/app/admin/logs/page.tsx`) -> Split into:
      - `src/components/admin/logs/LogsStats.tsx`
      - `src/components/admin/logs/LogsTable.tsx`
      - `src/components/admin/logs/EmailBodyFrame.tsx`
      - `src/components/admin/logs/EmailInspectDrawer.tsx`

### B. Resolving Iteration 4 UAT Complaints in Iteration 5

Fix the following issues listed in [iteration-4.md](file:///d:/GitHub%20Repositories/community-merits/docs/uat/iteration-4.md):

1.  **Font Mismatch in Email Preview:**
    - Update email body previewer (`EmailBodyFrame.tsx`) to use `'Inter', Arial, sans-serif` for `activeIteration >= 5` to match Resend templates.
    - Keep `'Courier New', Courier, monospace` for lower iterations to show the original typography mismatch.
2.  **Non-functional Toaster Close Button:**
    - For `activeIteration >= 5`, remove the close (x) button from the `<Toaster>` components so they auto-dismiss or dismiss on click. Keep `closeButton={activeIteration < 5}`.
3.  **Log Ingestion on Resend Actions:**
    - When an admin clicks "Resend Email", "Retry Delivery", or "Force Send" in the logs inspector drawer, append a **new system log entry** in the logs list for `activeIteration >= 5`, instead of just updating the status in place.
4.  **Dynamic Email Log Tracking:**
    - In Iteration 5, ensure claim submission, admin approval, and admin rejection dynamically append new email log entries in the logs list.
5.  **Non-user-friendly Toaster Notifications:**
    - When `activeIteration >= 5`, display simplified, user-friendly toast messages (e.g. "Claim submitted successfully! You have been notified.") instead of technical, verbose messages.

---

## 2. Anti-Regression & Design Constraints (CRITICAL)

To avoid breaking existing working features from Iteration 4:

- **Drawer Footer Layout:**
  - The email inspect drawer action buttons (Retry, Force, Resend) must remain positioned inside the `<DrawerFooter>` aligned to the **right**, with the **Close** button aligned to the **left**.
  - Do **NOT** relocate these buttons inside the preview card body/main drawer area.
- **Do Not Disable Resend Email Service:**
  - Live Resend email integration is already implemented and must remain fully functional in Iteration 5.
  - Do **NOT** let early phases of Iteration 5 fallback to static/fake dispatches or restore the "Simulate Dispatch" button (which must remain hidden).
- **Zustand & LocalStorage Gating:**
  - Zustand state isolation must be extended to support `claims5`, `students5`, and `logs5` in `src/store/useMockStore.ts`.
  - Ensure all state persistence and store syncs carry over cleanly.
- **Upgrade Iteration Checking:**
  - Upgrade check conditions from `activeIteration === 4` to `activeIteration >= 4` to prevent features (like calendar popovers, points calculations, PDF file validation, and table paginations) from regressing to lower-iteration states when the user switches to Iteration 5.
