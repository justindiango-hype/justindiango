# Justin Diango — Portfolio V2

**"Fast doesn't have to look cheap."** A one-page portfolio in Midnight `#01047B`, Ocean `#0F7FC4` and Acid `#DEF434`.

Live: https://justindiango-hype.github.io/justindiango/

## Run it

```bash
npm install      # first time only
npm run dev      # http://localhost:3000
```

## Edit content

Everything lives in `content/site.ts`: the headline, intro line, tool list, projects, socials and contact details. Wrap a word in `*asterisks*` to make it lime with the glitch zap.

Each project's `media` is a file name in `public/work/` (a `.webp` cover plus an `.mp4` recording with the same name).

## Publish

Push to `main` and the GitHub Action (`.github/workflows/pages.yml`) builds the site and publishes it to GitHub Pages in about two minutes.

```bash
git add .
git commit -m "what you changed"
git push
```
