# Release and deployment operations

Content/code ship through reviewed PRs. Run check, package, and git diff --check. CI validates on Linux and Windows and uploads the site and browser screenshots. Resolve conversations before merging; no automatic merge authority is configured. Require both platform checks through branch protection before opening community publication broadly.

Version starts at 0.1.0-alpha.1. Do not bump for every content PR. Explicit software releases use minor versions for features, patch for compatible fixes, and alpha.N/beta.N/rc.N progression. Content uses its own update metadata.

## Pages

Choose GitHub Actions as Pages source. Set PAGES_ENABLED=true in Actions repository variables, configure domain/DNS, then run Deploy Pages on main. Default CNAME is islandoutpost.dev. Optional PAGES_DOMAIN must be a bare hostname. Keep site.json.url aligned. DNS verification, certificate readiness, and HTTPS are maintainer checks.

The workflow builds even when deployment is disabled and reports why. Deployments run only from main after build, tests, and packaging pass, through the github-pages environment. Configure environment approvals for an additional live gate. PRs never deploy to the production domain. The project does not change repository settings or DNS.

After enabling, verify homepage, deep links, source links, downloads, player navigation/fullscreen, RSS, and mobile themes on the actual domain. Local checks do not prove host/DNS/certificate configuration. PAGES_ENABLED=false pauses future deployments but does not unpublish an existing site. Roll back by merging a revert PR and redeploying main.

Dependabot proposes pinned dependency/Action updates. Review Studio exporter/runtime updates separately: existing exports are versioned content, not regenerated automatically. Recheck stale incident snapshots and source availability when preparing follow-ups. Git remains the source of truth; no separate database needs synchronization.
