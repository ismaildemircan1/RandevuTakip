## 2024-05-24 - Firestore Query Debounce
**Learning:** Found that the patient search triggered a full Firestore query (`db.collection('patients').get()`) on every single keystroke.
**Action:** Always verify if high-frequency event listeners (like input) trigger expensive backend calls, and apply debouncing to optimize it.
