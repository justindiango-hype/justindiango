# Justin Diango — Portfolio V2

**"Fast doesn't have to look cheap."** A calm, editorial one-pager in Midnight `#01047B`, Ocean `#0F7FC4` and Acid Yellow `#DEF434`.

**Loading screen:** a bolt zig-zags in, strikes the logo, the letters flicker like they're electrocuted, then the screen splits open (click or scroll to skip).

Four beats: **Hero** (portrait, headline, 3D bolt) → **Intro** (statement + scroll-driven tool marquee) → **Work** (pinned; projects swipe in from alternating sides with their recordings playing) → **Let's talk**.

Every lime word in a header crackles with electricity about once a second (`components/electric.tsx`).

## Run it

```bash
npm install      # first time only
npm run dev      # http://localhost:3000
```

## Edit content

Everything lives in `content/site.ts`: headline, intro line, the tool list, projects and contact details. Wrap a word in `*asterisks*` to make it acid yellow.

### Projects

Each project can have:

- `media`: the file name in `public/work/` (a `.webp` cover and an `.mp4` loop with the same name)
- `url`: link to the live site (makes the card clickable)
- `liveInDays`: shows a "Live in X days" tag

Without `media`, the card shows a "Preview coming soon" cover (Manara Properties and Titan Technologies for now).

### Adding a new screen recording

Put the original in `assets/recordings/`, then make the loop and cover (needs ffmpeg):

```bash
ffmpeg -i assets/recordings/NAME.mp4 -an -vf "crop=1280:576:0:44,setpts=0.5*PTS,fps=24,scale=960:432" -t 20 -c:v libx264 -crf 30 -pix_fmt yuv420p -movflags +faststart public/work/NAME.mp4
ffmpeg -ss 3 -i assets/recordings/NAME.mp4 -vf "crop=1280:576:0:44" -frames:v 1 public/work/NAME.webp
```

The crop removes the recorder's black bars and toolbar (for 1280×720 recordings).

## Brand files

- `public/brand/logo-dark.svg`, `logo-light.svg`: the bolt + JustinDiango wordmark
- `public/brand/icon.svg` / `app/icon.svg`: the bolt app icon (favicon)
- `public/brand/bolt-hero.webp`, `bolt-cta.webp`: the pre-rendered 3D bolts

## Notes

- No live 3D. The bolts are pre-rendered images, so the site stays light.
- Each recording plays while its project is on stage and pauses when it leaves.
- With "reduce motion" on, the loader just fades, the work becomes a simple list and nothing flickers.
- Tool logos come from Simple Icons. VS Code isn't in that set, so it shows as text.
