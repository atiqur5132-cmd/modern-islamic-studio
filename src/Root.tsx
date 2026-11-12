import {Composition} from "remotion";
import sampleEdit from "../projects/quran-facts/edit.json";
import {Short} from "./compositions/Short";
import {StudioTest} from "./compositions/StudioTest";
import {Thumbnail} from "./compositions/Thumbnail";
import {YawmThumbnail} from "./compositions/YawmThumbnail";
import {FlatThumbnail} from "./compositions/FlatThumbnail";
import {QiblaThumbnail} from "./compositions/QiblaThumbnail";
import {MuminunThumbnail} from "./compositions/MuminunThumbnail";
import {FilTerrainTest} from "./scenes/fil/TerrainScene";
import yawmStats from "../projects/yawm-365/quran_stats.json";
import {Edit, editDurationInFrames, FPS} from "./timeline/types";
import {Long} from "./compositions/Long";
import scrollLong from "../projects/scroll-kyun/long.json";
import {LongProps} from "./long/scroll/types";

const SHORTS = {fps: FPS, width: 1080, height: 1920};

export const Root = () => (
  <>
    <Composition id="FilTerrainTest" component={FilTerrainTest} durationInFrames={150} {...SHORTS} />
    <Composition
      id="Short"
      component={Short}
      // Remotion fills props a reel leaves out from these defaults, so the sample's own
      // caption look must not leak into new reels: left out, they get "editorial".
      defaultProps={{...(sampleEdit as Edit), captionStyle: undefined}}
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
    <Composition
      id="YawmThumbnail"
      component={YawmThumbnail}
      defaultProps={{
        photo: "thumb-yawm-365.png",
        photoScale: 0.6,
        photoX: -68,
        photoY: 136,
        dots: yawmStats.yawm.map((entry) => String(entry[2])),
      }}
      durationInFrames={1}
      {...SHORTS}
    />
    <Composition
      id="FlatThumbnail"
      component={FlatThumbnail}
      defaultProps={{photo: "fe-thumb.png", face: [493, 720] as [number, number], at: [518, 1200] as [number, number], scale: 1.05, panelTop: 720}}
      durationInFrames={1}
      {...SHORTS}
    />
    <Composition
      id="QiblaThumbnail"
      component={QiblaThumbnail}
      defaultProps={{photo: "qb-thumb.png", face: [534, 628] as [number, number], at: [540, 1090] as [number, number], scale: 1.0, panelTop: 548}}
      durationInFrames={1}
      {...SHORTS}
    />
    <Composition
      id="MuminunThumbnail"
      component={MuminunThumbnail}
      defaultProps={{photo: "mk-thumb.png", face: [509, 718] as [number, number], at: [509, 1078] as [number, number], scale: 1.0, panelTop: 600}}
      durationInFrames={1}
      {...SHORTS}
    />
    <Composition
      id="Long"
      component={Long}
      defaultProps={scrollLong as LongProps}
      durationInFrames={1}
      calculateMetadata={({props}) => ({durationInFrames: Math.round(props.durationSeconds * FPS)})}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition id="StudioTest" component={StudioTest} durationInFrames={150} {...SHORTS} />
  </>
);
