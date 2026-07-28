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
- `guide.html`, `screenshots.html`, `changelog.html` — product documentation and release history.
- `docs/DEVELOPMENT.md` — implementation and maintenance notes.
- `docs/DESIGN.md` — adopted design system.

## Release updates

When publishing a desktop release, update both Windows and Mac download URLs in
`index.html`, update `changelog.html`, then verify every download before
deployment. The active desktop channels are the direct-sale Windows installer
and Mac DMG; the retired Mac App Store channel must not be restored.

## Deployment

Cloudflare Workers static assets are configured by `wrangler.toml`. Deployment
is a separate production action and is not implied by a Git push.
