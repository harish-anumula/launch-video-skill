import { Composition } from "remotion";
import { Launch } from "./Launch";
import { TIMING } from "./lib/time";
import { Thumbnail } from "./scenes/Thumbnail";
import { Catalog, CATALOG_COUNT, CATALOG_SECONDS } from "./Catalog";

const FPS = TIMING.fps;
const STYLE_TEST_END = TIMING.scenes[Math.min(2, TIMING.scenes.length - 1)].end; // hook + reveal + first feature

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Launch" component={Launch} width={1920} height={1080} fps={FPS} durationInFrames={Math.round(TIMING.duration * FPS)} />
    <Composition
      id="StyleTest"
      component={Launch}
      defaultProps={{ upTo: STYLE_TEST_END, poster: false }}
      width={1920}
      height={1080}
      fps={FPS}
      durationInFrames={Math.round(STYLE_TEST_END * FPS)}
    />
    <Composition
      id="Catalog"
      component={Catalog}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={CATALOG_COUNT * CATALOG_SECONDS * 30}
    />
    <Composition id="Thumbnail" component={Thumbnail} width={1920} height={1080} fps={FPS} durationInFrames={1} />
  </>
);
