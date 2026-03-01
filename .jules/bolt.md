## 2024-05-24 - Redundant Array Traversals
**Learning:** This codebase had a pattern of redundantly parsing the same value (`parseInt(id)`) and traversing arrays multiple times using `.find()` inside object initialization blocks (`appointments.find(a => a.id === parseInt(id))`). This causes an $O(n)$ operation to be unnecessarily repeated.
**Action:** When inspecting array operations, cache the result of `.find()` and redundant type conversions before reusing them, to ensure efficient state updates and object creations.
