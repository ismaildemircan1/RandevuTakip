## 2024-05-24 - Debounce Search Input
**Learning:** Found a search input triggering a full Firestore collection fetch on every keystroke. This causes massive unnecessary network requests and database reads.
**Action:** Always debounce search inputs that trigger API/Database calls to optimize performance and reduce costs.
