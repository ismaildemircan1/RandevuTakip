## 2026-04-22 - Firestore Search Query Optimization
**Learning:** Attaching a direct event listener to an 'input' event that runs a full database query (`db.collection('patients').get()`) will trigger a query on every keystroke. This causes massive redundant reads in Firebase, quickly leading to degraded performance and higher costs.
**Action:** Always wrap search input handlers that perform expensive data fetching or computations in a `debounce` function to aggregate keystrokes into a single request.
