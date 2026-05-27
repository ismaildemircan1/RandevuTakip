## 2024-05-27 - Debouncing Firestore search
**Learning:** Found an input search listener triggering full Firestore collection scans on every keystroke. This causes massive unnecessary reads and ui lag.
**Action:** Implemented a standard `setTimeout` debounce delaying fetch until 300ms of inactivity.
