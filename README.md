# TradeReplay Website

Source for [tradereplay.dev](https://tradereplay.dev), the public website for
the TradeReplay Windows and Mac desktop application.

## Local preview

```bash
python3 -m http.server 8801 --bind 127.0.0.1 --directory public
```

Open:

- Chinese: <http://127.0.0.1:8801/>
- English preview: <http://127.0.0.1:8801/?lang=en>
- Three-mode section: <http://127.0.0.1:8801/#modes>
- Chinese Help Center: <http://127.0.0.1:8801/guide.html?lang=zh>
- English Help Center: <http://127.0.0.1:8801/guide.html?lang=en>

## Project layout

- `public/` — the complete deployable website. Public routes remain at the site
  root; styles, scripts, data and images are grouped below it.
- `content/` — editable source content used by Pages CMS and the build scripts.
- `scripts/` — content builders and publication-boundary validators.
- `docs/` — design, development and maintenance documentation.
- `_local/` — ignored local source material and design captures. It is never
  published or committed.
- `.pages.yml` and `wrangler.toml` — CMS and Cloudflare publication settings.

See [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md) for the page,
asset and folder indexes.

## Release updates

When publishing a desktop release, update both Windows and Mac download URLs in
`content/site/release.json`, update `public/changelog.html`, rebuild the
generated content, then verify every download before deployment. The active
desktop channels are the direct-sale Windows installer and Mac DMG; the retired
Mac App Store channel must not be restored.

## Validation

```bash
node scripts/check-repo-hygiene.mjs
node scripts/build-site-content.mjs
node scripts/validate-site-content-bindings.mjs
node scripts/validate-guide-content.mjs
node scripts/build-guide-content.mjs
node scripts/validate-public-site.mjs
```

`check-repo-hygiene.mjs` rejects tracked caches, local/private folders,
root-level page dumps and oversized files before they can reach a release.
CI and the production publishing workflow rebuild generated content and require
`git diff --exit-code`, so source and generated files must be committed together.

## Deployment

Cloudflare Workers static assets are configured by `wrangler.toml`.

The only normal production publishing route is the Pages CMS action
`发布当前官网（含教程）`. It runs
`.github/workflows/pages-cms-publish-guide.yml`, validates and rebuilds the
site, then deploys only `public/` from the current `main` branch to
`tradereplay.dev`.

- Save or commit every intended website change to `main` before publishing.
- A Git push alone does not deploy production.
- Do not run a separate manual production deployment from another task.
- Pages CMS tutorial edits are committed first; publishing remains an explicit
  second action so unfinished edits are not made public accidentally.
