# Open Source 101 with Angular (slide.ng)

The talk "Open Source 101 with Angular", ported from Slidev to [slide.ng](https://github.com/slide-ng/slide.ng).

```bash
npm install
npm run dev      # fetches stats, then http://localhost:4230 (presenter: /presenter)
npm run build    # fetches stats, then a static site in dist/
npm run export   # PDF (needs Chromium: CHROME_PATH, and --no-sandbox as root)
```

## What is where

| Slidev original | here |
| --- | --- |
| `slides.md` | `slides.md` (`v-click` is `slide-ng-click`, icons are `<carbon-name />`, `comark` removed) |
| `components/CountUp.vue`, `Stat.vue`, `AngieStorm.vue`, `Counter.vue` | `components/count-up.ts`, `stat-value.ts`, `angie-storm.ts`, `deck-counter.ts` |
| `$clicks` in the agenda slide | `components/click-state.ts`, read through `<click-state #cs />` |
| `global-top.vue` | `layers/global-top.ts` (footer, section name, progress bar, `mouse-live` hover switch) |
| `style.css` | `styles/index.css` (same rules, plus a short "port" section at the end) |
| `stats.json` | `components/stats.json` (components import it at build time) |
| `scripts/stats.mjs` | same script, now writes `components/stats.json`; runs before `dev`, `build` and `export` through `npm run` |
| `public/`, `pages/`, `snippets/` | unchanged |

`scripts/stats.mjs` asks the GitHub API for the merged PRs and commits in `angular/angular`
(set `GITHUB_TOKEN` to avoid the rate limit). When the API fails it keeps the last saved numbers,
or copies `scripts/stats.fallback.json`. Calling `slide-ng` directly skips the script.

It uses `@slide-ng/core` 1.0.0 from npm, so `npm install` is all it needs.

## Differences from the Slidev version

- `# Hi, I’m erKam` has the curly apostrophe typed in (slide.ng does not convert quotes).
- `{{ erKam | kæm }}` in the code sample is written with `&#123;` / `&#125;` entities (no `v-pre`).
- One `&ngsp;` in the "What gets merged" title keeps the space between two spans (Angular drops whitespace-only text between elements).
- The end of `styles/index.css` restores Slidev 53's code-block and inline-code defaults, sizes the
  icons (they are `<span>`s here, so `.rows span` matched them) and turns off `overflow: auto` on the `<pre>` of slide 2.
- `layers/global-top.ts` reads the slide number of the printed page in PDF export, so the footer is in the PDF too.
- The Angie wall on slide 9 is random, as in the original.
