## 2024-07-04 - Debouncing Database Queries on Keystrokes
**Learning:** Found a critical bottleneck where `patientSearch` triggers a full `db.collection(patients).get()` on every single keystroke. In Firebase/Firestore, this not only blocks the main thread with continuous network requests but also scales read costs linearly with keystrokes.
**Action:** Always wrap real-time search inputs that trigger network requests with a debounce function, especially when querying full collections without pagination.
