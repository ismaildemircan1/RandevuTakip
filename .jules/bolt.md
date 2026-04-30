## 2024-05-30 - Firebase Firestore Search Debounce
**Learning:** Found a critical bottleneck where `db.collection("patients").get()` was being triggered on *every single keystroke* for an input search listener. In Firebase, this means fetching the entire collection repeatedly, which is highly inefficient and costly.
**Action:** Always check client-side search implementations hooked up to cloud databases (like Firebase) to ensure inputs are debounced. Wrapping the query inside a `setTimeout` prevents expensive, repeated reads.
