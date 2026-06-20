# Iteration 2 Complaints / UX Feedback

This document tracks UX and design complaints for Iteration 2, to be resolved in current or future phases.

## 1. Page Header Inconsistency

- **Complaint:** The page title and the header title are inconsistent. The header link says "Audit Logs" but the page title says "System Logs".
- **Status:** In progress (to be resolved in Task 3 of Phase 2).

## 2. Audit Logs Filter Reset Button Layout

- **Complaint:** In the System/Audit Logs page, when selecting a search filter (e.g. "delivered"), the reset button appears on the right of the row, disturbing the position of the dropdowns. This drastically changes the layout of the components, which is poor UX.
- **Status:** Pending.

## 3. Redundant Page Dividers

- **Complaint:** There is an additional/redundant divider between the titles and contents in pages like Claims and System/Audit Logs.
- **Status:** Pending.

## 4. Email Audit Logs Inspect Drawer Overflow & Width

- **Complaint:** The email inspect drawer on the System/Audit logs has overflow issues. It should scale more gracefully using the shadcn drawer component. The drawer should also be wider on desktop (e.g., 40% of page width) following common design scaling.
- **Status:** Pending (to be resolved in Iteration 3).

## 5. Dashboard Value Inconsistency (e.g., Total Merit Points)

- **Complaint:** Values in the student dashboard are not consistent. For example, the total merit points displayed do not reflect the sum of points from the student's merit history.
- **Status:** Pending.

## 6. Page Reload Version Flashing & Hydration Mismatch

- **Complaint:** When the page is reloaded, it briefly renders the default version (v1.3) before loading the actual iteration and phase from localStorage (e.g. v2.2), causing the UI elements to jump/flash and Next.js to log hydration mismatch errors.
- **Root Cause & Proposal:**
  - *Root Cause:* Next.js Server-Side Rendering (SSR) runs with default state values (`v1.3` / `Community Merits`). On mount, the client hydration matches this, but then the client-side `useEffect` in `PhaseProvider` runs, reads `localStorage`, and updates the state. This triggers re-renders and the flash.
  - *Proposed Fix:* Introduce an `isReady` (or `mounted`) flag in `PhaseContext`. The `Header` and other affected components can check this flag to render a loading placeholder, skeleton, or fallback, preventing the flash of incorrect version values and eliminating hydration mismatches.
- **Status:** Pending (to be resolved in Iteration 3).

## 7. Redundant Navigation Buttons ("Back to Dashboard" / "Back to Admin Portal")

- **Complaint:** We don't need an extra "Back to Dashboard" button since we can already directly access the dashboard from the navbar. We also don't need the "Back to Admin Portal" button since there is no explicit admin portal page (only the claims queue page).
- **Status:** Pending.

## 8. Certificate / Proof Upload and Preview

- **Complaint:** When submitting a claim, the student should be required to upload an image of their **participation or contribution certificate** (e.g. a photo of the physical cert, or a scanned PDF/image) as proof of the activity. Admins reviewing the claim must be able to open and view this uploaded file directly from the claims queue.
- **Clarification:** The certificate preview in the claims review flow must display the **student's uploaded proof document**, not a certificate that the admin would issue to the student. The current UI conflates these two concepts.
- **Status:** Pending (to be resolved in Iteration 3).



