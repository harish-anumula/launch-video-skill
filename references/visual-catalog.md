# Visual catalog (template/src/visuals)

Pick one visual per feature beat. Vary them across the video; don't repeat the same move twice in a row. Preview them all in the `Catalog` composition (`npx remotion studio`, then open *Catalog*).

| Visual | Shows | Use it for |
|---|---|---|
| `DepthCloud` | 4 named cards deal in, then fly into a cloud of icons floating in 3D depth; optional click on the front one → connecting → success, checks ripple outward | "Works with A, B, C… and many more": integrations, templates, file types, languages, customer logos (with permission) |
| `ComposerAnswer` | A request is typed, becomes a sent bubble, a result card rises with optional bars | Anything the user asks and the product answers: AI assistants, search, commands, forms |
| `Notifications` | Notification banners drop in; newer ones push older ones down; an optional stack behind implies repetition | Things the product sends: alerts, scheduled reports, reminders, messages, deliveries |
| `Device` | A laptop rises; the camera eases from above to face-on with a slow push; rebuilt screen or a real screenshot | Any product with a screen; the hero shot of the richest screen |
| `Phone` | A phone rises and turns toward camera; rebuilt screen or screenshot | Mobile apps, on-the-go moments, checkout and pay flows |
| `BeforeAfter` | A wipe reveals "after" over "before" | Cleanups, automation, redesigns, "from 12 tabs to one view" |
| `Steps` | A checklist ticks itself off step by step | Workflows, onboarding, "set up in 3 steps", an agent doing work |
| `StatCountUp` | One big number counting up with a caption | A proof point. Only real, approved numbers |
| `Stamp` (components/App) | A word slams onto a card ("Done.", "Saved.") | The moment something is taken care of |
| `DashboardMock` | Example rebuilt screen with KPIs, a line and bars; a filter click updates everything | A starting point for rebuilding *your* product's real screen inside `Device` |

## Signature scenes (one per style preset)
Full-frame scenes of 3 to 6 s, built only from the preset tokens, so each also works as the one borrowed move in another preset. The registry is `visuals/signatures.tsx`; the `Signature` and `Sample` compositions play the active preset's, and the Catalog ends with all nine. The default storyboard plays the active preset's signature in one beat (see `video.config.tsx`).

| Scene | Preset | Shows | Default beat |
|---|---|---|---|
| `HeadlineProof` | Clean Launch | Word-by-word headline with one serif accent and its hand-drawn underline; one card rises on the headline's left edge and proves it (bars grow, sources land one per beat) | None (the Feature beats already are this look) |
| `BrandWhip` | Fast Concept | A near-black block whips in with real motion blur and the lockup assembles; the brand block rises in pill bars and the tagline builds at half the Clean Launch time | `reveal` |
| `KineticSlam` | Kinetic Type | One huge word per beat on a stiff spring with hard colour cuts, an optional stutter recap, then a final line whose last word takes the brand colour | `payoff` |
| `BentoSnap` | Bento Product | Seven cards fly into a bento grid as the camera settles, then each comes alive (chart, toggle, chat, input) | `ask` |
| `ChartMorph` | Data Story | Bars, dots, a line, a ring, proportional slices, then one big number with a caption | `notify` |
| `LineDraw` | System Diagram | Sources, hub and outputs draw themselves; a comet pulse runs through and the outputs light up with checks | `ask` |
| `SignalDiagram` | Night Signal Explainer | A dark three-step diagram with labelled parts; violet points of light flow into a ring, turn green and land in the result | `notify` |
| `PaperParallax` | Paper Cut | Six paper hill layers slide up into place with soft shadows, the sun rises with halo rings, calm depth-scaled parallax | `notify` |
| `CharacterCarry` | Mascot Carry | A character drops in, gets its headset, sits in the headline as a word, then hops into the caller slot of a phone's call pill and takes the call | None (it carries the whole film) |

## Beyond the catalog
- **Rebuild, don't record.** Simplified React rebuilds of the real screens (real copy, real layout, fictional data) stay sharp at 4K and every part can animate. Use real screenshots in `Device`/`Phone` when a rebuild isn't worth it.
- **One native element beats a full screen.** A phone's call pill at the top of the screen, one message bubble, a menu-bar item or a single app sidebar row proves a claim faster than a whole rebuilt screen, because viewers already know what it means. Rebuild only that element, crisply, in the OS's own shapes.
- **Moving sub-navigation must change the content.** If a sidebar highlight moves, show the page it points to.
- **Real 3D?** A Three.js layer (`references/three-d.md`) for an extruded 3D logo, an orbit of logo tiles, particles or a landscape; HTML captions stay on top.
- **New visual?** Write it in `visuals/` as `({ t, ...props }) => ReactNode`, drive everything from `t` (scene seconds), add it to the Catalog.
- **Map features to moves, not our examples.** A payments product might use `Phone` → `Steps` → `Notifications` → `StatCountUp`; a dev tool might use `ComposerAnswer` (terminal) → `BeforeAfter` (diff) → `DepthCloud` (languages) → `Device`.
