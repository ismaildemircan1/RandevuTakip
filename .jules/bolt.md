
## 2024-04-04 - In-memory arrays vs Firestore queries
**Learning:** Functions like `checkReminders` should reuse existing global in-memory arrays (e.g., `appointments`, `patients`) that were already populated, rather than performing redundant `.where().get()` Firestore queries which introduce unnecessary network latency.
**Action:** Always check if required state already exists in global arrays before issuing new database queries in the frontend.
