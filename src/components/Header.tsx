import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { REPO_URL } from "../hooks/useRelease";

const LINKS = [
  ["#download", "Download"],
  ["#features", "Features"],
  ["#compare", "Platforms"],
  ["#agent", "Errands"],
  ["#faq", "FAQ"],
];

export default function Header() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 px-5 backdrop-blur-xl sm:px-7">
      <div className="mx-auto flex h-[66px] max-w-[1180px] items-center gap-3">
      <a href="#top" className="flex items-center gap-2.5 text-xl font-black no-underline" aria-label="PocketPet home" onClick={() => setOpen(false)}>
        <img src="/icon.png" alt="" width={34} height={34} className="rounded-[9px]" />
        <span>PocketPet</span>
      </a>
      <nav id="site-navigation" className={`${open ? "flex" : "hidden"} absolute inset-x-4 top-[72px] ml-auto flex-col gap-1 rounded-2xl border border-line bg-card p-2 shadow-soft sm:static sm:flex sm:flex-row sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none`} aria-label="Sections">
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-xl px-3 text-[14.5px] font-bold text-muted no-underline hover:bg-bg2 hover:text-ink sm:min-h-0 sm:rounded-full sm:py-1.5">
            {label}
          </a>
        ))}
        <a href={REPO_URL} target="_blank" rel="noopener" className="flex min-h-11 items-center rounded-xl px-3 text-[14.5px] font-bold no-underline hover:bg-bg2 sm:min-h-0 sm:rounded-full sm:py-1.5">
          GitHub ↗
        </a>
      </nav>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="site-navigation" aria-label="Open navigation" className="ml-auto grid size-11 place-items-center rounded-full border border-line bg-card text-xl sm:hidden">
        {open ? "×" : "☰"}
      </button>
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
        className="grid size-11 place-items-center rounded-full border border-line bg-card text-base transition hover:-translate-y-0.5 hover:shadow-sm sm:size-[38px]"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button></div>
    </header>
  );
}
