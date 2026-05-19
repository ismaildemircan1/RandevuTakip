## 2026-05-19 - Optimize DOM Rendering & Database Queries
**Learning:** Found a common anti-pattern where DOM elements were being appended directly within loops causing layout thrashing, and event listeners were querying the database on every keystroke without debouncing or local filtering.
**Action:** When reviewing client-side rendering loops, look for opportunities to use `DocumentFragment` for batched DOM updates. Also, prefer local filtering on pre-fetched data arrays over making repeated network calls for simple text searches.
