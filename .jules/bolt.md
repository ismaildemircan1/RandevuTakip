## 2024-05-23 - Event Listener Network Calls
**Learning:** Attaching database queries directly to `input` events without debouncing causes O(N) network requests relative to characters typed, creating severe read-operation bottlenecks on Firebase Firestore.
**Action:** Always debounce text input fields that trigger network requests, or filter locally if the dataset is already fully cached in memory.
