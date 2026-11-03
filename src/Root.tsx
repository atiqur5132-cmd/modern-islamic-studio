import {Composition} from "remotion";
import sampleEdit from "../projects/quran-facts/edit.json";
import {Short} from "./compositions/Short";
import {StudioTest} from "./compositions/StudioTest";
import {Thumbnail} from "./compositions/Thumbnail";
import {Edit, editDurationInFrames, FPS} from "./timeline/types";

const SHORTS = {fps: FPS, width: 1080, height: 1920};

export const Root = () => (
  <>
    <Composition
      id="Short"
      component={Short}
      defaultProps={sampleEdit as Edit}
      durationInFrames={1}
      calculateMetadata={({props}) => ({durationInFrames: editDurationInFrames(props)})}
      {...SHORTS}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      defaultProps={{edit: sampleEdit as Edit, title: ""}}
      durationInFrames={1}
      calculateMetadata={({props}) => ({durationInFrames: editDurationInFrames(props.edit)})}
      {...SHORTS}
    />
    <Composition id="StudioTest" component={StudioTest} durationInFrames={150} {...SHORTS} />
  </>
);
