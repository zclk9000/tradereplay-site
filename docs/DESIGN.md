---
version: "1.0"
status: adopted
name: TradeReplay Marketing Design System
updated: 2026-07-29
scope: tradereplay.dev marketing website
inspiration:
  repository: VoltAgent/awesome-design-md
  repository_commit: 664b3e78fd1a298ba11973822da988483256d4b4
  systems:
    - Coinbase
    - Raycast
    - Linear
    - Revolut
---

# TradeReplay DESIGN.md

## 1. Design intent

TradeReplay is a mature desktop trading practice and journal product, not a
broker, signal service, game, or speculative crypto landing page.

The website must communicate three things within the first viewport:

1. Users can define their own trading system.
2. They can run that system directly inside a K-line chart.
3. The product is a real Windows and Mac desktop application.

The design should feel like a **calm trading laboratory**:

- precise without looking mechanical;
- premium without luxury decoration;
- financial without exchange-page urgency;
- technical without becoming a dense dashboard;
- dark without becoming black-on-black;
- animated without becoming theatrical.

The memorable visual is a real TradeReplay chart workspace emerging from a
quiet blue-black canvas. The product interface is the illustration.

### Design influences

The system borrows principles, not brand identity:

- **Coinbase:** calm financial typography, modest display weight, editorial
  spacing, and restrained use of one action colour.
- **Raycast:** one continuous dark environment, real product UI as the dominant
  visual, hairline borders, and depth created mainly by surfaces.
- **Linear:** precise dark surface hierarchy, compact control geometry, and
  product screenshots that remain uncropped.
- **Revolut:** confident display scale, full-width product moments, and generous
  88–120px section rhythm.

TradeReplay must not look like a clone of any of these products.

## 2. Core principles

### 2.1 Quiet authority

Trust comes from clarity, proportion, and real product evidence. Do not use
aggressive claims, profit language, urgency timers, flashing finance motifs, or
decorative market data.

### 2.2 One idea per section

Each major section answers one question:

- What is TradeReplay?
- How does a trading system run?
- What are the three modes?
- What are the six product capabilities?
- How do I start, buy, learn, or get support?

Do not combine several unrelated messages in one card or paragraph.

### 2.3 The product is the visual

Use actual TradeReplay screenshots as the primary visual material. Decorative
graphics may support the screenshots, but must never replace or imitate the
product.

### 2.4 Density belongs inside the product

The desktop application may be data-dense. The marketing website must not be.
The website explains the product with generous space and selected evidence.

### 2.5 Restraint creates premium quality

Use one primary accent, one hero gradient, one shadow tier, one radius system,
and one consistent spacing scale. Repetition is more valuable than novelty.

## 3. Brand voice

### Tone

- calm;
- exact;
- encouraging;
- evidence-led;
- experienced;
- never promotional for its own sake.

### Chinese copy

- Prefer short, direct sentences.
- Use “你” rather than “用户”.
- Avoid four-line paragraphs.
- Avoid empty claims such as “重新定义交易” or “行业领先”.
- Avoid earnings, win-rate, or investment-return implications.
- Use Chinese punctuation and natural Chinese line breaks.

### English copy

- Use plain international English.
- Prefer active voice.
- Avoid crypto, brokerage, and “get rich” vocabulary.
- Do not translate Chinese sentence structure literally.
- Use sentence case, not title case, except for short navigation labels.

### Copy limits

| Element | Chinese | English |
|---|---:|---:|
| Hero headline | 2 lines, 20 characters per line maximum | 2 lines, 9 words per line maximum |
| Hero description | 70 Chinese characters | 24 words |
| Section headline | 16 Chinese characters | 8 words |
| Feature description | 52 Chinese characters | 20 words |
| Feature bullets | 3 maximum | 3 maximum |
| Navigation items | 4 primary items | 4 primary items |

## 4. Colour system

The palette is blue-black with one clear action blue. Cyan, green, and red are
semantic or product-screenshot colours, not marketing decoration.

```yaml
colors:
  canvas: "#070B13"
  canvas-soft: "#09101B"
  surface: "#0D1522"
  surface-elevated: "#111C2B"
  surface-strong: "#162235"

  hairline: "rgba(160, 180, 214, 0.12)"
  hairline-soft: "rgba(160, 180, 214, 0.08)"
  hairline-strong: "rgba(174, 195, 232, 0.22)"
  edge-highlight: "rgba(255, 255, 255, 0.06)"

  ink: "#F4F7FC"
  ink-soft: "#D6DDE9"
  body: "#A7B2C3"
  muted: "#78859A"
  faint: "#526076"

  primary: "#4B83F7"
  primary-hover: "#6597FF"
  primary-active: "#376FDE"
  primary-soft: "rgba(75, 131, 247, 0.14)"
  on-primary: "#FFFFFF"

  accent-cyan: "#32BED0"
  accent-cyan-soft: "rgba(50, 190, 208, 0.14)"
  semantic-up: "#35C49A"
  semantic-down: "#F16461"
  semantic-warning: "#E9B85F"
```

### Colour roles

- `canvas` is the default page background.
- `canvas-soft` may define an occasional full-width band.
- `surface` and `surface-elevated` create depth without relying on shadows.
- `primary` is reserved for the main CTA, active tabs, focus rings, and short
  link emphasis.
- `accent-cyan` is reserved for selected product states and small technical
  markers.
- `semantic-up` and `semantic-down` are used only for profit/loss or validation
  status. Prefer text, icons, and tiny indicators over large background fills.

### Hero gradient

The hero may use one soft atmospheric gradient:

```css
background:
  radial-gradient(ellipse at 22% 20%,
    rgba(25, 91, 151, 0.34) 0%,
    rgba(25, 91, 151, 0.12) 34%,
    transparent 62%),
  radial-gradient(ellipse at 82% 34%,
    rgba(83, 65, 153, 0.28) 0%,
    rgba(83, 65, 153, 0.09) 36%,
    transparent 65%),
  #070B13;
```

Rules:

- Use this atmosphere in the hero only.
- Do not repeat blue-purple gradients deeper in the page.
- Do not place a visible grid across the whole page.
- Do not add multiple glowing blobs behind every card.
- Gradient opacity must remain low enough for screenshots and type to lead.

## 5. Typography

The target is soft geometric clarity rather than the heavy, compressed look of
a trading exchange.

### Font families

```yaml
fonts:
  display-latin: "Manrope Variable"
  body-latin: "Manrope Variable"
  cjk: "Noto Sans SC Variable"
  cjk-system-fallback: '"PingFang SC", "Microsoft YaHei"'
  numeric: "IBM Plex Mono"
  system-fallback: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
```

Implementation:

- Self-host WOFF2 files when the design is adopted.
- Use `font-display: swap`.
- Subset Noto Sans SC if practical; keep system CJK fallbacks.
- Use the numeric face only for versions, prices, statistics, dates, and
  tabular figures.
- Never mix more than two visible font voices in one section.

### Type scale

| Token | Desktop | Mobile | Weight | Line height | Tracking | Use |
|---|---:|---:|---:|---:|---:|---|
| `display-hero` | 72px | 44px | 600 | 1.04 | -0.045em | Homepage h1 |
| `display-section` | 52px | 36px | 560–600 | 1.10 | -0.035em | Major section h2 |
| `display-card` | 32px | 28px | 600 | 1.18 | -0.025em | Feature h3 |
| `heading-lg` | 24px | 22px | 600 | 1.30 | -0.015em | Card titles |
| `heading-md` | 18px | 18px | 600 | 1.40 | 0 | Small headings |
| `body-hero` | 18px | 16px | 400 | 1.72 | 0 | Hero description |
| `body-md` | 16px | 15px | 400 | 1.70 | 0 | Standard body |
| `body-sm` | 14px | 14px | 400 | 1.60 | 0 | Secondary copy |
| `caption` | 12px | 12px | 500 | 1.50 | 0.02em | Metadata |
| `eyebrow` | 12px | 11px | 650 | 1.40 | 0.12em | Section taxonomy |
| `button` | 15px | 15px | 650 | 1.20 | 0 | CTA labels |
| `nav` | 14px | 14px | 560 | 1.30 | 0 | Navigation |

### Typography rules

- Hero and section titles must not exceed weight 600.
- Do not use weight 700–900 for large headlines.
- Use off-white `ink`, not pure white, for large text.
- Body text must use `body` or brighter; never use `faint` for paragraphs.
- Long text columns must remain between 560px and 720px.
- Keep Chinese and English max widths independent.
- Do not force Chinese and English into identical line breaks.
- Use `text-wrap: balance` for headings where supported.
- Use `text-wrap: pretty` for short paragraphs where supported.

## 6. Spacing and grid

### Spacing scale

```yaml
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 24px
  6: 32px
  7: 48px
  8: 64px
  9: 80px
  10: 96px
  11: 112px
  12: 144px
```

### Page rhythm

- Desktop major section padding: 112–120px.
- Hero top padding below navigation: 84–96px.
- Hero bottom padding after product image: 96px.
- Tablet major section padding: 88–96px.
- Mobile major section padding: 68–76px.
- Section heading to content: 48–56px desktop, 32–40px mobile.
- Card gap: 20–24px.
- Card internal padding: 28–32px desktop, 22–24px mobile.

### Containers

```yaml
containers:
  content: 1200px
  media-wide: 1320px
  reading: 720px
  hero-copy: 920px
  outer-gutter-desktop: 48px
  outer-gutter-tablet: 28px
  outer-gutter-mobile: 20px
```

Rules:

- Align all major sections to the same content edges.
- Allow hero media to be wider than the copy.
- Do not use a different maximum width for every section.
- Use a 12-column desktop grid with 24px gutters.
- Use 8 columns on tablet and 4 columns on mobile.
- Use empty space deliberately; do not fill every column.

## 7. Shape, borders, and elevation

### Radius scale

```yaml
radius:
  xs: 6px
  sm: 9px
  control: 12px
  card: 18px
  media: 24px
  pill: 9999px
```

Rules:

- Buttons and inputs use `control`, not pill radius.
- Cards use `card`.
- Large screenshot frames use `media`.
- `pill` is reserved for badges, compact tabs, and status labels.
- Do not mix several nearby radii such as 14px, 16px, 18px, and 20px without
  role-based reason.

### Borders

- Default: 1px `hairline`.
- Hover or selected: 1px `hairline-strong`.
- Product media may use an additional 1px top `edge-highlight`.
- Avoid double borders and nested outlines.
- If a section is already separated by background colour, omit its border.

### Elevation

Depth hierarchy:

1. Canvas: no border, no shadow.
2. Surface: surface colour plus optional hairline.
3. Selected surface: one brighter surface step plus stronger hairline.
4. Product media: one soft shadow tier.

The only approved shadow:

```css
box-shadow: 0 40px 100px rgba(0, 0, 0, 0.34);
```

Rules:

- Use the shadow on hero product media or one featured product panel.
- Do not put drop shadows on every card.
- Do not use coloured shadows on buttons.
- Do not use inset glow as a substitute for hierarchy.

## 8. Imagery and product screenshots

### Source requirements

- Use actual TradeReplay screenshots.
- Capture screenshots at 2× DPR where possible.
- Prefer PNG or lossless WebP for dense product UI.
- Do not generate fake chart interfaces.
- Do not redraw the desktop interface as approximate SVG.
- Do not place placeholder boxes in a delivered design.

### Composition

- One dominant product image per major feature section.
- Hero: real desktop screenshot inside the real computer shell.
- Three modes: show the exact system/mode panel that explains the copy.
- Six capabilities: show a focused screenshot for the active capability.
- Crop only when the crop removes irrelevant chrome and preserves the feature.
- Use `object-fit: contain` whenever a side panel, rule list, or chart context is
  necessary to understand the screenshot.
- Product images must never stretch.

### Framing

- Media background should be within one surface step of the screenshot.
- Use 16–24px outer padding only when the screenshot needs breathing room.
- Avoid captions below every image. Use one short factual caption only when the
  source needs clarification.
- Product images may overlap a section boundary by no more than 48px.
- Do not rotate screenshots.
- Do not stack more than two screenshots in one visual.

### Responsive imagery

- Serve smaller image files below 768px.
- Preserve the meaningful side of the screenshot when a crop is unavoidable.
- For dense desktop UI on mobile, show a purposeful detail crop or a full
  contained screenshot; never scale tiny unreadable text merely to fill width.
- Keep product media above 320px high on mobile when it is central to the
  section.

## 9. Motion

Motion should clarify hierarchy and make the product feel responsive.

### Timing

```yaml
motion:
  fast: 160ms
  standard: 240ms
  reveal: 640ms
  hero: 780ms
  easing-standard: cubic-bezier(0.2, 0.72, 0.2, 1)
  easing-exit: cubic-bezier(0.4, 0, 1, 1)
```

### Approved motion

- Hero copy: staggered opacity + 18px vertical rise.
- Hero product: opacity + 24px rise after copy.
- Section reveal: opacity + 18px rise.
- Tab change: 240ms fade with an 8px horizontal or vertical offset.
- Button hover: translateY(-1px).
- Product hover: optional perspective tilt limited to ±1.2° and 4px movement.
- Latest-price marker: one subtle red pulse every 1.8–2.2 seconds.

### Motion rules

- Animate only `transform` and `opacity` where possible.
- Do not animate large blur values.
- Do not animate every card independently on scroll.
- Do not use continuous parallax behind body content.
- Disable tilt on touch devices.
- Respect `prefers-reduced-motion`.
- Reduced-motion mode must preserve all content and state changes.

## 10. Navigation

### Desktop header

- Height: 72–76px.
- Position: fixed or sticky.
- Background at top: transparent dark surface.
- Background after scroll: `rgba(7, 11, 19, 0.88)` with backdrop blur.
- Logo left, four navigation links centre/right, actions at far right.
- Keep Chinese and English controls in the same position.

### Mobile header

- Height: 64–68px.
- Show logo, menu button, and language button.
- The menu opens as an opaque surface beneath the header.
- Do not allow hero text to show through the open menu.
- Menu links must have at least 48px tap height.

### Navigation labels

Chinese:

- 交易系统
- 三种模式
- 核心能力
- 教程与支持

English:

- Trading system
- Three modes
- Capabilities
- Guides & support

## 11. Hero

### Structure

1. Short technical eyebrow.
2. Two-line headline.
3. One concise description.
4. Primary and secondary CTA.
5. Three short trust facts.
6. Real product image beginning within the first viewport.

### Layout

- Copy is centred.
- Headline maximum width: 920px.
- Description maximum width: 720px.
- CTA row gap: 12px.
- Trust facts gap: 24px.
- Product media begins 48–64px below trust facts.
- At a 1265 × 712 viewport, the top of the laptop must remain visible.

### Hero rules

- Use only one gradient atmosphere.
- Do not use a full-page grid texture.
- Do not use more than two CTA buttons.
- Do not put product feature cards above the hero product image.
- Do not use inflated claims such as “Master the Market”.
- Do not mention investment returns.

## 12. Components

### Primary button

```yaml
height: 48px
padding: 0 22px
radius: 12px
background: primary
text: on-primary
type: button
```

States:

- Hover: `primary-hover`, translateY(-1px).
- Active: `primary-active`, no translation.
- Focus: 2px `primary` ring with 3px offset.
- Disabled: `surface-strong` background and `faint` text.

### Secondary button

- Height and radius match primary.
- Background: transparent or `surface`.
- Border: `hairline-strong`.
- Text: `ink-soft`.
- Hover: `surface-elevated`.

### Eyebrow

- Use the eyebrow type token.
- Colour: `primary-hover`.
- Uppercase only in English.
- Chinese remains natural Chinese, separated with middle dots where needed.
- Use once per major section.

### Mode tabs

- Three equal columns on desktop.
- Minimum height: 88px.
- No individual card shadows.
- Selected state uses `primary-soft`, a 2px primary indicator, and `ink`.
- Inactive state uses canvas and `muted`.
- Panel below uses one card container, not three nested cards.

### Capability navigation

- Six-item rail or compact grid.
- Active state uses one surface lift and a stronger hairline.
- Avoid a border around every inactive item.
- The active capability controls one main screenshot and one concise copy block.

### Feature media panel

- Copy width: 34–40%.
- Product media width: 60–66%.
- Minimum desktop height: 520px.
- Use one outer media radius.
- Avoid nested screenshot frames unless the source screenshot itself contains
  them.

### Purchase cards

- Two cards maximum: China/Taobao and International/Whop.
- Use equal height and identical structure.
- Highlight availability through label and CTA, not bright card backgrounds.
- Do not hardcode unverified prices.
- Chinese purchase route: Taobao.
- International route: Whop when publicly available.
- The free Windows and Mac downloads remain visible below purchase choices.

### Support cards

- Three entries: detailed guide, QQ support group, WeCom support group.
- Prefer a clean three-column list with one divider system.
- Use no decorative icons unless a consistent icon library is adopted.
- QQ group number may be shown as factual text.
- Do not invent a WeCom QR code.

### Footer

- One dark surface band.
- Product sentence limited to two lines.
- Three compact link groups maximum.
- Legal and platform information use caption type.
- Do not repeat primary CTAs in every footer column.

## 13. Page structure

Recommended homepage order:

1. Header
2. Hero with real K-line interface
3. Four-step trading-system loop
4. Three operating modes
5. Six product capabilities
6. Purchase and downloads
7. Guides and support
8. Final CTA
9. Footer

Do not insert testimonials until verifiable source material is available.

## 14. Responsive behaviour

### Breakpoints

| Name | Width | Behaviour |
|---|---:|---|
| Wide | ≥1440px | 1200px content, 1320px media |
| Desktop | 1024–1439px | Full navigation and two-column feature panels |
| Tablet | 768–1023px | Collapsed navigation, feature panels stack |
| Mobile | 426–767px | Single-column layout, 20px gutters |
| Mobile narrow | ≤425px | 40–44px hero type, compact section rhythm |

### Collapsing rules

- Navigation becomes a menu below 900px.
- Hero CTAs stack below 560px.
- Four-step loop changes 4 → 2 → 1 columns.
- Three mode tabs change from horizontal to a single compact vertical rail.
- Feature copy stacks above product media below 900px.
- Capability navigation changes to a 2-column grid below 680px.
- Purchase cards change from 2 columns to 1 below 768px.
- Support entries change from 3 columns to 1 below 768px.
- Footer changes from 3 columns to 1 below 680px.

### Touch and accessibility

- Minimum tap target: 44 × 44px.
- Do not rely on hover to reveal essential information.
- Focus indicators must remain visible on all dark surfaces.
- Tab lists support arrow-key navigation.
- Active tabs expose `aria-selected`.
- Panels use `role="tabpanel"` and correct labelling.
- Language toggle updates `lang`, metadata, accessible names, and image alt text.

## 15. Bilingual behaviour

- Chinese is the default for China visitors and direct Taobao traffic.
- English is a complete version, not a partial translation.
- Preserve `?lang=zh` and `?lang=en`.
- Keep language choice in `localStorage` where appropriate.
- Translate metadata, navigation, CTA text, support text, `aria-label`, and image
  `alt`.
- Chinese purchase CTA opens Taobao.
- English purchase CTA points to the Whop section until checkout is public.
- Do not show Mac App Store or MAS links in either language.

## 16. Do and do not

### Do

- Use the real product interface as the protagonist.
- Keep one continuous blue-black visual environment.
- Use one hero gradient and one primary action blue.
- Keep display weight at or below 600.
- Use 112–120px desktop section rhythm.
- Keep body text at 16px and approximately 1.7 line height.
- Use one surface ladder for hierarchy.
- Use hairline borders only when a boundary is necessary.
- Preserve screenshots without distortion or accidental cropping.
- Keep copy concise in both languages.
- Check desktop and mobile after every major visual change.

### Do not

- Do not add a global grid pattern.
- Do not repeat gradients throughout the page.
- Do not add glowing borders or coloured shadows to cards.
- Do not build a wall of equal feature cards.
- Do not nest cards inside cards without product-driven reason.
- Do not use more than three bullets per feature.
- Do not use weight 700–900 for large marketing headlines.
- Do not use low-contrast gray for important body copy.
- Do not centre every section; reserve centred composition mainly for the hero
  and final CTA.
- Do not create fake product screenshots, approximate SVG interfaces, or
  decorative market charts.
- Do not use emoji or text glyphs as interface icons.
- Do not fabricate testimonials, user counts, ratings, or performance claims.
- Do not show Mac App Store or retired MAS purchase paths.
- Do not deploy or replace the production homepage without explicit approval.

## 17. Implementation tokens

The CSS implementation should begin from these variables:

```css
:root {
  color-scheme: dark;

  --c-canvas: #070b13;
  --c-canvas-soft: #09101b;
  --c-surface: #0d1522;
  --c-surface-elevated: #111c2b;
  --c-surface-strong: #162235;

  --c-line: rgba(160, 180, 214, 0.12);
  --c-line-soft: rgba(160, 180, 214, 0.08);
  --c-line-strong: rgba(174, 195, 232, 0.22);

  --c-ink: #f4f7fc;
  --c-ink-soft: #d6dde9;
  --c-body: #a7b2c3;
  --c-muted: #78859a;
  --c-faint: #526076;

  --c-primary: #4b83f7;
  --c-primary-hover: #6597ff;
  --c-primary-active: #376fde;
  --c-primary-soft: rgba(75, 131, 247, 0.14);

  --c-cyan: #32bed0;
  --c-up: #35c49a;
  --c-down: #f16461;
  --c-warning: #e9b85f;

  --font-display: "Manrope Variable", "Noto Sans SC Variable",
    "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-body: "Manrope Variable", "Noto Sans SC Variable",
    "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-number: "IBM Plex Mono", ui-monospace, monospace;

  --space-section: 120px;
  --container: 1200px;
  --container-media: 1320px;
  --radius-control: 12px;
  --radius-card: 18px;
  --radius-media: 24px;
}
```

## 18. Review checklist

Before calling a homepage iteration complete:

- [ ] The hero explains custom trading systems and chart validation.
- [ ] A real K-line interface is visible in the first viewport.
- [ ] The page contains no retired App Store references.
- [ ] Chinese and English versions contain the same functional sections.
- [ ] The hero contains only one gradient atmosphere.
- [ ] There is no global grid texture.
- [ ] Major desktop sections have at least 104px vertical breathing room.
- [ ] No headline exceeds weight 600.
- [ ] Body copy meets contrast and remains at least 15px on mobile.
- [ ] No section contains more than one dominant screenshot.
- [ ] Important screenshots use `contain` where chart context or side panels
      matter.
- [ ] Cards do not rely on drop shadows for hierarchy.
- [ ] Mobile navigation, language switching, tabs, and CTAs work.
- [ ] Keyboard focus states are visible.
- [ ] `prefers-reduced-motion` is supported.
- [ ] Desktop and mobile screenshots have been compared with the selected visual
      references.
- [ ] Browser console has no errors.
- [ ] Production has not been deployed without explicit approval.

## 19. Agent prompt guide

When changing the website:

1. Read this file before editing.
2. Preserve the product facts and sales-channel rules.
3. Use real product screenshots already approved by the user.
4. Prefer removing decoration before adding new decoration.
5. Keep the selected blue-black palette, typography scale, spacing scale, and
   radius roles.
6. Verify Chinese and English together.
7. Capture the same viewport before and after major visual changes.
8. Fix P0, P1, and P2 design issues before handoff.
9. Do not commit the prototype into the TradeReplay application repository.
10. Do not deploy production without explicit user approval.
