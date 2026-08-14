import { Composition } from "remotion";
import { DataShorts } from "./DataShorts";
import { SolarShorts } from "./SolarShorts";
import { PriceApiShort } from "./PriceApiPro";
import { BillYourAIShort } from "./BillYourAIPro";

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
      <Composition
        id="PriceApiShort"
        component={PriceApiShort}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BillYourAIShort"
        component={BillYourAIShort}
        durationInFrames={30 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

export const DataShortsRoot = RemotionRoot;
