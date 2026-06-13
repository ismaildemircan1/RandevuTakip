## 2024-06-13 - Debouncing Firestore Queries
**Learning:** In Firebase/Firestore apps, binding `keyup` or `input` events directly to `db.collection('...').get()` can cause a massive spike in database reads.
**Action:** Always debounce input handlers that trigger backend/database requests.
