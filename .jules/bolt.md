
## 2024-05-24 - Firebase API Call Debouncing
**Learning:** Found an `input` event listener hooked up to a Firebase Firestore collection query that ran on *every* keystroke without debouncing. In a cloud database environment like Firebase, this results in excessive billed database reads and potential UI blocking.
**Action:** Always verify `input` event listeners that trigger network or database calls. Wrap such search/filter calls in a debounce (e.g. 300ms) utilizing `setTimeout` and `clearTimeout` to drastically reduce unnecessary API hits.
