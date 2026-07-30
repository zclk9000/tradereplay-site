# TradeReplay website development

Last updated: 2026-07-29

## Source of truth

The production website lives in the independent repository:

`/Users/charlie/ClaudeCode/tradereplay-site`

Do not place website source in the TradeReplay application repository. Prototype
folders, audit output, raw recordings and temporary screenshots are not
production assets.

Every AI or development task must read the repository-root `AGENTS.md` before
changing files. New tasks use isolated Git worktrees below
`/Users/charlie/ClaudeCode/TradeReplay/.worktrees/`; do not create peer copies
of this repository beside the canonical checkout.

## Homepage architecture

The homepage is deliberately dependency-free:

- semantic HTML in `public/index.html`;
- CSS tokens, responsive layout and motion in `public/styles/home-v10.css`;
- progressive enhancement in `public/scripts/home-v9.js`;
- static screenshots and compressed MP4 demonstrations in `public/assets/`.

The page remains readable if JavaScript is unavailable. JavaScript adds
language selection, tab behaviour, reveal transitions and time-synchronised
video annotations.

## Page structure

1. Hero — positioning, download CTA and a real TradeReplay desktop screenshot.
2. Trading-system workflow — define rules, run them in the chart, validate and refine.
3. Three run modes — checklist, signal navigation and automatic backtest.
4. Six capabilities — systems, backtests, evidence, diagnosis, journal and Mentor AI.
5. Purchase, download, guides and support.

The homepage should keep one idea per section and use real product evidence
instead of decorative trading graphics.

## Three-mode demonstrations

Each mode uses a native `<video>` element with the browser play, timeline and
volume controls. Fullscreen, remote playback, picture-in-picture and downloads
are disabled because the annotations are HTML overlays and would not appear in
the browser's fullscreen video surface.

| Mode | Video | Annotation starts | Behaviour |
|---|---|---:|---|
| Checklist | `public/assets/modes/mode-checklist.mp4` | 5.76 s | A tracked signal point follows the chart; the strategy panel and explanatory label are connected with a dashed leader. |
| Signal navigation | `public/assets/modes/mode-signal.mp4` | 5.78 s | The matched signal and strategy panel are highlighted when navigation finds the rule. |
| Automatic backtest | `public/assets/modes/mode-backtest.mp4` | 6.00 s | The automatic-execution strategy panel is highlighted and connected to the lower-right explanation; no extra signal point is drawn. |

Timing is configured with `data-trigger-time` on each
`[data-mode-video-demo]` element. Checklist signal tracking coordinates are in
`setupModeVideo()` in `public/scripts/home-v9.js`. Overlay geometry is defined
by the corresponding `.mode-video-*` selectors in
`public/styles/home-v10.css`.

When replacing a recording:

1. Keep its content aspect ratio unchanged.
2. Compress it for the web while preserving its audio track.
3. Export a poster from the same recording.
4. Recheck the trigger time and all overlay coordinates at desktop and mobile widths.
5. Confirm that switching tabs pauses the previous video.

## Language and regional entry

Chinese is the default for `tradereplay.dev`. The current static implementation
supports an English preview with `?lang=en` and stores no visible language
switcher in the header.

The intended public English entry is `/en` for Whop traffic. IP-based routing
may later select a default, but `/en` must remain a deterministic override.
Chinese copy may mention mainland-China sales and support channels. English copy
must be written for overseas Whop customers and must not advertise unavailable
channels.

## Product and sales constraints

- Desktop platforms: Windows and direct-sale Mac DMG.
- Mac App Store is retired and must not be shown as an active channel.
- Chinese purchase CTA points to Taobao.
- Whop is planned for the English version; do not publish a placeholder checkout.
- Avoid profit promises, investment advice, artificial urgency and unsupported
  market coverage claims.

## Accessibility and motion

- Tabs use `role="tablist"`, `role="tab"` and `role="tabpanel"`.
- All meaningful images have bilingual alternative text.
- Keyboard focus remains visible.
- `prefers-reduced-motion` disables nonessential animation.
- Body copy and controls must maintain readable contrast on the blue-black surface.

## Website analytics

The public website uses the donation-supported GoatCounter service at
`tradereplay.goatcounter.com`. `public/scripts/site-analytics.js` loads its
cookie-free tracking script only on the production hostname. The homepage footer
reads `/api/site-visits`, a same-origin, read-only proxy implemented by
`worker/index.mjs`, and falls back to an em dash when the analytics service is
unavailable. Privacy extensions can still block the third-party tracking script
without breaking the public aggregate count.

The GoatCounter setting “Allow adding visitor counts on your website” must
remain enabled for the public footer count. Localhost previews are never sent to
GoatCounter.

The Cloudflare routes `tradereplay.dev/*` and `www.tradereplay.dev/*` are
managed in Cloudflare rather than by the GitHub Actions token. Keep route entries
out of `wrangler.toml` and leave `workers_dev = false`; this lets routine content
deployments update the existing Worker without requiring zone-route permissions.

## Validation checklist

Before committing:

1. Run `node scripts/check-repo-hygiene.mjs`.
2. Serve `public/` over HTTP; do not validate with `file://`.
3. Check Chinese and English content.
4. Check widths near 1440, 1024, 768 and 390 px.
5. Play all three videos with audio and seek across each annotation trigger.
6. Verify Windows and Mac download URLs.
7. Verify guide, screenshots, changelog, privacy, terms and support links.
8. Confirm there are no missing local assets or console errors.
9. Run the complete build and validation sequence from `README.md`.
10. Confirm CI reports no generated-file drift; it rebuilds content and runs
    `git diff --exit-code` against the committed output.
11. Stage only production files—never `_local/`, raw recordings, temporary
   screenshots, audit folders or prototype directories.

## Deployment boundary

Git commit and push do not deploy the website. Production deployment uses the
Cloudflare configuration in `wrangler.toml` and requires separate explicit
authorization. Its asset directory is `public/`; repository source, docs and
local material are outside the publication boundary.
