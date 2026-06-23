## 2024-05-18 - Avoid frequent database queries on input
**Learning:** Found a major performance bottleneck where a Firestore database query was triggered on every keystroke during patient search.
**Action:** Always wrap input events that trigger API or database queries with a debounce function to avoid excessive requests and improve efficiency.
