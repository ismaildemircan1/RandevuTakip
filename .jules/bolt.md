## 2024-05-24 - DOM Append Bottleneck in List Rendering
**Learning:** The frontend application currently renders lists of patients and appointments by calling `list.appendChild(div)` directly inside `.forEach` loops. This causes a browser reflow and repaint for every single item added to the DOM, which scales poorly as the dataset grows and blocks the main thread.
**Action:** Always use `DocumentFragment` to batch DOM node creation in memory before appending the entire fragment to the DOM exactly once after the loop.
