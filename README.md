# TradeReplay Website

Source for [tradereplay.dev](https://tradereplay.dev), the public website for
the TradeReplay Windows and Mac desktop application.

## Local preview

```bash
python3 -m http.server 8801 --bind 127.0.0.1
```

Open:

- Chinese: <http://127.0.0.1:8801/>
- English preview: <http://127.0.0.1:8801/?lang=en>
- Three-mode section: <http://127.0.0.1:8801/#modes>

## Main files

- `index.html` — bilingual homepage and all homepage content.
- `home-v10.css` — homepage layout, visual tokens and responsive styling.
- `home-v9.js` — language selection, tabs, reveal effects and video annotations.
- `assets/` — homepage screenshots, posters and compressed demonstration videos.
- `guide.html`, `download.html`, `changelog.html` — tutorials, downloads and release history.
- `support.html`, `privacy.html`, `terms.html`, `refund.html` — support and legal pages.
- `docs/DEVELOPMENT.md` — implementation and maintenance notes.
- `docs/DESIGN.md` — adopted design system.

## Release updates

When publishing a desktop release, update both Windows and Mac download URLs in
`index.html`, update `changelog.html`, then verify every download before
deployment. The active desktop channels are the direct-sale Windows installer
and Mac DMG; the retired Mac App Store channel must not be restored.

## Deployment

Cloudflare Workers static assets are configured by `wrangler.toml`.

The only normal production publishing route is the Pages CMS action
`发布当前官网（含教程）`. It runs
`.github/workflows/pages-cms-publish-guide.yml`, validates and rebuilds the
guide, then deploys the complete current `main` branch to `tradereplay.dev`.

- Save or commit every intended website change to `main` before publishing.
- A Git push alone does not deploy production.
- Do not run a separate manual production deployment from another task.
- Pages CMS tutorial edits are committed first; publishing remains an explicit
  second action so unfinished edits are not made public accidentally.
