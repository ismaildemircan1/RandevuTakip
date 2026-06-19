## 2026-06-19 - Debouncing Database Queries
**Learning:** In a Firestore-backed app without a local index, querying collections (like `db.collection('patients').get()`) directly within key events like `input` triggers massive database reads. This is an extreme performance bottleneck.
**Action:** When handling frequent DOM events (input, scroll, resize) that trigger API/database calls, ALWAYS implement a debounce strategy (e.g., using `setTimeout`) to delay execution until the user has paused interacting.
