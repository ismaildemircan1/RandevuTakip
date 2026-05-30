## 2024-05-18 - Debouncing Firestore Queries
**Learning:** Attaching async Firestore queries directly to an `input` event listener in Vanilla JS triggers unnecessary queries for every keystroke. This happens in `script.js` during patient searches.
**Action:** Always implement a debounce mechanism (e.g., `setTimeout`) for input fields that trigger expensive database or API calls to reduce load and prevent race conditions.
