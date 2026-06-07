## 2025-01-20 - Excessive Firestore Fetching on Input Search
**Learning:** Attaching an asynchronous fetching function directly to an `input` event listener, without debouncing, leads to a massive number of unnecessary API calls (one per keystroke). In this codebase, searching for a patient triggered a full Firestore collection fetch repeatedly.
**Action:** Always wrap data-fetching callbacks tied to user input (like search fields) in a debounce function (e.g., using `setTimeout` and `clearTimeout`) to limit the number of API calls and improve performance.
