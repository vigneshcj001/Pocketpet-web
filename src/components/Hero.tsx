import PetStage from "./PetStage";
import Stats from "./Stats";
import type { Os } from "../hooks/useRelease";
import type { RepoStats } from "../hooks/useRepo";

const OS_LABEL: Record<Os, string> = { windows: "Download for Windows", mac: "Download for macOS", linux: "Download for Linux" };
const OS_SUB: Record<Os, string> = { windows: ".exe installer · 64-bit", mac: ".dmg · Apple Silicon & Intel", linux: "AppImage or .deb" };

export default function Hero({ os, directUrl, stats, version }: { os: Os | null; directUrl: string | null; stats: RepoStats | null; version: string | null }) {
  return (
    <section className="grid grid-cols-1 items-center gap-10 pt-14 pb-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div>
        <p className="eyebrow mb-3.5">Free · Open source · Windows · macOS · Linux</p>
        <h1 className="text-[clamp(34px,5vw,58px)]">A tiny friend that lives on your desktop.</h1>
        <p className="my-5 max-w-[46ch] text-lg text-muted">
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
        <p className="mt-5 text-[13.5px] text-muted">
          Move your mouse over the stage → the pet follows. Click it. Double-click it. Drag and let go. Try 🎨 to dress it up. Leave it alone and it dozes off.
        </p>
        <Stats stats={stats} version={version} />
      </div>
      <PetStage />
    </section>
  );
}
