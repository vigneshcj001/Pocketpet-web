import { useEffect, useState } from "react";
import type { Os } from "../hooks/useRelease";

const LABEL: Record<Os, string> = { windows: "Download for Windows", mac: "Choose a macOS download", linux: "Download for Linux" };

/** Sticky download bar on small screens, once the hero has scrolled away. */
export default function MobileBar({ os, href }: { os: Os | null; href: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const smallScreen = matchMedia("(max-width: 639px)");
    const hero = document.querySelector("main > section:first-child");
    const download = document.getElementById("download");
    const footer = document.querySelector("footer");
    if (!hero || !download) return;
    let heroVisible = true;
    let downloadVisible = false;
    let footerVisible = false;
    const update = () => setShow(smallScreen.matches && !heroVisible && !downloadVisible && !footerVisible);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === download) downloadVisible = entry.isIntersecting;
        if (entry.target === footer) footerVisible = entry.isIntersecting;
      }
      update();
    });
    observer.observe(hero);
    observer.observe(download);
    if (footer) observer.observe(footer);
    smallScreen.addEventListener("change", update);
    return () => { observer.disconnect(); smallScreen.removeEventListener("change", update); };
  }, []);
  if (!show) return null;

  const choosePlatform = !os || os === "mac" || href.startsWith("#");
  return (
    <div className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 sm:hidden">
      <a href={choosePlatform ? "#download" : href} className="btn btn-primary min-h-12 w-full justify-center shadow-soft">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {os ? LABEL[os] : "Choose your desktop version"}
      </a>
    </div>
  );
}
