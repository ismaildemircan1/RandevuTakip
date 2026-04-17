## 2024-05-24 - Firestore Quota Exhaustion on Input Events
**Learning:** Binding an `input` event listener directly to a Firestore `get()` query without debouncing or client-side caching is a major performance bottleneck that causes rapid quota exhaustion and UI delay. O(N) database reads per keystroke is a massive anti-pattern.
**Action:** Always use client-side filtering on a pre-fetched array for search inputs whenever the dataset is small enough to fit in memory, or implement strict debouncing (e.g., 300-500ms) for server-side searches.
