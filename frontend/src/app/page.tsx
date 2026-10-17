import { ScratchServices } from "@/components/ScratchServices";
import { Approach, Speaks, Steps, StudioFaq, StudioHero, Tools } from "@/components/studio/Home";

export default function Home() {
  return (
    <>
      <StudioHero />
      <Tools />
      <Speaks />
      <ScratchServices />
      <Steps />
      <Approach />
      <StudioFaq />
    </>
  );
}
