## 2026-04-27 - Debounce Patient Search
**Learning:** The patient search input triggered a full Firestore 'get()' call on every single keystroke, creating massive network and processing overhead.
**Action:** Debounce input fields querying a database using a simple setTimeout logic to limit calls and improve performance.
