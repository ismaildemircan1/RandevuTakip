## 2026-06-02 - Debounce Firestore Queries
**Learning:** In a Firebase-backed application, real-time input event listeners (like 'input' on a text field) can cause massive read operations if they trigger a database fetch on every keystroke. This causes rapid, redundant reads against Firestore `db.collection('patients').get()`, impacting both performance and cost.
**Action:** Always wrap high-frequency event listeners that make network/database calls in a debounce function (e.g. `setTimeout`) to ensure the query only executes when the user pauses or stops typing.
