# Real 3D with Three.js (`@remotion/three`)

Use it when a shot needs real depth: objects you orbit, lighting and reflections, a logo extruded in 3D, a model file, or thousands of particles moving in 3D. For flat UI depth (tilted screens, a parallax logo cloud, a device mockup) CSS perspective, scale and blur are faster to render, stay pixel-sharp and are usually enough. Mixing both is normal: a `ThreeCanvas` for the 3D layer with HTML captions on top.

## Setup
```bash
npx remotion add @remotion/three            # adds only @remotion/three
npm i --save-exact three @react-three/fiber @types/three   # its peers are NOT installed for you
```
Render with GPU WebGL, or the canvas comes out blank ("Error creating WebGL context"):
```bash
npx remotion render Main out/raw.mp4 --gl=angle      # macOS / machines with a GPU
npx remotion render Main out/raw.mp4 --gl=swangle    # Linux without a GPU (slower, software)
```
or once in `remotion.config.ts`: `Config.setChromiumOpenGlRenderer("angle");`. A ~15 s 1080p scene with a few thousand objects renders in about a minute on an Apple-silicon laptop.

**Delete old outputs before each render.** A render that fails on WebGL leaves the previous file in place, and the next step (loudness, contact sheet) silently processes the stale video.

## Rules that keep frames correct
1. **Everything is a function of the frame.** `const t = useCurrentFrame() / fps`, then positions, rotations, colours and shader uniforms come from `t`. Never `useFrame`, `THREE.Clock`, `performance.now` or `Math.random` at render time: Remotion renders frames out of order across several browser tabs. Use a seeded PRNG at module scope or in `useMemo` for scatter.
2. **Camera per frame.** Set position and `lookAt` during render:
   ```tsx
   const Cam: React.FC<{ pos: [number, number, number]; look?: [number, number, number] }> = ({ pos, look = [0, 0, 0] }) => {
     const { camera } = useThree();
     camera.position.set(...pos);
     camera.lookAt(...look);
     return null;
   };
   ```
3. **Assets inside `ThreeCanvas` must be held with `delayRender`.** Remotion does not wait for Suspense or `useLoader` there; the frame renders before the texture arrives and comes out blank. Load outside the canvas and pass the texture down:
   ```tsx
   const useTexture = (src: string) => {
     const [handle] = useState(() => delayRender(`texture ${src}`));
     const [tex, setTex] = useState<Texture | null>(null);
     useEffect(() => {
       new TextureLoader().load(src, (t) => { t.colorSpace = SRGBColorSpace; setTex(t); continueRender(handle); });
     }, [src, handle]);
     return tex;
   };
   ```
   The same applies to `fetch` of an SVG, fonts drawn onto a canvas, and model files. A `CanvasTexture` you draw synchronously needs no wait (handy for logo tiles: draw the SVG logo onto a rounded-rect canvas).
4. **Exact brand colours:** pass `flat` to `<ThreeCanvas>` (no tone mapping) and `toneMapped={false}` on unlit materials. With the defaults, a saturated brand blue renders noticeably darker. Lit `meshStandardMaterial` still shades darker on the sides; that's what makes it look 3D.
5. **Additive blending saturates to white** where many points overlap (a cluster of 90 glowing particles becomes a white blob). Use normal blending for the cores and dim additive halos, or lower intensity as density grows.
6. **WebGL lines are always 1 px**, so a "ring" or "path" drawn with `lineLoop` is nearly invisible at 1080p. Use a thin mesh ribbon or tube for strokes that must read.
7. **Point sizes:** with `sizeAttenuation`, three.js draws a point `size · (viewportHeight/2) / distance` pixels, so a dot-grid image needs `size ≈ 0.92 · pitch / tan(fov/2)` to tile without gaps. Check a full-resolution frame; half-scale stills hide gaps.
8. **Shaders:** create the `ShaderMaterial` in `useMemo` and set `material.uniforms.uTime.value = t` in the component body. For a fullscreen shader use an orthographic `ThreeCanvas`, a `planeGeometry args={[2, 2]}` and `gl_Position = vec4(position.xy, 0., 1.)`.

## Recipes
- **3D logo from the SVG:** `new SVGLoader().parse(svgText).paths` → `SVGLoader.createShapes(path)` → `ExtrudeGeometry(shapes, { depth, bevelEnabled: true, curveSegments: 48 })`. Translate to the mark's centre and scale by `(1/s, -1/s, 1/s)` (SVG y points down), use `side: DoubleSide`. Separate paths become separate meshes, so a mark made of rings can fly in and spin piece by piece, then lock flat into the logo on the music's hit.
- **Logo cloud / connector orbit:** tiles as `planeGeometry` with a canvas texture, turned to face the camera with `yaw = atan2(cam.x - x, cam.z - z)`; blend positions from a scattered "chaos" layout to an orbit to "pulled into the centre".
- **Particles with physics:** precompute every particle's path once (e.g. gradient descent with momentum and seeded noise on an analytic surface) into arrays, then index them by time; draw `points` plus trail `lineSegments` updated per frame. Simulate offline first (a few lines of Python) to check where particles end up and when they settle, then control pacing through the time → step mapping rather than the physics constants.
- **Terrain:** grid lines on a displaced surface read better than triangle wireframe (diagonals look noisy); add an occluding dark fill mesh with `polygonOffset` so hills hide what's behind them.

- **Particles that form words and shapes:** draw the text or logo on a canvas (Google font loaded first), sample N filled pixels per shape, then rank-order every shape by (angle bin, radius) around its centre so particle k takes the k-th point of each. Morphs then travel as one coherent motion instead of a snowstorm. Put all positions in the vertex shader (one attribute per target, a per-stage start/duration/spread uniform, a per-particle delay) so 100k points render fast.
- **One event per beat:** for "step by step" processes (denoising, training steps, a build), quantise progress to the measured beat grid and ease each step quickly (~35% of a beat), so the music literally drives the transitions.

## Framing and pacing
- Render stills across the shot before the full render and look at them; 3D framing is where most first attempts fail (a terrain that fills a 16:9 frame leaves half of a 4:5 frame empty; a low camera hides the valleys you care about; a near camera clips tiles).
- Keep captions in a clear band: a fog/scrim gradient behind the caption area (or reserve the sky above a horizon) so 3D objects never pass under text.
- Let the camera follow the music's arc: slow and low in a calm intro, a crane or push when the groove enters, a resolved front-on hold for the end card. One continuous camera move usually beats cuts in a 3D shot.
- Spinning parts strobe at 30 fps above roughly 15° per frame; keep rotations slower or add motion blur.
- A frame-0 poster (the most striking moment plus a title on frame 0) makes Slack and feed previews look finished, but it flashes for one frame at autoplay and on every loop when it differs from frame 1. For platforms that take a custom thumbnail (LinkedIn, YouTube), render the poster as a separate still instead; keep frame-0 posters only where the end card equals the poster (loops stay seamless).
- Captions: a push transition (old words slide up and out on the beat as new ones rise in) avoids blank gaps between lines.
- Encode for social: render PNG frames (`--image-format=png --pixel-format=yuv420p --color-space=bt709`) so the file is tagged BT.709 and platforms don't shift dark gradients; mux audio with `-shortest -movflags +faststart`.

## Review loop that works
Render, make a 4-fps contact sheet plus 1-fps full-res frames, and give them with the source and the music's beat map to a fresh reviewer agent with a creative-director brief (story clarity, scroll-stop in the first 2 s, pacing, framing incl. platform UI safe areas, motion quality, beat sync, typography, accuracy of every claim). Fix, re-render, and run a second round that verifies each earlier finding as FIXED / PARTLY / NOT FIXED. Two rounds caught issues neither the author nor stills alone did (a lock that happened a second before the hit, mirrored logos, a hero object out of frame, an over-claiming caveat).
