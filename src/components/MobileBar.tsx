import { useEffect, useState } from "react";
import type { Os } from "../hooks/useRelease";

const LABEL: Record<Os, string> = { windows: "Get it for Windows", mac: "Get it for macOS", linux: "Get it for Linux" };

/** Sticky download bar on small screens, once the hero has scrolled away. */
export default function MobileBar({ os, href }: { os: Os | null; href: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(scrollY > 520 && innerWidth < 640);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);
  return (
    <div className={`fixed inset-x-3 bottom-3 z-40 transition-transform duration-300 sm:hidden ${show ? "translate-y-0" : "translate-y-[140%]"}`}>
      <a href={href} className="btn btn-primary w-full justify-center shadow-soft">
        ⬇ {os ? LABEL[os] : "Download PocketPet"}
      </a>
    </div>
  );
}
