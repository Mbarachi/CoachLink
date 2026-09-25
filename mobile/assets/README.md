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
