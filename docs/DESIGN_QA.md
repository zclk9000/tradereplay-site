# TradeReplay 教程首页设计核对

- Source visual truth: `/var/folders/9l/b086cnm1603_z9w1thdt61hh0000gn/T/codex-clipboard-45ba7aaf-2a58-4e50-8f35-8affaeca9ba5.png`
- Implementation: `http://127.0.0.1:8823/guide.html`
- Implementation screenshot: `/private/tmp/tradereplay-guide-home-pass1.png` plus live pass-2 browser capture
- Combined comparison: `/private/tmp/tradereplay-guide-home-comparison-pass1.png`
- Viewport: 1753 × 953 CSS px
- Source pixels: 3506 × 1906, normalized from 2× to 1753 × 953
- Implementation pixels: 1753 × 953 at 1×
- State: desktop tutorial homepage, no search query, first two category rows visible

## Full-view comparison evidence

The implementation preserves the existing TradeReplay search hero and follows the selected reference for the category area: four equal columns, a large icon area above a compact centered label, consistent card ratios, and a regular two-dimensional grid. The dark TradeReplay palette is an intentional brand adaptation of the light green reference.

## Focused comparison evidence

A separate crop was not required because the normalized 1753 × 953 side-by-side comparison keeps the hero, search field, card proportions, icons, labels, spacing, and borders legible at the same time.

## Fidelity surfaces

- Typography: Existing TradeReplay display and body type remain consistent; category labels use a compact centered weight comparable to the reference.
- Spacing and layout: Four-column desktop grid, 118/52 visual-to-label split, 24 px column gap, and 22 px row gap match the reference composition closely.
- Colors and tokens: Reference green/white is deliberately mapped to TradeReplay blue/navy tokens without introducing additional decorative colors.
- Image and icon quality: Existing TradeReplay vector icon system is reused at 64 px with clearer 1.65 px strokes; no raster placeholders are present.
- Copy and content: All 11 live tutorial categories use their actual public names and destinations.

## Interaction and runtime checks

- Search field accepted `CFMMC` and returned one visible result.
- The “快速开始” category block navigated to the correct category page.
- No horizontal overflow at the comparison viewport.
- Browser console contained no warnings or errors.

## Findings

No actionable P0, P1, or P2 differences remain for the requested structure.

## Comparison history

- Pass 1: The selected reference and implementation were normalized to the same viewport and compared side by side. No blocking visual issue was found, so no repair iteration was required.
- Pass 2: User review found the category icons too small and the blue tones insufficiently coordinated. Icons were increased from 36 px to 64 px, their visual frame from 58 px to 84 px, and the card surfaces were consolidated into coordinated `#172740` / `#0d1725` blue-grey layers with a brighter `#8fb0ff` icon color. The updated browser capture confirmed the new icon scale, a three-column intermediate responsive layout, and no horizontal overflow.

## Follow-up polish

- P3: If a closer visual clone is ever desired, the card color could be made uniform bright blue and the search bar could overlap the category section. These were intentionally not applied because the user asked to retain the existing TradeReplay search hero and brand treatment.

final result: passed
