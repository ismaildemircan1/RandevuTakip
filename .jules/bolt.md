## 2024-05-18 - Avoid redundant array traversals and type conversions in frontend
**Learning:** In the appointment management frontend, redundant `.find()` calls on the `appointments` array (e.g., in the `editAppointmentForm` submit handler) cause unnecessary O(N) traversals. Combined with repeated `parseInt(id)` calls, this adds minor but preventable overhead on every save.
**Action:** Cache the result of `parseInt(id)` and the `.find()` operation once, then reuse the cached values to construct updated objects, improving rendering/submission efficiency.
