## 2026-05-07 - Debounce Firebase Queries
**Learning:** This codebase attaches raw `input` event listeners on search inputs that trigger full-table database scans (`db.collection('patients').get()`) synchronously. Without throttling or debouncing, typing quickly forces massive network spikes and unneeded Firebase reads.
**Action:** Always verify if search inputs in this application are wrapped in a debounce utility to prevent aggressive and costly API usage.
