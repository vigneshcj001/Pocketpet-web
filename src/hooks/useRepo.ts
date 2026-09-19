import { useEffect, useState } from "react";

export interface RepoStats {
  stars: number;
  forks: number;
  license: string | null;
  pushedAt: string;
}

export interface ReleaseNote {
  tag: string;
  name: string;
  url: string;
  publishedAt: string;
  body: string;
}

const REPO_API = "https://api.github.com/repos/vigneshcj001/Pocketpet";

/** Stars/forks for the hero strip and the last few releases for the changelog. */
export function useRepo() {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [releases, setReleases] = useState<ReleaseNote[]>([]);

  useEffect(() => {
    let alive = true;
    const headers = { Accept: "application/vnd.github+json" };
    fetch(REPO_API, { headers })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => alive && setStats({ stars: j.stargazers_count ?? 0, forks: j.forks_count ?? 0, license: j.license?.spdx_id ?? null, pushedAt: j.pushed_at ?? "" }))
      .catch(() => {});
    fetch(`${REPO_API}/releases?per_page=4`, { headers })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((list: Array<Record<string, string>>) =>
        alive && setReleases(list.map((r) => ({ tag: r.tag_name, name: r.name || r.tag_name, url: r.html_url, publishedAt: r.published_at, body: r.body || "" }))),
      )
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return { stats, releases };
}
