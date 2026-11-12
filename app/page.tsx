import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Preloader } from "@/components/preloader";
import { RingsBackdrop } from "@/components/rings-backdrop";
import { SideStage } from "@/components/side-stage";
import { SmoothScroll } from "@/components/smooth-scroll";
import { TravelBolt } from "@/components/travel-bolt";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Nav />
      {/* Soft page gradient so the navy never looks flat */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(80% 60% at 12% -5%, rgba(15,127,196,0.32), transparent 65%), radial-gradient(70% 60% at 95% 105%, rgba(15,127,196,0.30), transparent 65%), linear-gradient(180deg, #01047B 0%, #01047B 50%, #000366 100%)",
        }}
      />
      <RingsBackdrop />
      <main className="relative z-[1]">
        <Hero />
        <SideStage />
        <Contact />
      </main>
      <TravelBolt />
    </>
  );
}
