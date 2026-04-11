## 2026-04-11 - Debouncing Search Inputs
**Learning:** In frontend applications connected directly to databases like Firestore, executing a query on every keystroke in a search input is a significant performance bottleneck. It causes excessive API calls and UI lag.
**Action:** Always wrap search input event listeners that trigger API calls with a debounce function to rate-limit the execution and improve performance.
