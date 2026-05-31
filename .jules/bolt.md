## 2023-10-27 - Debounce search to prevent read amplification
**Learning:** In a Firestore-backed app without a dedicated search service, adding an input listener that triggers a raw collection `get()` causes severe read amplification (O(N) reads * number of keystrokes where N is the total patients).
**Action:** Always wrap input-triggered remote queries in a debounce, especially when using NoSQL datastores with per-read pricing models like Firestore.
