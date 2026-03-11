## 2024-10-24 - DOM Batching for List Rendering
**Learning:** In this vanilla JS architecture, rendering large lists (like appointments and patients) by directly appending to the DOM inside loops causes severe browser reflows and repaints.
**Action:** Always use `DocumentFragment` to batch multiple DOM appends in loops, minimizing expensive operations and significantly improving render performance.
