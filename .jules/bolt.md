## 2024-06-25 - Search Input Debouncing
**Learning:** The initial implementation triggered a database read for the entire `patients` collection on every keystroke in the `#patientSearch` input.
**Action:** Always check the input event listeners for external API or database calls. Debounce these calls by at least 300ms to reduce database queries significantly.
