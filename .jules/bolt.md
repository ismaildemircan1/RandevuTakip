## 2024-04-25 - Debounced Patient Search Input
**Learning:** The frontend made an asynchronous Firebase Firestore call `db.collection('patients').get()` on every single keystroke of the patient search input. This is extremely slow, inefficient, and expensive, especially as the database grows.
**Action:** Always wrap heavy API or DB queries tied to raw input events (like `onInput` or `onKeyUp`) with a simple debounce timeout (e.g. 300ms) to ensure operations only fire when the user finishes or pauses typing.
