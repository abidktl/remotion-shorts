import { Composition } from "remotion";
import { DataShorts } from "./DataShorts";
import { SolarShorts } from "./SolarShorts";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DataShorts"
        component={DataShorts}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SolarShorts"
        component={SolarShorts}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

export const DataShortsRoot = RemotionRoot;
