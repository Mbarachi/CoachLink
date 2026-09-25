# App icon and splash source

`ios/` and `android/` are gitignored, so the generated icons in those projects
are not under version control. These files are — regenerate the native ones
with `npm run icons` after a fresh clone or `npx cap add`.

| file | what it is |
| --- | --- |
| `coachlink-icon.svg` | vector master, full-bleed square. Edit this first. |
| `coachlink-icon-maskable.svg` | same mark at 72%, for maskable/adaptive masks |
| `icon-only.png` | 1024, opaque — iOS app icon and the Android legacy launcher |
| `icon-foreground.png` | 1024, transparent — Android adaptive foreground |
| `icon-background.png` | 1024, solid ink — Android adaptive background |
| `splash.png` / `splash-dark.png` | 2732 — both ink, so the splash reads the same in either theme |

Colours: ink `#241C13` · terracotta `#E1623C` · cream `#F3E9DC`.

Two things to preserve if you re-export these from a design tool:

- **`icon-only.png` must have no alpha channel.** App Store validation rejects an
  RGBA app icon (ITMS-90717) even when every pixel is opaque.
- **`icon-foreground.png` carries the master's full framing, not a pre-shrunk
  one.** `capacitor-assets` insets it by 16.7% itself; shrinking it first makes
  the mark land about a third smaller than the legacy icon.

The web and PWA icons in `public/` are generated from the same geometry.

## Android needs a step capacitor-assets does not do

`npm run icons` runs `scripts/android-adaptive-icon.mjs` afterwards, which
replaces the Android adaptive icon with vector sources. Do not skip it, and
re-run it after `npx cap add android` — `android/` is gitignored, so the fix
cannot be committed.

capacitor-assets writes the adaptive foreground and background as PNGs at the
*legacy* launcher sizes (48/72/96/144/192). An adaptive layer is 108dp, which
needs 108/162/216/324/432, so at xxxhdpi the launcher was upscaling a 192px
bitmap to 432px — the mark and the flat background both came out visibly soft
on a real phone. The script writes a colour for the background, which cannot
blur, and a vector drawable for the mark, which is sharp at any density.

The vector is a transcription of `coachlink-icon.svg` with the master's
`translate(-1.75 -8.75)` baked into the coordinates. **Edit the SVG, then
update the script to match** — nothing derives one from the other.
