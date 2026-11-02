import {Composition} from "remotion";
import {StudioTest} from "./compositions/StudioTest";

export const Root = () => (
  <Composition
    id="StudioTest"
    component={StudioTest}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1920}
  />
);
