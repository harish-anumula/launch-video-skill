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

## Beyond the catalog
- **Rebuild, don't record.** Simplified React rebuilds of the real screens (real copy, real layout, fictional data) stay sharp at 4K and every part can animate. Use real screenshots in `Device`/`Phone` when a rebuild isn't worth it.
- **Moving sub-navigation must change the content.** If a sidebar highlight moves, show the page it points to.
- **New visual?** Write it in `visuals/` as `({ t, ...props }) => ReactNode`, drive everything from `t` (scene seconds), add it to the Catalog.
- **Map features to moves, not our examples.** A payments product might use `Phone` → `Steps` → `Notifications` → `StatCountUp`; a dev tool might use `ComposerAnswer` (terminal) → `BeforeAfter` (diff) → `DepthCloud` (languages) → `Device`.
