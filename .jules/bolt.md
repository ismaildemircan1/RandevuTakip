## 2024-05-24 - [Debouncing Firestore search]
**Learning:** The patient search field queried Firestore `get()` directly on every keystroke, leading to excess database reads and UI blocking.
**Action:** Always check input listeners for external API or database calls in this app and wrap them in a `debounce` function.
