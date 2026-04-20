## 2024-05-24 - Firestore Query Optimization
**Learning:** Attaching database fetches directly to `input` events causes a barrage of queries on every keystroke, which can quickly hit rate limits or cause significant performance lag and costs.
**Action:** Always debounce input events that trigger API or database queries (like Firestore `get()`), specifically adding a reasonable delay (e.g., 300ms) to ensure queries are only run when the user pauses typing.
