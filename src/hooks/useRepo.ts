import { useEffect, useState } from "react";

export interface RepoStats {
  stars: number;
  forks: number;
  license: string | null;
  pushedAt: string;
}

const REPO_API = "https://api.github.com/repos/vigneshcj001/Pocketpet";

/** Stars, forks, licence and last push for the hero strip. */
export function useRepo() {
  const [stats, setStats] = useState<RepoStats | null>(null);

  useEffect(() => {
    let alive = true;
    const headers = { Accept: "application/vnd.github+json" };
    fetch(REPO_API, { headers })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => alive && setStats({ stars: j.stargazers_count ?? 0, forks: j.forks_count ?? 0, license: j.license?.spdx_id ?? null, pushedAt: j.pushed_at ?? "" }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return stats;
}
