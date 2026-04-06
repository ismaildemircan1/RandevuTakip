## 2024-05-17 - Debounce Patient Search Firestore Query
**Learning:** Found a full Firestore query (`await db.collection('patients').get()`) being executed synchronously on every single keystroke within the `patientSearch` input listener. This blocks the UI and causes unnecessary reads.
**Action:** Implemented a debounce function with `setTimeout` to delay the execution of the query until the user pauses typing for 300ms. Will ensure to always review input event listeners that interact with external services or databases.
