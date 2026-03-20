## 2024-05-14 - Use DocumentFragment for list rendering
**Learning:** Appending elements iteratively within a loop directly to the DOM causes multiple reflows and repaints, drastically reducing frontend performance when listing appointments or patients.
**Action:** Always use a `DocumentFragment` to batch DOM appends before finalizing the insertion in a single operation.