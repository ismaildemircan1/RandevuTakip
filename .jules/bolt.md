## 2024-05-20 - Redundant array traversals in event handlers
**Learning:** Avoid executing the same `.find()` operation multiple times within the same block, as this leads to unnecessary O(N) traversals.
**Action:** Pre-compute and cache the results of `.find()` and type conversions like `parseInt()` when they are needed multiple times in an object definition or function logic.