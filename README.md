# Syed Mohsin Shah — Portfolio

Cyberpunk-themed personal portfolio. Built with [Gatsby](https://www.gatsbyjs.com/) + TypeScript, deployed as a static site to GitHub Pages at **https://mohsin-code.github.io**.

## Stack

- Gatsby 5 (React 18, TypeScript)
- Plain CSS (`src/styles/portfolio.css`) — neon grid, glitch text, scroll-reveal, cursor glow
- Google Fonts: Orbitron, Share Tech Mono, Rajdhani

## Develop

```bash
npm install
npm run develop   # http://localhost:8000
```

Content lives in `src/pages/index.tsx` — edit the `skills`, `experience`, `projects`, `education` arrays.

Other scripts: `npm run build` (production build to `public/`), `npm run serve` (serve the build), `npm run typecheck`, `npm run clean`.

## Add images

Placeholders are marked in `src/pages/index.tsx`:

- **Profile photo** — put a file in `static/` at repo root (e.g. `static/me.jpg`), then replace the `.avatar` div with `<img className="avatar" src="/me.jpg" alt="Syed Mohsin Shah" />`.
- **Project thumbnails** — replace each `.proj-thumb` div with an `<img>`.

## Deploy to GitHub Pages

Automated via GitHub Actions (`.github/workflows/deploy.yml`). One-time setup:

1. Push to `main`.
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

After that, every push to `main` builds Gatsby and publishes `public/` to Pages. Watch progress in the **Actions** tab; live URL is https://mohsin-code.github.io.

> This is a GitHub **user site** (`<user>.github.io`), served from the domain root — no `pathPrefix` needed. If you ever rename the repo to a project site, add `pathPrefix: "/repo-name"` in `gatsby-config.ts` and build with `gatsby build --prefix-paths`.
