import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Menu } from '@base-ui/react/menu'
import { Download, Moon, Smartphone, Sun } from 'lucide-react'
import { GITHUB_URL, RELEASES_URL, releaseQuery } from '@/lib/release'
import { useEffect, useState } from 'react'
import 'devices.css/dist/devices.min.css'
import '../v2.css'
export const Route = createFileRoute('/')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(releaseQuery)
  },
  component: V2,
})

const UPSTREAM_URL = 'https://github.com/egoist/waku'
const WINDOWS_DOCS_URL = `${GITHUB_URL}/blob/main/docs/windows.md`
const CHANGELOG_URL = `${GITHUB_URL}/blob/main/CHANGELOG.md`

const APP_NAME = 'Kerenzikov'
const THEME_KEY = 'kerenzikov-theme'

/** Dark is the default; the choice persists across visits. Same key and
    mechanism as the v1 page, so both pages agree on the active register. */
function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains('light') ? 'light' : 'dark',
    )
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    const root = document.documentElement
    root.classList.toggle('light', next === 'light')
    root.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // Private mode: the choice just does not persist.
    }
  }

  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      className="k2-icon-btn"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

const PROVIDERS = [
  { slug: 'opencode', label: 'OpenCode', flag: 'Best supported' },
  { slug: 'opencode2', label: 'OpenCode 2' },
  { slug: 'claude', label: 'Claude Code' },
  { slug: 'openai', label: 'Codex CLI' },
  { slug: 'amp', label: 'Amp' },
  { slug: 'cursor', label: 'Cursor CLI' },
  { slug: 'copilot', label: 'Copilot CLI' },
  { slug: 'grok', label: 'Grok Build' },
  { slug: 'kimi', label: 'Kimi Code' },
  { slug: 'jcode', label: 'Jcode' },
  { slug: 'fx', label: 'Vercel Fx' },
  { slug: 'deepseek', label: 'DeepSeek Harness' },
  { slug: 'pi', label: 'Pi' },
  { slug: 'ohmypi', label: 'Oh My Pi' },
]

const ANDROID_SHOTS = [
  {
    n: '01',
    src: 'android-new-task.jpg',
    alt: 'Android app New Task screen with quick-start chips, machine and project pickers, and the composer',
    title: 'Start a task',
    desc: 'Quick-start chips, machine and project pickers, and the composer.',
  },
  {
    n: '02',
    src: 'android-tasks.jpg',
    alt: 'Android app task list grouped by day with provider marks and status per task',
    title: 'Every task, by day',
    desc: 'Grouped under Today and Yesterday, provider mark and status on each row.',
  },
  {
    n: '03',
    src: 'android-chat.jpg',
    alt: 'Android app showing a live agent transcript in a chat view',
    title: 'Watch it work',
    desc: 'The transcript streams live while the agent runs on your desktop.',
  },
  {
    n: '04',
    src: 'android-daemon.jpg',
    alt: 'Android app Add Daemon screen with connection fields and Tailscale guidance',
    title: 'One-time setup',
    desc: 'Paste the address and token from Desktop → Settings → Daemon. Tailscale optional.',
  },
]

const FACTS: { key: string; value: string }[] = [
  { key: 'Form', value: 'One native binary. Rust and GPUI. No browser engine.' },
  { key: 'Platforms', value: 'Windows x86_64 · arm64 · Android (universal APK)' },
  { key: 'Session', value: 'One long-lived process per conversation' },
  { key: 'Storage', value: 'Local. SQLite, blob store, your user profile.' },
  { key: 'Updates', value: 'In place, from a signed feed. Off switch in Settings.' },
  { key: 'Licence', value: 'GPL-3.0-only. A fork of an open-source project.' },
]

function DownloadMenu({
  primaryUrl,
  assets,
  compact = false,
}: {
  primaryUrl: string
  assets: {
    x64: string
    arm64: string
    portableX64: string
    apk: string
  } | null
  compact?: boolean
}) {
  const itemClassName =
    'flex h-8 cursor-default items-center gap-2 rounded-[4px] px-2.5 text-sm outline-none data-highlighted:bg-[var(--color-paper-3)] data-highlighted:text-[var(--color-ink)] data-disabled:pointer-events-none data-disabled:opacity-45'

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Download"
        className="k2-btn"
      >
        {!compact && <Download data-icon="inline-start" />}
        <span className="hidden sm:inline">Download for Windows</span>
        <span className="sm:hidden">Download</span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          side="bottom"
          sideOffset={6}
          align="start"
          className="isolate z-50"
        >
          <Menu.Popup className="min-w-64 origin-(--transform-origin) rounded-[6px] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-1 text-[var(--color-ink)] shadow-md outline-none data-[side=bottom]:slide-in-from-top-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <Menu.LinkItem href={primaryUrl} closeOnClick className={itemClassName}>
              Windows (x86_64 installer)
            </Menu.LinkItem>
            <Menu.LinkItem
              href={assets?.arm64 ?? RELEASES_URL}
              closeOnClick
              className={itemClassName}
            >
              Windows (arm64 installer)
            </Menu.LinkItem>
            <Menu.LinkItem
              href={assets?.portableX64 ?? RELEASES_URL}
              closeOnClick
              className={itemClassName}
            >
              Portable (.zip)
            </Menu.LinkItem>
            <Menu.LinkItem
              href={assets?.apk ?? RELEASES_URL}
              closeOnClick
              className={itemClassName}
            >
              <Smartphone className="size-3.5 shrink-0 opacity-70" />
              Android (universal APK)
            </Menu.LinkItem>
            <Menu.LinkItem href={RELEASES_URL} closeOnClick className={itemClassName}>
              All releases
            </Menu.LinkItem>
            <Menu.LinkItem
              href={WINDOWS_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              closeOnClick
              className={itemClassName}
            >
              Requirements &amp; docs
            </Menu.LinkItem>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

function V2() {
  const { data: release } = useQuery(releaseQuery)
  const primaryUrl = release?.assets?.x64 ?? RELEASES_URL

  // The SSR pass never has release data (the prefetch is fire-and-forget),
  // but the client may hydrate with React Query's cache already filled.
  // Rendering version text only after mount keeps the first client paint
  // identical to the server HTML, which the SSR tree requires.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const version = mounted && release ? release.version : null

  return (
    <div className="k2 min-h-dvh">
      {/* N7 · Brutal slab */}
      <header className="k2-nav">
        <nav className="k2-nav-inner" aria-label="Primary">
          <a href={import.meta.env.BASE_URL} className="k2-wordmark">
            {APP_NAME}
          </a>
          <div className="k2-links">
            <ThemeToggle />
            <a href={`${import.meta.env.BASE_URL}#harnesses`} className="k2-link">
              Harnesses
            </a>
            <a href={`${import.meta.env.BASE_URL}#download`} className="k2-link">
              Download
            </a>
          </div>
        </nav>
      </header>

      <main className="k2-shell">
        {/* Inventory header: count · qualifier · action. No badge, no eyebrow. */}
        <section className="pt-[var(--space-xl)] pb-[var(--space-lg)]">
          <p className="k2-meta">
            14 harnesses · one window · Windows + Android
          </p>
          <h1 className="k2-display mt-[var(--space-sm)] text-[clamp(2.75rem,7vw,5.5rem)]">
            The harness
            <br />
            home.
          </h1>
          <p className="prose-measure mt-[var(--space-md)] max-w-[52ch] text-[length:var(--text-md)] leading-[1.55] text-[var(--color-ink-2)]">
            Every agent CLI you already run, driven from one native window over
            its own protocol. No new keys, no new subscriptions, no browser
            engine in the binary.
          </p>
          <div className="mt-[var(--space-lg)] flex flex-wrap items-center gap-[var(--space-sm)]">
            <DownloadMenu primaryUrl={primaryUrl} assets={release?.assets ?? null} />
            {version && <span className="k2-meta">v{version}</span>}
          </div>
        </section>

        {/* The catalogue body. Uniform cells, one provider each. */}
        <section id="harnesses" aria-labelledby="harnesses-heading" className="pb-[var(--space-lg)]">
          <div className="flex items-baseline justify-between gap-[var(--space-md)] pb-[var(--space-sm)]">
            <h2 id="harnesses-heading" className="k2-label">
              Index of harnesses
            </h2>
            <p className="k2-meta">14 / 14</p>
          </div>
          <ul className="k2-grid" role="list">
            {PROVIDERS.map((p, i) => (
              <li key={p.slug} className="k2-card">
                <div className="k2-card-top">
                  <span className="k2-num">{String(i + 1).padStart(2, '0')}</span>
                  {p.flag && <span className="k2-flag">{p.flag}</span>}
                </div>
                <div className="flex items-center gap-[var(--space-2xs)]">
                  <span
                    className="k2-mark"
                    style={{
                      maskImage: `url(${import.meta.env.BASE_URL}providers/${p.slug}.svg)`,
                      WebkitMaskImage: `url(${import.meta.env.BASE_URL}providers/${p.slug}.svg)`,
                    }}
                    aria-hidden="true"
                  />
                  <span className="k2-card-name">{p.label}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="prose-measure mt-[var(--space-md)] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-muted)]">
            Stream-json, JSON-RPC, the Agent Client Protocol, SSE, NDJSON —
            normalized into one model. Each agent keeps its own context when
            you switch mid-project.
          </p>
        </section>

        {/* The product, shown plainly. No re-drawn chrome. */}
        <figure className="k2-figure">
          <img
            src={`${import.meta.env.BASE_URL}app-screenshot-dark.png`}
            alt={`${APP_NAME} showing a coding-agent session: task list on the left, transcript and tool activity in the centre, file diffs on the right`}
            width={2266}
            height={1752}
            className="shot shot-dark block h-auto w-full"
          />
          <img
            src={`${import.meta.env.BASE_URL}app-screenshot-light.png`}
            alt={`${APP_NAME} showing a coding-agent session: task list on the left, transcript and tool activity in the centre, file diffs on the right`}
            width={2266}
            height={1752}
            className="shot shot-light block h-auto w-full"
          />
          <figcaption className="mono border-t border-[var(--color-ink)] px-[var(--space-md)] py-[var(--space-sm)] text-xs text-[var(--color-muted)]">
            Tasks left. Transcript centre. Diffs right.
          </figcaption>
        </figure>

        {/* Facts. Flat cells, no prose. */}
        <section aria-labelledby="facts-heading" className="pt-[var(--space-xl)] pb-[var(--space-lg)]">
          <h2 id="facts-heading" className="k2-label pb-[var(--space-sm)]">
            Facts
          </h2>
          <div className="k2-facts">
            {FACTS.map((f) => (
              <div key={f.key}>
                <p className="k2-num">{f.key}</p>
                <p className="mt-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-ink-2)]">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Android companion. F5 · Annotated screenshot — the numbered
            legend IS the description; each phone names its own step. The
            strip scrolls sideways on narrow screens and the legend restacks
            into a plain list, so the annotations never float loose. */}
        <section
          id="android"
          aria-labelledby="android-heading"
          className="border-t border-[var(--color-ink)] py-[var(--space-lg)]"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-[var(--space-md)]">
            <h2 id="android-heading" className="k2-display text-[length:var(--text-xl)]">
              The phone comes too.
            </h2>
            <p className="k2-meta">Android · universal APK</p>
          </div>
          <p className="prose-measure mt-[var(--space-sm)] text-[length:var(--text-base)] leading-[1.65] text-[var(--color-ink-2)]">
            A companion that connects to the daemon on your Windows machine
            over WebSocket. Your sessions live on the desktop; the phone is a
            window onto them. Over Tailscale it reaches your machine from any
            network, with no port forwarding.
          </p>

          <ol className="k2-android mt-[var(--space-lg)] m-0 list-none p-0">
            {ANDROID_SHOTS.map((s) => (
              <li key={s.n} className="k2-android-step">
                <div className="k2-android-device">
                  {/* Pixel 6 Pro frame from devices.css (MIT). The library is
                      fixed at 404×862, so the wrapper scales it to fit. */}
                  <div className="k2-phone-scale">
                    <div className="device device-google-pixel-6-pro">
                      <div className="device-frame">
                        <img
                          src={`${import.meta.env.BASE_URL}${s.src}`}
                          alt={s.alt}
                          width={1080}
                          height={2340}
                          loading="lazy"
                          className="device-screen k2-phone-shot"
                        />
                      </div>
                      <div className="device-stripe" />
                      <div className="device-header" />
                      <div className="device-sensors" />
                      <div className="device-btns" />
                      <div className="device-power" />
                    </div>
                  </div>
                </div>
                <div className="k2-android-note">
                  <p className="k2-num">{s.n}</p>
                  <h3 className="k2-note-title">{s.title}</h3>
                  <p className="mt-[var(--space-3xs)] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-ink-2)]">
                    {s.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Download. */}
        <section
          id="download"
          aria-labelledby="download-heading"
          className="border-t border-[var(--color-ink)] py-[var(--space-lg)]"
        >
          <h2 id="download-heading" className="k2-display text-[length:var(--text-xl)]">
            Get it.
          </h2>
          <p className="prose-measure mt-[var(--space-sm)] text-[length:var(--text-base)] leading-[1.65] text-[var(--color-ink-2)]">
            Install one agent CLI and authenticate it first; {APP_NAME} drives
            those, it does not replace them. The first install is the manual
            one — after that, updates arrive in place. The Android APK is in
            the same menu and pairs with the desktop daemon.
          </p>
          <div className="mt-[var(--space-lg)] flex flex-wrap items-center gap-x-[var(--space-sm)] gap-y-[var(--space-xs)]">
            <DownloadMenu primaryUrl={primaryUrl} assets={release?.assets ?? null} compact />
            <a
              className="k2-link"
              href={WINDOWS_DOCS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Requirements
            </a>
            <a className="k2-link" href={CHANGELOG_URL} target="_blank" rel="noreferrer">
              What&apos;s new
            </a>
            <a className="k2-link" href={GITHUB_URL} target="_blank" rel="noreferrer">
              Source
            </a>
          </div>
        </section>
      </main>

      {/* Ft2 · Inline single line */}
      <footer className="k2-footer">
        <div className="k2-footer-inner">
          {APP_NAME}
          {version ? ` v${version}` : ''} · Rust + GPUI · GPL-3.0-only
          · Fork of{' '}
          <a href={UPSTREAM_URL} target="_blank" rel="noreferrer">
            egoist/waku
          </a>{' '}
          · Built by{' '}
          <a
            href="https://yafialhakim.netlify.app"
            target="_blank"
            rel="noreferrer"
          >
            Yafi Alhakim
          </a>{' '}
          ·{' '}
          <a
            href={`${import.meta.env.BASE_URL}v1`}
            className="whitespace-nowrap"
          >
            Previous landing
          </a>
        </div>
      </footer>
    </div>
  )
}
