## 2024-05-14 - Batch DOM insertions with DocumentFragment

**Learning:** When using `replace_with_git_merge_diff` to add `const fragment = document.createDocumentFragment();` before a loop, it's very easy to accidentally omit the declaration if the function structure is slightly different or if the diff context isn't perfectly matched, leading to a `ReferenceError` when `fragment.appendChild(div)` is called. The `DocumentFragment` pattern must be meticulously applied to *every* loop that renders items.

**Action:** Always verify the full diff (using `git diff --cached` or reading the file) after applying a `DocumentFragment` optimization to ensure that `const fragment = document.createDocumentFragment();` is declared in the correct scope before it is used inside the loop, especially when modifying multiple similar functions (like `renderAppointments`, `renderPatients`, and `patientSearch`).
