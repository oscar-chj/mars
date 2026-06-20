# Handoff: Community Merits Specification & Development

This document transfers context to the next developer agent for implementing the standalone **Community Merits** application.

---

## 1. Project Goals & Focus
The next session will focus on developing the Next.js, Shadcn UI, and Tailwind CSS v4 prototype. All work is **Phase 2 only** (Zustand + LocalStorage mock state) and must be implemented **horizontally and incrementally**.

---

## 2. Horizontal & Incremental Implementation Rules

You must implement the use cases in horizontal layers. **Do NOT build a single use case fully to Phase 2/3 before starting the others.**

1.  **Step 1 (Milestone 1 - Phase 1 UI)**: Build the static frontend views for ALL 6 use cases first. Configure the routes, page shells, Shadcn visual layouts, and form frames with static placeholder data.
2.  **Step 2 (Milestone 2 - Phase 2 Store)**: Build the global Zustand state store and connect interactive event hooks to ALL 6 use cases. Implement the LocalStorage persistence and the Base64 file reader.
3.  **Step 3 (Milestone 3 - Phase 3 Backend)**: (Reserved for later) Replace state hooks with database schemas and real API calls.

---

## 3. Important References
Please review these documents before starting:
-   **New Project Folder**: [d:/GitHub Repositories/community-merits](file:///d:/GitHub%20Repositories/community-merits)
-   **Design Specification**: [design-spec.md](file:///d:/GitHub%20Repositories/community-merits/docs/specs/design-spec.md)
-   **Documentation & UAT Guide**: [documentation-guide.md](file:///d:/GitHub%20Repositories/community-merits/docs/specs/documentation-guide.md)
-   **Custom Skills Directory**: `C:\Users\haojc\.agents\skills`

---

## 4. Suggested Agent Action Plan
1.  Read the custom skills directory `C:\Users\haojc\.agents\skills` and load the `brainstorming` or `writing-plans` skills.
2.  Verify the Next.js directory setup (`/src/app/`, `/package.json`) under `community-merits/`.
3.  Engage with the user in the chat to align on the folder paths, then write the implementation plan (`task.md`) for Milestone 1 (Phase 1 UI layouts for all 6 use cases).
