## 2024-04-12 - Debounced Rapid API calls

**Learning:** This codebase lacked debouncing for user inputs searching against Firestore, leading to potentially 1 database call per keystroke.
**Action:** Always wrap `keyup` or `input` triggers for search forms in a `setTimeout` to debounce network and DB calls.
