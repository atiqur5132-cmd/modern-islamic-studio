import {Composition} from "remotion";
import {FootageTest} from "./compositions/FootageTest";
import {StudioTest} from "./compositions/StudioTest";

const SHORTS = {fps: 30, width: 1080, height: 1920};

export const Root = () => (
  <>
    <Composition id="StudioTest" component={StudioTest} durationInFrames={150} {...SHORTS} />
    <Composition id="FootageTest" component={FootageTest} durationInFrames={150} {...SHORTS} />
  </>
);
