## 2024-05-24 - Debouncing Database Reads on Input
**Learning:** The patient search feature was fetching the entire 'patients' collection from the database on every single keystroke (`input` event). This is a severe performance anti-pattern that leads to high database reads, potential UI blocking, and rate limiting issues.
**Action:** Always wrap input event handlers that trigger network requests or expensive operations in a debounce function (e.g., using `setTimeout`). This prevents excessive calls and ensures the operation only runs after the user has stopped typing for a brief period.
