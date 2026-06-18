## 2024-10-24 - Avoiding Redundant DB Queries in High-Frequency Listeners
**Learning:** High-frequency event listeners (like search inputs on keystroke) shouldn't make direct database calls if the full data set is already cached in memory. Doing so blocks the UI and creates unnecessary network requests.
**Action:** Filter existing global state arrays (like `patients`) locally instead of making redundant `db.collection().get()` requests when possible.
