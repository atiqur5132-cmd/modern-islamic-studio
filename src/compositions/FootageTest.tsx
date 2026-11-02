import {AbsoluteFill, OffthreadVideo, staticFile} from "remotion";

export const FootageTest = () => (
  <AbsoluteFill style={{backgroundColor: "#0A1426"}}>
    <OffthreadVideo src={staticFile("footage/pipeline-test.mp4")} />
  </AbsoluteFill>
);
