## 2024-04-01 - Redundant Firestore Queries for In-Memory State
**Learning:** The application maintains global state arrays (appointments, patients) that are populated on render. Performing subsequent Firestore queries for operations like reminder checks is a severe architecture-specific bottleneck that duplicates network requests unnecessarily.
**Action:** Always reuse the populated global state arrays for derived operations (like filtering confirmed appointments) instead of issuing new Firestore queries to avoid redundant network overhead.
