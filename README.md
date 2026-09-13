# kerenzikov

The landing page for Kerenzikov, a native Windows app for local coding agents.

Standalone TanStack Start site, prerendered to static files and deployed to
GitHub Pages. It fetches the latest release from the GitHub API in the browser,
so there is no server runtime and no build-time token.

## Development

```sh
bun install
bun run dev        # http://localhost:3000/kerenzikov/
```

## Build

```sh
bun run build      # → dist/
bun run preview
```

## Configuration

The site and the desktop app it advertises live in separate repos, so their
names are set independently. All three are read at build time and have working
defaults — set them only when the names change.

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_PATH` | `/kerenzikov/` | URL prefix Pages serves the site from. Use `/` for a custom domain at the root. |
| `VITE_SITE_OWNER` | `yaffalhakim1` | Owner of this repo. |
| `VITE_SITE_REPO` | `kerenzikov` | This repo's name; drives the canonical URL and OG tags. |
| `VITE_RELEASE_REPO` | `waku` | Repo whose GitHub Releases the download buttons point at. |

To point the site at a renamed app repo, set a `RELEASE_REPO` repository
variable (Settings → Secrets and variables → Actions → Variables) — the deploy
workflow passes it through.

Download filenames are matched by name in `src/lib/release.ts` and must stay in
sync with the artifact paths in the app repo's
`.github/workflows/release.yml`.

## Structure

```
src/
  routes/__root.tsx      document shell, meta, theme bootstrap
  routes/index.tsx       the landing page
  lib/release.ts         repo identity + GitHub release lookup
  tokens.css             design tokens (colour, type, space, motion)
  styles.css             Tailwind entry + component classes
public/
  providers/*.svg        monochrome agent marks, masked to currentColor
  app-screenshot-*.png   light and dark product captures
```

The design system lives in `src/tokens.css`; every colour and font on the page
resolves through a named token there. Dark is the default theme, with a light
toggle persisted in `localStorage` under `kerenzikov-theme`.

## License

GPL-3.0-only, matching the application it documents.
