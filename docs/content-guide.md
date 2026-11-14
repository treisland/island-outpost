# Content lifecycle

## Submission to publication

1. Open a Content submission issue with audience, section/topic, original article, sources, native Studio JSON, matching playback HTML, and a cover. ZIP attachments work without external hosting. Extra screenshots are optional: there is no screenshot-per-slide requirement.
2. A reviewer checks facts, source dates, interpretation, rights, private data, and every slide in Studio. Developing stories need a visible snapshot date and uncertainty. Prompt examples are illustrative unless model/version/settings/results were actually recorded.
3. Add an approved entry on a branch under `content/<id>/`, then open a linked PR with validation and review evidence.
4. A maintainer reviews and merges. A published entry deploys only when Pages is enabled. Article pages, collections, search, RSS, and sitemap rebuild together.

## Entry format

`npm run new-content -- useful-permanent-id prompt-lab` creates a draft. The other section is `briefings`. Drafts need basic structure but not completed assets/dates and are excluded from all public output. Repository history is public even for drafts.

| Field | Meaning |
| --- | --- |
| id | Lowercase folder slug; permanent after publication |
| status | draft or published |
| section | briefings or prompt-lab; part of permanent URL |
| title, summary | Reader-facing text |
| topic, format, tags | Search/filter metadata |
| author, license | Attribution and content license |
| published, updated | Valid YYYY-MM-DD; preserve original publication date |
| updateNote | Required if updated is later than published |
| snapshot | Optional visible research scope/date notice |
| minutes | Article reading estimate, integer 1–120 |
| cover | Local PNG, JPEG, or WebP screenshot |
| deck, playback | Local native JSON and standalone playback HTML |
| blocks | paragraph, heading, list, callout, code |
| sources | Array of objects with label and HTTPS url |

Text blocks use `{ "type": "paragraph", "text": "…" }`; lists use `{ "type": "list", "items": ["…"] }`. Raw HTML is escaped. Assets use simple local filenames, max 15 MiB each. Published entries need three body blocks and a source; minimums are not an editorial standard.

## Native assets and review

Import the JSON into Studio, inspect every slide and notes, export a standalone playback package, and extract index.html as playback.html. Capture a real player cover. Test import and playback offline. Additional screenshots are optional.

The builder checks native format, project ID, slide IDs/order, and playback-only flag. It cannot prove identical slide bodies: reviewers must verify the player was re-exported from the reviewed JSON. Playback HTML executes JavaScript. Inspect submitted files and regenerate with the trusted Studio exporter; do not publish arbitrary HTML. Embedded playback is sandboxed without same-origin permission. Opening standalone HTML executes it directly.

## Updates

Keep folder, id, section, project ID, and existing slide IDs stable. Edit the article/deck, regenerate playback and affected cover, retain published, advance updated, and add updateNote. Same-day substantive revisions should also include a note even though date validation cannot distinguish them. URL migrations/removals need a redirect or tombstone plan. Roll back through a revert PR; never rewrite main history.

Keep citations in the article and notes. Never fabricate quotes, results, approval, sponsorship, or live incident status. Recheck time-sensitive sources before updating.
