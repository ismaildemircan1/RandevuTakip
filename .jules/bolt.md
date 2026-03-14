## 2026-03-14 - [Optimize DOM insertions]
**Learning:** Using `DocumentFragment` when iterating over data arrays correctly avoids layout thrashing and reflows/repaints, especially on long lists.
**Action:** Always batch element appends into a DocumentFragment instead of writing directly to the DOM for performance-critical lists.
