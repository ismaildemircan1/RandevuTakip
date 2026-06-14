## 2026-06-14 - Unnecessary API calls on patient search
**Learning:** Found a performance bottleneck where database query (db.collection('patients').get()) was triggered on every single keystroke during patient search.
**Action:** Implemented a 300ms debounce on the input event listener to drastically reduce the number of queries while the user is typing.
