import { REPO_URL } from "../hooks/useRelease";
import type { RepoStats } from "../hooks/useRepo";

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

/** Small live strip under the hero CTA: stars, forks, licence, last push. */
export default function Stats({ stats, version }: { stats: RepoStats | null; version: string | null }) {
  const items: [string, string][] = [
    ["⭐", stats ? (stats.stars > 0 ? `${fmt(stats.stars)} stars` : "Star it on GitHub") : "— stars"],
    ["🍴", stats ? `${fmt(stats.forks)} fork${stats.forks === 1 ? "" : "s"}` : "— forks"],
    ["🏷️", version ?? "latest"],
    ["📜", stats?.license ?? "Open source"],
  ];
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener"
      className="mt-7 inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-line bg-card/70 px-4 py-2 text-[13px] font-bold text-muted no-underline backdrop-blur transition hover:border-accent/50 hover:text-ink"
      title="Open the repository on GitHub"
    >
      {items.map(([icon, text]) => (
        <span key={text} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true">{icon}</span>
          {text}
        </span>
      ))}
      {stats?.pushedAt && <span className="text-[12px] font-semibold">updated {new Date(stats.pushedAt).toLocaleDateString()}</span>}
    </a>
  );
}
