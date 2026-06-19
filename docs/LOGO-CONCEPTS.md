# Logo Concepts — thestackmint

Reference for the approved logo direction.

## Chosen Direction

**Concept 4 (Prismatic Rainbow) + ALL CAPS + Stacked 2-Line layout (Concept 5 structure)**

```
THE          ← italic, purple-pink gradient, visible
STACKMINT    ← full rainbow gradient + 3D drop-shadow
```

### CSS Implementation

```css
/* Line 1 — THE */
background: linear-gradient(90deg, #f0abfc 0%, #a78bfa 50%, #818cf8 100%);
font-style: italic;
font-weight: 700;
letter-spacing: 0.22em;

/* Line 2 — STACKMINT */
background: linear-gradient(90deg,
  #f43f5e 0%, #fb923c 16%, #fbbf24 32%,
  #34d399 50%, #22d3ee 66%, #818cf8 82%, #e879f9 100%
);
font-weight: 900;
filter:
  drop-shadow(2px 2px 0 rgba(0,0,0,0.6))
  drop-shadow(4px 5px 12px rgba(0,0,0,0.5));
```

## Other Concepts Explored (for future reference)

- **Concept 1** — 3D Block Extrusion: coral/rose "the", purple→blue Stack, teal→green Mint with stacked drop-shadow extrusion
- **Concept 2** — Neon Glow: amber "the", fuchsia Stack, cyan-green Mint with outer neon glow
- **Concept 3** — Metallic Premium: gold "the", chrome-striped Stack, emerald-striped Mint
- **Concept 4** — Prismatic/Rainbow (CHOSEN): full spectrum gradient across STACKMINT ✓
- **Concept 5** — Stacked 2-Line: "the" top line, Stack+Mint bottom. Provided the LAYOUT used by chosen direction.

Live preview page: `/logo-preview` (src/pages/logo-preview.astro)
