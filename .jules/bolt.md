## 2024-05-24 - Caching .find() and Type Conversions
**Learning:** In vanilla JS arrays representing state (like `appointments`), performing repeated `parseInt()` and `.find()` operations in hot paths (like event listeners) is a redundant performance drain.
**Action:** Avoid redundant array traversals by caching the result of `.find()` calls and performing type conversions (like `parseInt`) once before reusing the value.
