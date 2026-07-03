## 2026-07-03 - [Firestore Read Optimization]
**Learning:** Found a critical bottleneck where the `patientSearch` input listener was triggering a full `db.collection('patients').get()` query on every single keystroke. In a Firebase setup, this can rapidly exhaust quota and degrade UI performance.
**Action:** Implemented a 300ms debounce pattern using `setTimeout` and `clearTimeout` to drastically reduce unnecessary API calls while maintaining responsive real-time search functionality.
