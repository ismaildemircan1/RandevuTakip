## 2024-06-24 - Debouncing Database Queries on Key Events
**Learning:** Attaching database queries (like Firestore `get()`) directly to `input` event listeners without debouncing causes severe performance bottlenecks. It creates an N+1 equivalent problem where every keystroke triggers an independent API call, potentially exhausting read quotas and locking the main thread.
**Action:** Always wrap search input handlers in a debounce function (e.g., using `setTimeout` and `clearTimeout` with a ~300ms delay) to batch input changes into a single API request after typing pauses.
