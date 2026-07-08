## 2026-07-08 - [Patient Search Performance Improvement]
**Learning:** In a plain vanilla JS app with Firestore querying on each input stroke, wrapping it with a basic JS `setTimeout` debounce is one of the quickest massive performance gains one can get. No `e.target` issues here because the event itself wasn't a React pooled event, meaning the `e.target.value` is directly accessible asynchronously inside the timeout.
**Action:** Always check vanilla JS event listeners for DB or API calls inside fast-firing events like 'input' or 'scroll'.
