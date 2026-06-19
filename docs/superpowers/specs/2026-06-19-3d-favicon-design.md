# 3D Isometric Cube Favicon

**Date:** 2026-06-19  
**Status:** Approved

## Goal

Replace the current inline SVG data-URI favicon (plain green rounded square with white "T") with a proper 3D isometric cube that reinforces the "stack" brand metaphor and reads clearly at all favicon sizes.

## Design

**Shape:** Isometric cube, seven anchor points, transparent background, 100×100 viewBox.

```
         (50, 10)           ← top apex
        /        \
      (14,30)  (86,30)      ← top face left/right
        \        /
         (50, 50)           ← center join
        /        \
      (14,70)  (86,70)      ← bottom face left/right
        \        /
         (50, 90)           ← bottom apex
```

**Three faces:**

| Face  | SVG path (M…Z)                              | Fill      | Role         |
|-------|---------------------------------------------|-----------|--------------|
| Top   | M 50,10 L 86,30 L 50,50 L 14,30 Z          | `#c8e6ce` | lit surface  |
| Left  | M 14,30 L 50,50 L 50,90 L 14,70 Z          | `#1b6b3a` | main face    |
| Right | M 50,50 L 86,30 L 86,70 L 50,90 Z          | `#0f3d1f` | shadow side  |

**Stroke:** `0.5px` in `#114a27` on all paths — sharpens edges at high DPI.

## Files Changed

1. **`public/favicon.svg`** — new file with the cube SVG
2. **`src/layouts/BaseLayout.astro`** — replace inline data-URI `<link rel="icon">` with:
   ```html
   <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
   ```

## Out of Scope

- `.ico` or multi-resolution PNG fallbacks (SVG favicon has universal browser support for modern browsers; Cloudflare Pages serves static files directly)
- Apple touch icon (separate task if needed)
