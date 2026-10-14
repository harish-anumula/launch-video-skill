# Motion cheatsheet

## Easing (Remotion `Easing.bezier`)
| Use | Curve |
|---|---|
| Entrances, settles | `(0.16, 1, 0.3, 1)` ease-out-expo |
| Camera moves, wipes | `(0.65, 0, 0.35, 1)` in-out-cubic |
| Exits (faster than entrances) | `(0.7, 0, 0.84, 0)` |
| Snappy swaps | `(0.87, 0, 0.13, 1)` |

## Springs (`spring({ frame, fps, config })`)
| Use | Config |
|---|---|
| Classy, no bounce | `{ damping: 200 }` |
| Card snap-in with slight overshoot | `{ mass: 0.6, damping: 14, stiffness: 180 }` |
| Pops (badges, stamps) | `{ mass: 0.5, damping: 11, stiffness: 220 }` |
| Heavy camera / windows | `{ mass: 1.4, damping: 30, stiffness: 90 }` |

## Kinetic type
- Word reveal: each word in an `overflow:hidden` wrapper; inner span translates from 105% to 0, blur 10px → 0, over ~0.55s, triggered at the word's VO start time.
- Start from the product's own typeface and colours. Then pick one style family and stay in it:
  - **Product-native:** the product's UI font and palette throughout; feels like the app itself.
  - **Editorial:** a grotesk sans (e.g. Geist, Inter Display) with an italic serif (e.g. Instrument Serif) for one accent word; optional hand-drawn underline drawn with `strokeDashoffset`.
  - **Showreel / technical:** sans plus mono labels and a running timecode in the corners.
  - **Bold and playful:** a heavy rounded sans, saturated brand colours, bouncier springs and stickers or shapes.
  - **Cinematic dark:** big type on near-black, glows, slower camera moves.
- Big type (90–150px at 1080p) with tight tracking (−0.04em) suits most families. Keep the headline in one place per scene; swap lines by sliding the old one up out of its mask.

## Camera over UI
- Render the UI flat, wrap it in `perspective: 2400px`, animate `rotateX 16–24° → 5–8°`, small `rotateY`, and a slow push (`scale +3–6%`) across the scene.
- Device mockups (laptop/phone) sell "real product"; put the cursor *inside* the screen element so clicks stay aligned through the 3D move.
- Depth clouds: place icons on a jittered grid with a random depth z; size, blur and opacity follow z; drift z forward over time; sort by z for draw order.

## Transitions
- Whip: next scene's panel slides in with a skew while the old one slides out blurred.
- Iris: `clip-path: circle(r at x y)` growing from a meaningful point (the logo's centre).
- Rise/wipe: brand-colour panel translating up/sideways over the previous scene.
- Match cut: an element in scene A becomes the element in scene B (a card flies into the next layout).

## Texture
- Film grain: SVG `feTurbulence` re-seeded every 2 frames, 6–12% opacity (`multiply` on light, `soft-light` on colour).
- Soft radial glows behind UI; realistic shadows scaled with depth.

## Entrance vs hold
- For feeds, land each screen's content within ~1s and hold 4–5s. Speed up an authored entrance with a context multiplier on scene time (`SpeedCtx` in the template) instead of retiming every keyframe.

## Cursor
- Curved (arced) ease-in-out paths, 0.5–0.8s per move, click squash to ~0.82 and a ripple ring, fade in before and out after.
