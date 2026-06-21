# Refactoring Plan: Modular Component Architecture

This document plans a large-scale refactor for the MARS Portal codebase to cut down lines per file, improve readability, enforce single-responsibility principles, and enhance maintainability.

---

## 1. Identified Issues (Bloated Files)

Currently, the three primary page views in the application handle state, layouts, table pagination, dialog forms, styling templates, and custom client-side utilities (e.g., pdf.js rendering, email iframe framing) all in a single file:

1. **Student Dashboard** (`src/app/dashboard/page.tsx`): **~740 lines**
   - Handles points overview cards.
   - Contains the claim submission dialog, date popover calendar, PDF file drop validation, and base64 encoding.
   - Manages submitted claims list table, statuses, and pagination.

2. **Admin Claims Queue** (`src/app/admin/claims/page.tsx`): **~1050 lines**
   - Handles the claims list table, tabs, and pagination.
   - Implements PDF.js dynamic loading and rendering onto a `<canvas>`.
   - Embeds a complex certificate simulation design.
   - Manages approval/rejection operations.

3. **System Logs Inspector** (`src/app/admin/logs/page.tsx`): **~940 lines**
   - Handles logs listing, table pagination, status filters, and stats card metrics.
   - Embeds an `EmailBodyFrame` with an `<iframe>` implementation.
   - Manages the slide-out inspector drawer, detail grid layouts, and action trigger buttons.

---

## 2. Proposed Component Directory Structure

To partition these files, we will create domain-specific subdirectories under `src/components/`:

```
src/
├── components/
│   ├── dashboard/
│   │   ├── PointsOverview.tsx          # Points summary cards
│   │   ├── SubmitClaimDialog.tsx       # Claim submission form dialog with validation
│   │   └── ClaimsHistoryTable.tsx      # Paginated history table
│   └── admin/
│       ├── claims/
│       │   ├── ClaimsTable.tsx         # Claims list queue and pagination
│       │   ├── CertificateTemplate.tsx  # Simulated gold border certificate layout
│       │   ├── PdfPreview.tsx          # Client-side dynamic PDF.js renderer
│       │   └── ClaimsFilters.tsx       # Queue status tabs and search
│       └── logs/
│           ├── LogsStats.tsx           # Total/Delivered/Sent/Failed metric cards
│           ├── LogsTable.tsx           # Logs table and pagination
│           ├── EmailBodyFrame.tsx      # Iframe sandboxed email body previewer
│           └── EmailInspectDrawer.tsx  # Wider slide-out inspect details drawer
```

---

## 3. Detailed Component Decomposition

### A. Student Dashboard Refactoring
*   **`PointsOverview`**: Receives `student` points details, rendering claims status stats (Approved, Pending, Rejected) in a clean layout.
*   **`SubmitClaimDialog`**: Encapsulates the form submission, `accept="application/pdf"` check, base64 converter, required fields validations, custom popover calendar, and submit event emitter.
*   **`ClaimsHistoryTable`**: Encapsulates the table list, page size limit of 5, resetting pagination on filter updates, and formatting columns.

### B. Admin Claims Queue Refactoring
*   **`ClaimsFilters`**: Manages the search input and phase/iteration selector interfaces.
*   **`ClaimsTable`**: Lists the claims queue, pagination items, and updates the active selection handler.
*   **`PdfPreview`**: Handles dynamic `import("pdfjs-dist")`, canvas context rendering, loading indicators, and error fallbacks.
*   **`CertificateTemplate`**: Visual fallback mock certificate layout with double borders, gold seals, and decorative corners.

### C. System Logs Refactoring
*   **`LogsStats`**: Renders numeric counters for Total, Delivered, Sent, and Failed delivery logs.
*   **`LogsTable`**: Contains the main system logs log list grid and pagination buttons.
*   **`EmailBodyFrame`**: A client-safe iframe renderer that isolates styling contexts.
*   **`EmailInspectDrawer`**: Renders the SMTP headers card grid, includes action buttons (Retry, Force, Resend), and maps to corresponding Resend triggers.

---

## 4. Migration Execution Strategy

To ensure zero regressions:
1. **Component Extraction**: Extract leaf components that depend on no other custom components first (e.g., `PdfPreview`, `EmailBodyFrame`, `CertificateTemplate`, `PointsOverview`).
2. **Prop Interface Definitions**: Define strong TypeScript types for all callback handlers and data props.
3. **Incremental Integration**: Replace chunks in the page files one component at a time, running `npx tsc --noEmit` after every step to verify type safety.
4. **Final Lint Verification**: Run the linter (`npx eslint`) to make sure unused imports or formatting mismatches are corrected.
