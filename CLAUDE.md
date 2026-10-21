@AGENTS.md

# Davi Grabalos — Portfolio

Personal portfolio site (art direction + web dev) with a brutalist, editorial look. Next.js 16 App Router, React 19, plain JavaScript (no TypeScript), CSS Modules, GSAP for animation. No test suite.

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`, `eslint-config-next`)

Path alias: `@/*` maps to the repo root (`jsconfig.json`), e.g. `@/components/UI/Slider`.

## Content: Collection → Season → Project folders

There is no CMS or database. All work lives as folders in `public/work/`:

```
public/work/<collection>/<season>/<project>/<images>
             galpao/      2026/    cristo-reina/ 01.jpg, 02.jpg …
```

- **Collection** = body of work / client (e.g. Galpão). **Season** = year. **Project** = one piece of work with one or more images.
- Folder names are kebab-case ASCII slugs (they become URLs). Titles default to Title Case of the slug; seasons use the folder name as-is.
- Any level may have an optional `meta.json`. Supported keys: `title` (for accents, e.g. `"Galpão"`), `description`, `order` (lower first). Projects also take `role` and `cover` (an image filename; default is the first image). Extra keys are passed through.
- Sorting: collections and projects by `order`, then title. Seasons newest first. Images by filename with numeric order (`01.jpg`, `02.jpg`, …).
- Folders with no images are skipped.

`lib/projects.js` is the **only** place that reads this tree (`getCollections`, `getCollectionSeason`, `getCollectionSeasons`, `getAllProjects`). Pages call it at build time. Don't add `fs` reads elsewhere.

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.js` | Server component; passes `getAllProjects()` (flattened, `{ brand, collection, image, href }`) to the client `Slider`. |
| `/projects` | `app/projects/page.js` | Server component; grid with one card per collection + season. |
| `/projects/[collection]/[season]` | `app/projects/[collection]/[season]/page.js` | One page per collection-season, listing each project and its images. Static via `generateStaticParams`, `dynamicParams = false` (unknown paths 404). `params` is a Promise. |
| `/about` | `app/about/page.js` | Client component; static bio/services/contact, mouse parallax on `public/images/background.jpg`. |

Because pages are prerendered, new content shows up after the next build or deploy.

`app/template.js` is a pass-through client template.

## Layout and global UI

`app/layout.js` wraps every page in: edge-blur overlays (`.edgeBlurTop/.edgeBlurBottom`), `CustomCursor`, `TransitionProvider`, `Navbar`, then `#page-transition-container`. Google Fonts are loaded via `<link>` in `<head>` (not `next/font`).

- `components/UI/TransitionProvider.js` — page transitions. Exposes `useTransition().navigate(href)` and `TransitionLink`. On exit it flashes a full-screen red overlay then holds blue while `router.push` runs; on the new `pathname` it flashes red and clears. **Use `TransitionLink` instead of `next/link` for internal navigation**; it falls through to normal behaviour for `http`, `mailto:` and `target="_blank"`.
- `components/UI/Slider.js` — home page full-screen slider. Navigation by wheel, vertical touch swipe or arrow buttons, throttled to 600 ms. Transitions use an inline SVG `#rgb-glitch` filter whose `feOffset`s are animated by GSAP. Preloads the next image in a hidden `<Image>`. Renders `Footer` and uses `app/page.module.css` for styling.
- `components/UI/CustomCursor.js` — GSAP `quickTo` ring + dot cursor; grows over `a, button, [role='button'], .clickable`. The system cursor is hidden via `globals.css` for `(pointer: fine)` only.
- `components/Layout/Navbar.js` — desktop top bar (logo, live clock, links) plus a mobile bottom tab bar. Logo hides on `/about` and glitches when you arrive at `/`.
- `components/Layout/Footer.js` — current project name and a newsletter form that is UI-only (no backend; it shows a thanks message and resets).

## Styling conventions

- One CSS Module per component/route (`*.module.css` next to the file). Global tokens and resets live in `app/globals.css`.
- Design tokens on `:root`: `--background #e2e0dc`, `--foreground #1f1e1e`, `--accent-red #d10026`, `--accent-blue #0022FF`, `--transition-smooth`, and font vars `--font-serif` (Instrument Serif), `--font-sans` (Stack Sans Headline, default, weight 200), `--font-mono` (JetBrains Mono). Base `html` font-size is 14px.
- The glitch red/blue in `Slider.js` are hard-coded hex that match the accent tokens.
- Images use `next/image` with `fill`, `objectFit: 'contain'`, `quality={100}`.

## Notes

- Code comments are a mix of Portuguese and English; either is fine.
- Contact links (email, Instagram, GitHub) are hard-coded in `Navbar.js` and `about/page.js`.
