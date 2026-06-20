# Handoff: Iteration 4 (UX Refinements, PDF.js Preview, Pagination, Resend Email Integration)

This document hands off the development context to the next agent. We have completed **Iteration 3, Phase 3 (LocalStorage Persist)** and are transitioning to **Iteration 4**, which will implement Iteration 3 complaints and additional requested items.

---

## 1. What was Completed in Iteration 3

All Iteration 2 complaints have been fully fixed and verified:
- Reset button layout stability in System Logs (invisible when inactive).
- Redundant divider lines removed from Claims Queue and System Logs headers.
- Drawer content overflow fixed with `overflow-x-hidden`.
- Student Dashboard `totalPoints` calculated dynamically from approved claims.
- Redundant "Back to Dashboard" / "Back to Admin Portal" buttons removed from the Leaderboard.
- Loaded iteration/phase hydration issue resolved with an `isReady` mount flag in `PhaseContext` and skeleton elements in `header.tsx`.

---

## 2. Next Focus: Iteration 4 (UAT Improvements)

The primary objective of the next session is to implement **Iteration 4** (v4.1 → v4.2 → v4.3), scoping all changes to `activeIteration === 4` to keep previous iterations pristine.

### User Requests & Complaints (from `docs/uat/iteration-3.md` and chat)

1. **Leaderboards value consistency**: On the leaderboard page (and the claims page), if `activeIteration === 4`, the user points should be calculated dynamically from the sum of their approved claims in the store (or local state) rather than using a static points field. Alice Chen should start with `40` points initially to be consistent with her initial approved claim (`claim-4` worth 40 points).
2. **Compulsory Form Fields**: On the Student Dashboard claim submission form, make all fields (Event Name, Organizer, Category, Date, and Proof Upload) compulsory when `activeIteration === 4`. Disable the submit button until all of these are provided.
3. **Uploaded PDF Proof Preview (using pdf.js)**:
   - Enforce `.pdf` format for uploads when `activeIteration === 4`.
   - Store the PDF in the database (`proofBase64`) as a Base64-encoded string (`data:application/pdf;base64,...`).
   - Use Mozilla's `pdf.js` library to process and render the PDF on a client-side `<canvas>` inside the Certificate Preview section of `admin/claims/page.tsx`. This avoids layout issues on mobile devices where native `<iframe>` PDF viewers are unsupported.
   - If `proofBase64` is empty (for default mock claims), fall back to rendering `/mock-cert.png`.
4. **Wider & Functional Email Inspector**:
   - Slide-out drawer width should be `45vw` (`sm:max-w-[45vw]`) when `activeIteration === 4`.
   - Action buttons (Close, Retry Delivery, Force Send, Resend Email) should function and be placed inside the email preview card box (inside the `bg-zinc-50` border container).
   - Clicking these buttons should update the status of the log to `DELIVERED` locally (for Phase 1, using `setLocalLogs`) or in the Zustand store (for Phase 2/3, using `useMockStore.setState`) and show a Sonner toast notification.
5. **Table Pagination**: Add dynamic table pagination for all tables when `activeIteration === 4`:
   - Admin Claims Queue table.
   - Admin System Logs table.
   - Student Dashboard history table.
   - Leaderboard page table.
   - Use the pre-existing shadcn component `src/components/ui/pagination.tsx`. Show 5 items per page.
6. **Header Branding**: Change the MARS branding title from "MARS Portal" to "MARS" only for iteration >= 2.
7. **Resend Email Service Integration**:
   - Integrate **Resend** (using `resend` package) to send actual emails.
   - In Phase 3 (`activePhase === 3`), trigger real email dispatches using Resend when:
     - A student submits a claim (Send confirmation email to the student, and notify admins of the new submission).
     - An admin approves a claim (Send congratulations email to the student with points balance details).
     - An admin rejects a claim (Send status update email to the student with the rejection reason).
     - The admin clicks the "Resend Email" / "Retry Delivery" buttons inside the logs email inspector drawer.
   - Emails must be formatted using clean HTML templates based on the email inspector layout details.
   - For testing purposes (as per Resend's docs), send the emails to the testing/onboarding domain `onboarding@resend.dev`.
   - Once the real email dispatch service is running, **remove the manual "Simulate Dispatch" button** from the top of the System Logs page.

---

## 3. Key Technical & Implementation Notes

### PDF Constraint & PDF.js preview
- In `dashboard/page.tsx`, update the file input tag:
  `<input id="file-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />`
- To prevent SSR issues in Next.js, load Mozilla's `pdfjs-dist` dynamically inside the client-side component (using `import("pdfjs-dist")`). Set the worker source.
- **Vercel/Production Deployment Note**: While loading the worker from `cdnjs` works, to prevent CORS, network failure, or Content Security Policy (CSP) blocks in production on Vercel, it is highly recommended to host the worker locally. Copy `node_modules/pdfjs-dist/build/pdf.worker.min.js` to the `public/` folder as `public/pdf.worker.min.js` and load it locally:
  ```tsx
  import * as pdfjsLib from "pdfjs-dist"
  
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"
  ```
- To render the base64 PDF onto a canvas:
  ```tsx
  useEffect(() => {
    if (!activeClaim.proofBase64) return;
    
    const renderPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(activeClaim.proofBase64);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // render first page
        
        const canvas = document.getElementById("pdf-canvas") as HTMLCanvasElement;
        if (!canvas) return;
        
        const context = canvas.getContext("2d");
        if (!context) return;
        
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      } catch (err) {
        console.error("PDF render error:", err);
      }
    };
    
    renderPdf();
  }, [activeClaim.proofBase64]);
  ```
- Render a `<canvas id="pdf-canvas" className="w-full max-h-[500px] object-contain rounded-md" />` inside the Preview Box when `activeClaim.proofBase64` is present.

### Table Pagination
- Import the pagination components:
  ```tsx
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  ```
- Manage page state: `const [currentPage, setCurrentPage] = useState(1)` (reset to `1` when filters/search change!).
- Slice the filtered lists:
  `const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)`
- Render the pagination UI at the bottom of the table if total pages > 1.

### Resend Email Integration Setup
- Install the Resend library: `yarn add resend` or `npm install resend`.
- Setup a Next.js App Router API endpoint (e.g. `src/app/api/send-email/route.ts`) to handle sending:
  ```ts
  import { Resend } from 'resend';

  const resend = new Resend(process.env.RESEND_API_KEY);

  export async function POST(request: Request) {
    const { to, subject, html } = await request.json();
    try {
      const data = await resend.emails.send({
        from: 'Community Merits <onboarding@resend.dev>',
        to: ['onboarding@resend.dev'], // Send to testing domain as per Resend docs
        subject,
        html,
      });
      return Response.json(data);
    } catch (error) {
      return Response.json({ error });
    }
  }
  ```
- Trigger `fetch("/api/send-email", { method: "POST", body: JSON.stringify(...) })` in Phase 3 of Iteration 4 when claim submissions or decisions are processed.
- Set up an environment variable in `.env.local` for `RESEND_API_KEY`.

---

## 4. Strict Workflow Restrictions

Refer to [docs/guidelines.md](file:///d:/GitHub%20Repositories/community-merits/docs/guidelines.md):
1. **Do NOT touch CSS**: Do not modify CSS configurations or global styles.
2. **Phase Scoping**: Scope all Iteration 4 features strictly to `activeIteration === 4` (except the general branding change from "MARS Portal" to "MARS").
3. **Compilation**: Ensure all typescript checks pass (`npx tsc --noEmit`) before wrapping up the implementation.
