import PetStage from "./PetStage";
import Stats from "./Stats";
import type { Os } from "../hooks/useRelease";
import type { RepoStats } from "../hooks/useRepo";

const OS_LABEL: Record<Os, string> = { windows: "Download for Windows", mac: "Choose your Mac build", linux: "Download for Linux" };
const OS_SUB: Record<Os, string> = { windows: ".exe installer · 64-bit", mac: ".dmg · Apple Silicon & Intel", linux: "AppImage or .deb" };

export default function Hero({ os, directUrl, stats, version }: { os: Os | null; directUrl: string | null; stats: RepoStats | null; version: string | null }) {
  return (
    <section className="grid min-h-[calc(100vh-66px)] grid-cols-1 items-center gap-10 py-12 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] md:py-16">
      <div className="relative z-10">
        <p className="eyebrow mb-4">Your desktop just got a little less lonely</p>
        <h1 className="max-w-[11ch] text-[clamp(44px,6vw,72px)] leading-[.98]">A tiny friend for your desktop.</h1>
        <p className="my-6 max-w-[44ch] text-[17px] leading-relaxed text-muted sm:text-lg">
          PocketPet follows your cursor, naps on your windows, begs for snacks, plays hide &amp; seek — and when you
          ask, it opens a browser and runs errands for you.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a href={directUrl ?? "#download"} className="btn btn-primary">
            <span className="text-[22px] leading-none">⬇</span>
            <span>
              {os ? OS_LABEL[os] : "Download"}
              <small className="block text-xs font-semibold leading-tight opacity-80">{os ? OS_SUB[os] : "Pick your platform below"}</small>
            </span>
          </a>
          <a href="#features" className="btn bg-transparent">See what it does</a>
        </div>
        <p className="mt-5 flex max-w-[48ch] items-start gap-2 text-[13.5px] text-muted">
          <span aria-hidden="true">↳</span><span>Play with the live demo: move your mouse, click, drag, feed, or dress up your pet.</span>
        </p>
        <Stats stats={stats} version={version} />
      </div>
      <PetStage />
    </section>
  );
}
