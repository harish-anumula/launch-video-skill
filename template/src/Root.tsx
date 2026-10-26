import { AbsoluteFill, Composition } from "remotion";
import { Launch } from "./Launch";
import { TIMING } from "./lib/time";
import { Thumbnail } from "./scenes/Thumbnail";
import { Catalog, CATALOG_FRAMES } from "./Catalog";
import { C, PRESET } from "./theme";
import { SIGNATURES } from "./visuals/signatures";

const FPS = TIMING.fps;
const SignatureScene: React.FC<{ dur: number }> = ({ dur }) => {
  const S = SIGNATURES[PRESET].Scene;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <S dur={dur} />
    </AbsoluteFill>
  );
};
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
      durationInFrames={CATALOG_FRAMES}
    />
    {/* The active preset's signature scene on its own, and the 6 s sample to share before the full build. */}
    <Composition
      id="Signature"
      component={SignatureScene}
      defaultProps={{ dur: SIGNATURES[PRESET].seconds }}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={Math.round(SIGNATURES[PRESET].seconds * 30)}
    />
    <Composition id="Sample" component={SignatureScene} defaultProps={{ dur: 6 }} width={1920} height={1080} fps={30} durationInFrames={180} />
    <Composition id="Thumbnail" component={Thumbnail} width={1920} height={1080} fps={FPS} durationInFrames={1} />
  </>
);
