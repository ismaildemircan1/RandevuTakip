## 2026-05-14 - Debounce Firestore Queries
**Learning:** In a vanilla JS Firebase app, binding an 'input' event listener to a search field without debouncing causes a full collection read (`db.collection('patients').get()`) on every single keystroke. This quickly exhausts Firebase quotas and degrades performance.
**Action:** Always wrap frequent input events triggering DB or API calls in a debounce function (e.g., a 300ms `setTimeout`).
