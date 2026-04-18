## 2024-05-18 - Debounce Patient Search Event Listener
**Learning:** Adding a 300ms debounce to an event listener effectively reduced unnecessary database API calls.
**Action:** Always identify real-time search functions linked to expensive database calls and wrap them in a timeout to improve performance.
