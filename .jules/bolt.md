
## 2024-05-18 - Batching DOM Operations and Optimizing Array Traversal
**Learning:** Using `DocumentFragment` is crucial to batching multiple DOM manipulations. In loops rendering multiple elements, appending to `DocumentFragment` and then inserting the fragment to the DOM minimizes browser reflows and repaints, increasing rendering performance significantly.
**Action:** Always batch element appends into a `DocumentFragment` when rendering collections of data (e.g. lists, grids) rather than appending them individually.

## 2024-05-18 - Caching Array Findings and Casts
**Learning:** Repeatedly calling array methods such as `.find()` inside object initialization, especially with inline type casting (`parseInt()`), causes redundant O(N) traversals.
**Action:** Extract repeated calculations and array lookups into variables before they are needed to cache the results and reduce unnecessary compute time.
