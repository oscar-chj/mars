# User Acceptance Testing (UAT) Feedback Log

This document lists the UAT feedback comments and required changes for the Merit Activity Records System (MARS) / Community Merits platform prototype iterations.

---

## Iteration 1: Initial Prototype (Community Merits)

### Description
The initial release of the platform, featuring temporary "Community Merits" branding, legacy student matric numbers (`U232...`), and browser-default HTML date input fields.

### UAT Feedback Comments
1. **Reviewer A (Product Owner):**
   > "The platform name 'Community Merits' feels a bit generic. We should give it a more official, system-like identity. Let's rename the brand to **MARS (Merit Activity Records System)** across the pages and emails."
   
2. **Reviewer B (Academic Registry Office):**
   > "The student matric numbers displayed are using the outdated registry format (e.g. `U232...`). We must upgrade them to the new alphanumeric standard (e.g. `BC223014`) to test against realistic production data structures."
   
3. **Reviewer C (User Experience Lead):**
   > "The browser-default HTML date input (`<input type="date">`) is inconsistent between Google Chrome, Safari, and Firefox. It has poor usability on desktop screens. Please replace it with a modern custom popover Calendar component."

### Actions for Next Iteration
- [x] Rename brand to **MARS** (except under Iteration 1 view).
- [x] Update student model to use **BC223014** matric format (except under Iteration 1 view).
- [x] Implement custom popover `<Calendar>` component (except under Iteration 1 view).

---

## Iteration 2: Upgraded Prototype (MARS & Calendar)

### Description
The second iteration addressing the feedback from Iteration 1. It implements the new **MARS** branding, **BC223014** student matric format, and the custom popover **Calendar** component.

### UAT Feedback Comments
1. **Reviewer D (Quality Assurance Coordinator):**
   > "The new calendar popover looks great and works smoothly. However, I noticed that it allows me to select dates in the future (e.g., tomorrow, next month, next year). Students shouldn't be allowed to log or claim merits for activities that haven't occurred yet! We must add validation to restrict selection: only tomorrow and any other future dates should be disabled."

### Actions for Next Iteration
- [x] Integrate date-restriction logic in the Calendar popover so tomorrow and future dates are grayed out and unselectable (disabled).

---

## Iteration 3: Restricted Calendar (Final Release)

### Description
The final iteration of the prototype containing restricted calendar selection (future dates disabled).

### UAT Status
- 🎉 **Approved**: All feedback comments resolved. Future dates are disabled on the calendar input, and Zustand global synchronization and local storage persistence work perfectly under Phase 2 and Phase 3 options.
