# Contributing

Start with an issue describing the reader outcome, scope, sources, and proposed change. Work on explicitly assigned tasks or issues labeled `agent-ready`. Use a `codex/` feature branch for agent work and a linked PR; never push directly to main or bypass checks.

For content, follow [the content guide](docs/content-guide.md). Attach files directly to the issue when external hosting is unavailable. ZIP the JSON and playback HTML if GitHub does not accept those extensions. Reviewers should inspect files before opening untrusted HTML.

Run `npm run check`, `npm run package`, and `git diff --check` for implementation or publication changes. Record actual results and remaining manual checks in the PR. Update Unreleased and affected docs. Edit source, not dist/release. Keep credentials, private notes, customer materials, and personal data out of submissions.

Format tests do not establish factual accuracy, rights, or editorial approval. A maintainer reviews facts, sources, visuals, accessibility, and readiness. Merge only after checks pass and review conversations are resolved. There is no automatic merge or editorial approval workflow.
