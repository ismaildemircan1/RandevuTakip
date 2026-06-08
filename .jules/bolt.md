## 2024-06-08 - Debounce Patient Search
**Learning:** Found an input event listener triggering a full Firestore collection fetch `db.collection('patients').get()` on every single keystroke.
**Action:** Always debounce search inputs, especially when they trigger expensive database reads or API calls.
