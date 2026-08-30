# Working standards for this project

This is a **world-class portfolio site** — treat every change as production
craft, not a quick patch.

## Quality bar
- Do the best possible work **the first time**, every time. Don't ship a
  rough first pass and iterate through the user's feedback — get it right up
  front.
- When anything is ambiguous or you're unsure what the user means, **ask
  before implementing**, don't guess. A quick clarifying question is always
  better than building the wrong thing and making the user correct it.
- Read the user's instruction carefully and fully before acting. If they
  describe a visual change, make sure you understand exactly which element,
  which edge, which direction they mean.

## Verifying visual work
- Anything visual **must be verified with a real screenshot** before saying
  it's done — never assume SVG/CSS geometry looks right from the code alone.
- The dev server is started via the Browser-pane preview (`catverse-dev` in
  `.claude/launch.json`), never a raw `npm run dev` in a shell.
- **Never run `rm -rf .next` or `npm run build` while the dev server is
  running** — it deletes the compiled files out from under the dev server
  and breaks `localhost:3000`. Stop the dev preview first, or build in a
  separate clean step and restart the dev server afterward.

## Tech
- Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 ·
  framer-motion · next-themes (class strategy, `dark` default).
- Two global stylesheets (`app/globals.css`, `app/mobile-fixes.css`) — large;
  prefer scoped, additive changes.
- Contact form: Resend API (`app/api/contact/route.ts`), secrets in
  `.env.local` (gitignored) — never commit real keys.
