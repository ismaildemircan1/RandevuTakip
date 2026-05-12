## 2026-05-12 - [Debounce Input Event]
**Learning:** In a vanilla JS/Firebase architecture, attaching database queries directly to 'input' events without debouncing creates severe performance bottlenecks by hitting the Firestore backend on every keystroke.
**Action:** Always wrap search input handlers with a debounce function (e.g., 300ms) to batch queries and reduce unnecessary database reads.
