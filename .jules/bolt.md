## 2024-05-14 - Debouncing Database Queries on Keystrokes
**Learning:** When searching Firestore collections via an input field on 'input' events, querying the database on every keystroke causes a massive amount of unnecessary reads and API calls, negatively impacting both performance and database quota limits.
**Action:** Always wrap search input event listeners in a debounce function (e.g., 300ms) to delay execution until the user has stopped typing.
