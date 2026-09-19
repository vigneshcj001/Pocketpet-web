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
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-bg/80 px-5 py-2.5 backdrop-blur-md">
      <a href="#top" className="flex items-center gap-2.5 text-xl font-black no-underline" aria-label="PocketPet home">
        <img src="/icon.png" alt="" width={34} height={34} className="rounded-[9px]" />
        <span>PocketPet</span>
      </a>
      <nav className="ml-auto flex flex-wrap gap-1" aria-label="Sections">
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} className="rounded-full px-3 py-1.5 text-[14.5px] font-bold text-muted no-underline hover:bg-bg2 hover:text-ink max-sm:hidden">
            {label}
          </a>
        ))}
        <a href={REPO_URL} target="_blank" rel="noopener" className="rounded-full px-3 py-1.5 text-[14.5px] font-bold no-underline hover:bg-bg2">
          GitHub ↗
        </a>
      </nav>
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
        className="size-[38px] rounded-full border border-line bg-card text-base"
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </header>
  );
}
