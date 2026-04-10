## 2024-05-15 - In-Memory Filtering vs Network Queries
**Learning:** Frequent events like 'input' (keystrokes) triggering full Firestore `get()` collection queries can cause heavy read operations and significantly slow down the UI, bypassing the initial data load that populated the application state.
**Action:** Always favor in-memory filtering of existing cached state (like the populated `patients` array) for UI interactions such as search, reducing unnecessary network requests and improving responsiveness.
