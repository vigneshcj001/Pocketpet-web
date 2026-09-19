import { REPO_URL } from "../hooks/useRelease";
import type { ReleaseNote } from "../hooks/useRepo";

/** Turn GitHub's markdown-ish release body into a few plain bullet lines. */
function bullets(body: string): string[] {
  return body
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*]\s+/, "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/`/g, "").trim())
    .filter((l) => l && !l.startsWith("#"))
    .slice(0, 5);
}

export default function Changelog({ releases }: { releases: ReleaseNote[] }) {
  if (!releases.length) return null;
  return (
    <section id="changelog" className="reveal scroll-mt-16 py-18">
      <div className="mb-9 text-center">
        <h2 className="text-[clamp(26px,3.4vw,38px)]">What's new</h2>
        <p className="mt-2 text-muted">
          Straight from <a href={`${REPO_URL}/releases`} target="_blank" rel="noopener">GitHub Releases ↗</a>
        </p>
      </div>
      <ol className="relative mx-auto max-w-[720px] border-l-2 border-line pl-6">
        {releases.map((r, i) => (
          <li key={r.tag} className="relative mb-7 last:mb-0">
            <span className={`absolute -left-[31px] top-1.5 size-3.5 rounded-full border-2 border-bg ${i === 0 ? "bg-accent" : "bg-line"}`} />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <a href={r.url} target="_blank" rel="noopener" className="text-lg font-black no-underline hover:underline">{r.name}</a>
              {i === 0 && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-extrabold text-accent">latest</span>}
              <span className="text-[13px] text-muted">{r.publishedAt ? new Date(r.publishedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : ""}</span>
            </div>
            <ul className="mt-2 list-disc pl-5 text-[14.5px] text-muted">
              {bullets(r.body).map((b, j) => (
                <li key={j} className="my-0.5">{b}</li>
              ))}
              {!r.body && <li>No notes for this release.</li>}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
