# Open Source 101 with Angular

How I started contributing to enterprise open source, and how you can do it too. A 35 minute talk in English and Turkish, built with [slide.ng](https://github.com/slide-ng/slide.ng).

- **Slides:** <https://oss-101-with-ng.netlify.app/>
- **Mirror:** <https://erkamyaman.github.io/open-source-101-with-angular-slide-ng/>
- **PDF:** [open-source-101-with-angular.pdf](open-source-101-with-angular.pdf)

Press `b` during the talk to open websites inside the deck.

## Run it

```bash
npm install
npm run dev      # http://localhost:4230, presenter at /presenter
npm run build    # static site in dist/
npm run export   # PDF, needs Chromium
```

`dev`, `build` and `export` first fetch the Angular PR and commit numbers shown on the slides. Set `GITHUB_TOKEN` to avoid the GitHub rate limit. If the request fails, the last saved numbers are used.

## Files

- `slides.md`, `slides.tr.md`: the talk in English and Turkish
- `components/`: counters, stats and the Angie wall
- `layers/global-top.*`: the footer with section and slide number
- `public/`: pictures and logos
- `netlify/edge-functions/deck-proxy/`: the proxy that lets the deck show sites that refuse to be framed

## Publishing

Every push to `main` deploys to both Netlify and GitHub Pages.
