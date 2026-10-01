import { useEffect, useState } from "react";

export type Os = "windows" | "mac" | "linux";

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

/** The file each platform's main download button points at. */
export const PRIMARY_SUFFIX: Record<Os, string> = { windows: "-setup.exe", mac: "_aarch64.dmg", linux: ".AppImage" };

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
