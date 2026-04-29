## 2024-05-18 - Avoid unnecessary database fetches on user input
**Learning:** The patient search input previously queried the entire database on every keystroke (`input` event) without debouncing. Also it destructively modified the global state `patients = [];`. This caused a massive network bottleneck and potential race conditions.
**Action:** Always filter data locally if the entire dataset is already available in memory (e.g., loaded during initialisation). Also, avoid mutating global state arrays that are supposed to act as caches.
