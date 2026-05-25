## 2024-05-25 - Avoid database queries on every keystroke
**Learning:** Firing a Firestore query on the `input` event for every keystroke without debouncing can quickly lead to rate limits, high costs, and performance bottlenecks, as each letter typed triggers a full database read.
**Action:** Always wrap search input handlers that perform network or database operations with a debounce function (e.g., a 300ms setTimeout) to ensure the query only fires after the user stops typing.
