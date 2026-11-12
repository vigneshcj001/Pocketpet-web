import { useEffect, useState } from "react";

export type Os = "windows" | "mac" | "linux";
export type MacArch = "arm" | "intel";

export interface Asset {
  name: string;
  url: string;
  size: number;
  tag: string;
  releaseUrl: string;
}

export interface Release {
  tag: string;
  name: string;
  url: string;
  publishedAt: string;
  body: string;
  assets: Asset[];
}

interface GitHubRelease {
  draft: boolean;
  prerelease: boolean;
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  body: string | null;
  assets: Array<{ name: string; browser_download_url: string; size: number }>;
}

export const REPO_URL = "https://github.com/vigneshcj001/Pocketpet";
export const RELEASES_URL = `${REPO_URL}/releases/latest`;
const API = "https://api.github.com/repos/vigneshcj001/Pocketpet/releases?per_page=20";

/** Suggest desktop builds only; phones, tablets and ChromeOS need platform choices. */
export function detectOs(): Os | null {
  const ua = navigator.userAgent;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string; mobile?: boolean } };
  const plat = nav.userAgentData?.platform || navigator.platform || "";
  if (nav.userAgentData?.mobile || /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|Opera Mini|CrOS/i.test(ua)) return null;
  // iPadOS can report the same platform and user agent as a desktop Mac.
  if (/Mac/i.test(plat) && navigator.maxTouchPoints > 1) return null;
  if (/Windows/i.test(ua) || /Win/i.test(plat)) return "windows";
  if (/Mac/i.test(plat) || /Macintosh/i.test(ua)) return "mac";
  if (/Linux|X11/i.test(ua) || /Linux/i.test(plat)) return "linux";
  return null;
}

/**
 * Apple Silicon or Intel, when the browser can tell. Chromium browsers answer
 * through User-Agent Client Hints; Firefox and Chrome expose the GPU name
 * (an "Apple M…" GPU means Apple Silicon). Safari reports "Apple GPU" on every
 * Mac, so it stays unknown there and the visitor picks the build.
 */
export async function detectMacArch(): Promise<MacArch | null> {
  const nav = navigator as Navigator & {
    userAgentData?: { getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }> };
  };
  try {
    const hints = await nav.userAgentData?.getHighEntropyValues?.(["architecture"]);
    if (hints?.architecture) return hints.architecture.toLowerCase() === "arm" ? "arm" : "intel";
  } catch {
    // Client hints refused; fall through to the GPU check.
  }
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    const renderer = gl && info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    if (/Apple M\d/i.test(renderer)) return "arm";
    if (/Intel|AMD|Radeon|NVIDIA/i.test(renderer)) return "intel";
  } catch {
    // No WebGL; leave the choice to the visitor.
  }
  return null;
}

/** Resolves the Mac architecture after mount; null elsewhere or when unknown. */
export function useMacArch(os: Os | null): MacArch | null {
  const [arch, setArch] = useState<MacArch | null>(null);
  useEffect(() => {
    if (os !== "mac") return;
    let cancelled = false;
    detectMacArch().then((value) => {
      if (!cancelled) setArch(value);
    });
    return () => {
      cancelled = true;
    };
  }, [os]);
  return arch;
}

export const MAC_SUFFIX: Record<MacArch, string> = { arm: "_aarch64.dmg", intel: "_x64.dmg" };

/** The file each platform's main download button points at. */
export const PRIMARY_SUFFIX: Record<Os, string> = { windows: "-setup.exe", mac: "_aarch64.dmg", linux: ".AppImage" };

/** The single file to offer this visitor, or null when they must choose. */
export function primarySuffix(os: Os | null, macArch: MacArch | null): string | null {
  if (!os) return null;
  if (os === "mac") return macArch ? MAC_SUFFIX[macArch] : null;
  return PRIMARY_SUFFIX[os];
}

export const fmtSize = (bytes: number) =>
  bytes > 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.round(bytes / 1e3)} KB`;

/**
 * Published (non-draft, non-prerelease) releases, newest first, plus the
 * newest available build for each platform. The changelog reads the same
 * list, so it never calls a pre-release "latest" while Download skips it.
 * Platforms can lag behind one another when a release contains fewer assets.
 */
export function useRelease() {
  const [release, setRelease] = useState<Release | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    (async () => {
      try {
        const r = await fetch(API, { headers: { Accept: "application/vnd.github+json" }, signal: controller.signal });
        if (!r.ok) throw new Error(String(r.status));
        const list: unknown = await r.json();
        if (cancelled) return;
        if (!Array.isArray(list)) throw new Error("Invalid release list");
        const releases: Release[] = (list as GitHubRelease[])
          .filter((item) => !item.draft && !item.prerelease)
          .map((item) => {
            const tag = item.tag_name || item.name || "latest";
            const url = item.html_url || RELEASES_URL;
            return {
              tag,
              name: item.name || tag,
              url,
              publishedAt: item.published_at || "",
              body: item.body || "",
              assets: (item.assets || []).map((a) => ({
                name: a.name,
                url: a.browser_download_url,
                size: a.size,
                tag,
                releaseUrl: url,
              })),
            };
          });
        if (!releases.length) throw new Error("No published releases");
        setRelease(releases[0]);
        setReleases(releases);
        setAssets(releases.flatMap((item) => item.assets));
        setState("ok");
      } catch {
        if (!cancelled) setState("error");
      } finally {
        clearTimeout(timeout);
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  /** Newest published asset whose file name ends with `suffix`. */
  const asset = (suffix: string) => assets.find((a) => a.name.endsWith(suffix)) ?? null;

  return { release, releases, state, asset };
}
