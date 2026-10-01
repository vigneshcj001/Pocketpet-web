import { REPO_URL } from "../hooks/useRelease";
import type { RepoStats } from "../hooks/useRepo";

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

/**
 * Threshold below which raw counts are hidden to avoid negative social proof
 * on a fresh release. Once a metric crosses this number it shows the real value.
 */
const SHOW_THRESHOLD = 50;

/** Small live strip under the hero CTA: stars, forks, licence, last push. */
export default function Stats({ stats, version }: { stats: RepoStats | null; version: string | null }) {
  const stars = stats?.stars ?? 0;
  const forks = stats?.forks ?? 0;

  const items: [string, string][] = [
    ["⭐", stats ? (stars >= SHOW_THRESHOLD ? `${fmt(stars)} stars` : "Star it on GitHub") : "— stars"],
    // Only show fork count once it clears the threshold; below that, omit the metric entirely.
    ...(forks >= SHOW_THRESHOLD ? [["🍴", `${fmt(forks)} fork${forks === 1 ? "" : "s"}`] as [string, string]] : []),
    ["🏷️", version ?? "latest"],
    // Only name a licence GitHub actually detected in the repository.
    ...(stats?.license && stats.license !== "NOASSERTION" ? [["📜", stats.license] as [string, string]] : []),
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
