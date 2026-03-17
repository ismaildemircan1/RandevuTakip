## 2024-05-24 - DocumentFragment for DOM Batching
**Learning:** Appending DOM elements directly to the live DOM inside loops causes multiple reflows and repaints, which is a significant performance bottleneck, especially when rendering lists of appointments or patients.
**Action:** Always use `DocumentFragment` to batch multiple DOM appends in loops. Create the fragment, append all elements to it, and then append the fragment to the live DOM once.
