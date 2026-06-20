# Project Implementation & Design Guidelines

This document outlines the engineering, design, and workflow guidelines established for the Merit Activity Records System (MARS) / Community Merits platform. Any agent working on this codebase must adhere strictly to these rules.

---

## 1. Engineering Phase & Iteration Principles

- **Strict Iteration Isolation**: Work on one iteration at a time. Never implement or leak features of future iterations (e.g., date restrictions, branding upgrades, validation) until the current iteration is fully completed, merged into `main`, and branched off.
- **Progressive Switcher Disclosure**: The iteration/phase switcher in the header must only display options up to the active development phase (e.g., if working on Iteration 2 Phase 1, only render options up to Iteration 2 Phase 1).
- **Phase Implementation Model**:
  - _Phase 1 (Static UI)_: Use local React state inside pages/views (does not sync to Zustand, resets on refresh/navigation).
  - _Phase 2 (Zustand Sync)_: Use global Zustand store but trigger parameterless store resets on reload.
  - _Phase 3 (LocalStorage Persist)_: Use global Zustand store with full LocalStorage state persistence across reloads.
- **Branding Default**: Ensure the default state on mount is the fully persistent Iteration 1 Phase 3 (unless saved iteration is specifically set to 2 in local storage), keeping the active dashboard functional and persistent by default.

---

## 2. Design Aesthetics & Usability Heuristics

- **No CSS Modifications**: Under no circumstances should you edit the CSS files (e.g., `index.css`, Tailwind config, global stylesheets). Modify only the components and markup using tailwind classes inline where required.
- **Avoid Obvious Branding Prefixes**: Do not prefix headers or titles with the system name when the user is already inside the system context (e.g., display "Claims Queue" instead of "MARS Claims Queue", and "System Logs" instead of "MARS Log Manager", and "Rankings" instead of "MARS Rankings").
- **Clean Component Typography**: Remove redundant icons next to page headers or inside card components. Keep icons only where they serve active visual cues or are requested (e.g., card badges, specific layout elements).
- **Match System with Real World (Nielsen Heuristics)**: Use human-friendly text. Eliminate technical terminology or jargon where possible (e.g., replace "SMTP Tracker" with "System Logs", "Bounced" with "Delivery Failures", and "Metadata" with "Details").
- **Layout Alignment**:
  - Left-align card descriptions and structures rather than centering everything.
  - Portal landing page cards must be fully clickable (wrapped in `<Link>`).
  - Do not use borders on primary action buttons inside cards (use cleaner ghost/inline elements).
  - Keep descriptions concise and useful.
- **Email Inspector Drawer Width**: The slide-out email inspection drawer should be wide enough to prevent horizontal scroll bars and content wrapping. Set the drawer width to `sm:max-w-[35vw]` (35% of the screen width) on desktop viewports.

---

## 3. Workflow Restrictions

- **Explicit Merge/Commit Approval**: Never run a git commit or merge operation without displaying the proposed diff to the user and asking for explicit permission first.
- **No Automatic Script Checks**: Do not run verification scripts like `yarn build`, `yarn typecheck`, or `yarn lint` automatically. Let the user check and verify everything first.

---

## 4. Subagent-Driven Development (SDD) Pipeline

- **Isolated Context Task Execution**: For each implementation task, spawn a separate `self` subagent. Construct clean, focused prompts defining the specific task rather than passing whole files or plans.
- **Implementer Self-Review**: The implementer subagent must perform a rigorous self-review (for completeness, code quality, YAGNI compliance, and tests) before reporting back.
- **Mandatory Two-Stage Review**: Every completed task must undergo a two-stage review pipeline using fresh subagents:
  1. _Spec Compliance Review_: Verify the code matches requirements exactly (no missing features, no overbuilding/nice-to-haves).
  2. _Code Quality Review_: Inspect code styling, scalability, error handling, and type safety.
- **Sequential review flow**: Never start the code quality review until the spec compliance review has fully passed (✅ Spec compliant).
