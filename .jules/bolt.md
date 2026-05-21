## 2024-05-18 - Debounced Client-side Real-time Search Queries
**Learning:** Found a direct listener on an input field `patientSearch` that triggered an `await db.collection('patients').get()` for every single keystroke. This causes excessive Firebase reads, which slows down the UI considerably and drastically increases read costs on pay-per-read databases like Firestore.
**Action:** Always verify if search inputs or any input listeners interacting with external systems are correctly debounced (typically around 300ms delay) to batch processing efficiently.
