## 2023-10-27 - Debouncing database queries
**Learning:** Database search queries (like Firestore `.get()` or `.where()`) fired on every keystroke can lead to rapid quota exhaustion and UI lag.
**Action:** Always wrap search input listeners that trigger network requests with a debounce function (e.g., a 300ms `setTimeout`) to batch typing events.
