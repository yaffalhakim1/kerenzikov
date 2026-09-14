import { queryOptions } from '@tanstack/react-query'

/**
 * One place to rename the project. Overridable at build time so the site and
 * the app can live in different repos without a code edit:
 *
 *   VITE_SITE_OWNER    github user/org that owns THIS site repo
 *   VITE_SITE_REPO     this repo's name (drives the Pages URL)
 *   VITE_RELEASE_REPO  repo whose GitHub Releases the download buttons point at
 *
 * The site is published from `kerenzikov`; the app it advertises ships its
 * releases from `Kerenzikov-app`, so the two are set independently.
 */
export const OWNER = import.meta.env.VITE_SITE_OWNER ?? 'yaffalhakim1'
export const REPO = import.meta.env.VITE_SITE_REPO ?? 'kerenzikov'
export const RELEASE_REPO = import.meta.env.VITE_RELEASE_REPO ?? 'Kerenzikov-app'

export const SITE_URL = `https://${OWNER}.github.io/${REPO}`
export const GITHUB_URL = `https://github.com/${OWNER}/${RELEASE_REPO}`
export const RELEASES_URL = `${GITHUB_URL}/releases/latest`

export interface LatestRelease {
  version: string
  /** Direct download URLs; null until the GitHub API answers. */
  assets: {
    x64: string
    arm64: string
    portableX64: string
    apk: string
  } | null
}

// ponytail: client-side GitHub API, no server fn — GH Pages serves static files only.
interface GhAsset {
  name: string
  browser_download_url: string
}

interface GhRelease {
  tag_name?: string
  assets?: GhAsset[]
}

async function fetchLatestRelease(): Promise<LatestRelease | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${RELEASE_REPO}/releases/latest`,
      { signal: AbortSignal.timeout(5000) },
    )
    if (!res.ok) return null
    const json = (await res.json()) as GhRelease
    const version = (json.tag_name ?? '').replace(/^v/, '')
    if (!version) return null
    const byName = new Map(
      (json.assets ?? []).map((a) => [a.name, a.browser_download_url] as const),
    )
    const pick = (...names: string[]): string =>
      names.map((n) => byName.get(n)).find((u): u is string => !!u) ??
      RELEASES_URL
    return {
      version,
      // Product-facing artifact names. The desktop and Android builds emit
      // these since the Kerenzikov rename; the older `Waku-*` names are kept
      // as a fallback so releases published before the rename still resolve.
      // Keep in sync with the artifact paths in .github/workflows/release.yml.
      assets: {
        x64: pick(
          `Kerenzikov-${version}-x86_64-Setup.exe`,
          `Waku-${version}-x86_64-Setup.exe`,
        ),
        arm64: pick(
          `Kerenzikov-${version}-aarch64-Setup.exe`,
          `Waku-${version}-aarch64-Setup.exe`,
        ),
        portableX64: pick(
          `kerenzikov-${version}-x86_64-pc-windows-msvc.zip`,
          `waku-${version}-x86_64-pc-windows-msvc.zip`,
        ),
        apk: pick(
          `Kerenzikov-${version}-universal.apk`,
          `Waku-${version}-universal.apk`,
        ),
      },
    }
  } catch {
    return null
  }
}

export const releaseQuery = queryOptions({
  queryKey: ['latest-release'],
  queryFn: fetchLatestRelease,
  staleTime: 5 * 60_000,
  retry: 1,
  refetchOnWindowFocus: false,
})
