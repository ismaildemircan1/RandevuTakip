## 2026-04-21 - In-Memory Search Optimization
**Learning:** Found a severe frontend performance issue where every keystroke fired a Firestore read query `db.collection('patients').get()`.
**Action:** Always check event listeners, especially for input events, to see if an in-memory cache/array can be used to filter data synchronously rather than issuing N+1 database queries on every keystroke.
