import type { ReactNode } from "react";
import { RELEASES_URL, fmtSize, type Os, type useRelease } from "../hooks/useRelease";
import { usePet } from "../pet/PetContext";

type ReleaseApi = ReturnType<typeof useRelease>;

interface Button {
  suffix: string;
  label: string;
  primary?: boolean;
}

interface Platform {
  os: Os;
  name: string;
  sub: string;
  note: string;
  icon: ReactNode;
  buttons: Button[];
  tips: ReactNode[];
}

const PLATFORMS: Platform[] = [
  {
    os: "windows",
    name: "Windows",
    sub: "Windows 10 21H2 or later · 64-bit",
    note: "The full experience: the pet walks on your windows and presses their buttons.",
    icon: <path fill="currentColor" d="M3 5.5 10.5 4.5v7H3zm8.5-1.2L21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zm8.5 0H21V21l-9.5-1.3z" />,
    buttons: [{ suffix: "-setup.exe", label: "Installer (.exe)", primary: true }],
    tips: [
      <>SmartScreen may ask once — choose <em>More info → Run anyway</em>.</>,
      <>Needs the WebView2 runtime (already on Windows 11).</>,
    ],
  },
  {
    os: "mac",
    name: "macOS",
    sub: "macOS 11 Big Sur or later",
    note: "Follows your cursor, chats, plays and runs errands. Window tricks are Windows-only.",
    icon: <path fill="currentColor" d="M16.4 12.7c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zM14 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z" />,
    buttons: [
      { suffix: "_aarch64.dmg", label: "Apple Silicon (.dmg)", primary: true },
      { suffix: "_x64.dmg", label: "Intel (.dmg)" },
    ],
    tips: [
      <>Unsigned build: right-click the app → <em>Open</em> the first time.</>,
      <>Allow it under <em>Privacy &amp; Security → Accessibility</em> for global hotkeys.</>,
    ],
  },
  {
    os: "linux",
    name: "Linux",
    sub: "X11 or XWayland · WebKitGTK 4.1 · x86-64",
    note: "AppImage runs anywhere; the .deb is for Ubuntu 22.04+ and Debian 12+.",
    icon: <path fill="currentColor" d="M12 2c-2.4 0-3.7 1.9-3.7 4.3 0 1.2.2 1.9-.3 3-.7 1.3-2.2 3.2-2.5 5.2-.2 1 .1 1.8.5 2.4-.6.3-1.2.7-1.3 1.3-.2 1 .9 1.4 1.8 1.7.6.2 1.4.9 2.2 1.1.8.2 1.3-.3 1.6-.7.5.1 1.2.2 1.7.2s1.2-.1 1.7-.2c.3.4.8.9 1.6.7.8-.2 1.6-.9 2.2-1.1.9-.3 2-.7 1.8-1.7-.1-.6-.7-1-1.3-1.3.4-.6.7-1.4.5-2.4-.3-2-1.8-3.9-2.5-5.2-.5-1.1-.3-1.8-.3-3C15.7 3.9 14.4 2 12 2zm-1.3 4.2c.5 0 .8.6.8 1.3s-.3 1.2-.8 1.2-.8-.5-.8-1.2.3-1.3.8-1.3zm2.6 0c.5 0 .8.6.8 1.3s-.3 1.2-.8 1.2-.8-.5-.8-1.2.3-1.3.8-1.3zM12 9c.9 0 1.9.5 1.9 1s-1 .9-1.9 1.3c-.9-.4-1.9-.8-1.9-1.3s1-1 1.9-1z" />,
    buttons: [
      { suffix: ".AppImage", label: "AppImage", primary: true },
      { suffix: ".deb", label: ".deb" },
    ],
    tips: [
      <><code>chmod +x PocketPet*.AppImage</code> then run it.</>,
      <>Click-through needs X11; on pure Wayland the pet blocks clicks.</>,
    ],
  },
];

/** Which asset suffix is the "main" download for an OS (used by the hero button). */
export const PRIMARY_SUFFIX: Record<Os, string> = { windows: "-setup.exe", mac: "_aarch64.dmg", linux: ".AppImage" };

export default function Download({ os, rel }: { os: Os | null; rel: ReleaseApi }) {
  const { release, state, asset } = rel;
  const { perform } = usePet();
  const note =
    state === "error"
      ? "Couldn't reach GitHub just now — the buttons open the releases page, where every build is listed."
      : release
        ? `Downloads come straight from GitHub Releases (${release.tag}${release.publishedAt ? `, ${new Date(release.publishedAt).toLocaleDateString()}` : ""}).`
        : "Downloads come straight from GitHub Releases. Builds are produced by the public CI workflow in the repository.";

  return (
    <section id="download" className="reveal scroll-mt-16 py-18">
      <div className="mb-9 text-center">
        <h2 className="text-[clamp(26px,3.4vw,38px)]">Download</h2>
        <p className="mt-2 text-muted">
          Version <span>{release?.tag ?? (state === "loading" ? "…" : "latest")}</span> ·{" "}
          <a href={release?.url ?? RELEASES_URL} target="_blank" rel="noopener">release notes ↗</a>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((p, i) => {
          const mine = p.os === os;
          return (
            <article
              key={p.os}
              style={{ transitionDelay: `${i * 80}ms` }}
              className={`card reveal-item ${mine ? "border-accent shadow-[0_0_0_4px_var(--accent-soft),var(--shadow)]" : ""}`}
            >
              {mine && (
                <div className="absolute -top-3 left-5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-extrabold text-accent-ink">
                  Recommended for you
                </div>
              )}
              <svg viewBox="0 0 24 24" className="size-[46px]" aria-hidden="true">{p.icon}</svg>
              <h3 className="text-[19px]">{p.name}</h3>
              <p className="text-[13px] font-bold text-muted">{p.sub}</p>
              <p className="min-h-[3.2em] text-[14.5px] text-muted">{p.note}</p>
              <div className="mt-1.5 flex flex-col gap-2">
                {p.buttons.map((b) => {
                  const a = asset(b.suffix);
                  return (
                    <a
                      key={b.suffix}
                      href={a?.url ?? (release?.url ?? RELEASES_URL)}
                      title={a ? undefined : "Not in this release yet — opens the releases page"}
                      onClick={() => a && perform("celebrate")}
                      className={`btn justify-center ${b.primary ? "btn-primary" : ""} ${!a && state !== "loading" ? "opacity-60" : ""}`}
                    >
                      ⬇ {b.label}
                      {a && <span className="text-xs font-semibold opacity-75">{fmtSize(a.size)}</span>}
                    </a>
                  );
                })}
              </div>
              <ul className="mt-2 list-disc pl-[18px] text-[13px] text-muted">
                {p.tips.map((t, i) => (
                  <li key={i} className="my-1">{t}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-center text-[13.5px] text-muted">{note}</p>
    </section>
  );
}
