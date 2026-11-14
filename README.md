# Island Outpost

Visual AI briefings and practical prompt techniques for **islandoutpost.dev**. Read an article, play the complete presentation in your browser, or download an editable Presentation Studio JSON project.

GitHub stores the content, review history, and static site source. No database is required.

## Develop

Requires Node.js 22 or newer.

```sh
npm ci
npx playwright install chromium
npm run check
npm run package
npm run serve
```

Open http://127.0.0.1:4173. Edit `src/`, `scripts/`, or `content/`; `dist/` and `release/site/` are generated and untracked. Browser tests save screenshots under `test-results/`.

## Content

`npm run new-content -- your-permanent-id prompt-lab` creates an unpublished draft. Add the article, reviewed sources, native JSON, matching playback HTML, and a cover. Submit through an issue and linked PR. See [the content guide](docs/content-guide.md) and [CONTRIBUTING](CONTRIBUTING.md).

Published IDs and section paths remain stable. Revisions preserve the publication date, advance the updated date, and explain the change. Drafts never enter the public build, although this repository and its history are public.

## Publish

After reviewing and merging the initial PR:

1. Set repository Settings → Pages → Source to **GitHub Actions**.
2. Set Actions repository variable **PAGES_ENABLED** to `true`.
3. Configure the domain and DNS for **islandoutpost.dev**, then enable HTTPS when ready. Follow GitHub's [custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
4. Run **Deploy Pages** on `main`. Subsequent main pushes deploy automatically.

The deployment build writes `CNAME=islandoutpost.dev`; optional `PAGES_DOMAIN` overrides the hostname. Keep `site.json.url` aligned for canonical URLs, RSS, and sitemap. No workflow changes DNS or enables Pages on your behalf. A disabled deployment still builds and reports its reason in the job summary.

See [deployment operations](docs/release-process.md) and [future automation](docs/automation.md). No scheduled generator, advertising SDK, analytics, or email provider is configured.

Site code and original starter content: Apache-2.0. Standalone players include the Apache-2.0 Presentation Studio runtime; see [NOTICE](NOTICE). Cited third-party sources retain their own rights.
