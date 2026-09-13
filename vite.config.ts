import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ponytail: static prerender for GitHub Pages. No Cloudflare/worker runtime,
// no server fns — the page fetches the GitHub releases API client-side.
//
// `base` must match how Pages serves the site. A project site lives at
// `<owner>.github.io/<repo>/`, so the default is this repo's name; a custom
// domain served from the root sets BASE_PATH=/.
const base = process.env.BASE_PATH ?? '/kerenzikov/'

export default defineConfig({
  base,
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  environments: {
    client: {
      build: {
        outDir: 'dist',
      },
    },
    server: {
      build: {
        outDir: 'dist/server',
      },
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    viteReact(),
  ],
})
