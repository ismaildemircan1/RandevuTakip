## 2024-04-13 - Replace Firestore Search with DOM Filtering
**Learning:** The patient search feature was doing a full collection fetch (`db.collection('patients').get()`) on every keystroke. In a Firebase/Firestore app, this causes massive read operations and network lag.
**Action:** When filtering lists that are already fully rendered in the DOM, use simple DOM element filtering (`display: none` / `block`) or filter the local state array instead of querying the remote database.
