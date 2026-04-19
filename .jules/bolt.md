## 2024-05-18 - Watch out for large auto-generated files not in gitignore
**Learning:** Found thousands of node_modules files modifying `git diff` output because `.gitignore` didn't include `node_modules/`. This makes it very hard to see changes.
**Action:** When working with JS projects, make sure `node_modules/` is in `.gitignore` to avoid accidentally committing them and blowing up diff sizes.
