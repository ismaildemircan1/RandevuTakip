## 2023-10-27 - Debouncing Patient Search
**Learning:** Found a performance bottleneck where the patient search input (`patientSearch`) fired a database query on every single keystroke. This causes excessive read operations on the Firestore database and can impact both performance and cost.
**Action:** Implemented a debounce function wrapping the query logic inside a `setTimeout` with a `clearTimeout` to delay execution by 300ms. I'll remember to always debounce or throttle inputs that trigger expensive operations like network requests or database queries.
