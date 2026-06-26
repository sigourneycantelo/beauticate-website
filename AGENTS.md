## Code Style Rules

- Keep files short: aim for <= 200 lines; hard limit 300 lines. If a change would exceed 200 lines, split into smaller modules/components.
- React components: one component per file. Only keep tiny, non-exported helper components in the same file.
- Avoid creating separate files for single-use, tiny helper components; keep them local and non-exported.

## When in Doubt

- Prefer extracting helpers/components over adding branching logic.
- If a change risks exceeding the complexity limit, refactor before adding logic.
