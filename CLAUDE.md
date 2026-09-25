# CLAUDE.md — Major Gayrimenkul landing page

Premium single-page landing site for **MAJÖR GAYRİMENKUL** (real estate agency, İskenderun / Hatay).
Goal: turn visitors into WhatsApp chats, phone calls, and contact-form emails.

**Before any UI work, read `DESIGN.md` (look & feel) and `CLIENT.md` (facts, links, contacts).**
Never invent business facts: stats, addresses, testimonials, or prices. Stock photos are only used as clearly labelled *example projects*, never as real listings. If something is missing, use a clearly marked placeholder (`TODO(client): ...`) and list it in CLIENT.md → Open questions.

## Stack
- **Astro 5 + Tailwind CSS 4**, static output (`output: 'static'`), deployed on **Vercel**.
- **i18n:** Astro built-in routing. `defaultLocale: 'tr'`, locales `['tr', 'en']`. TR at `/`, EN at `/en/`.
  All UI strings go in `src/i18n/tr.json` and `src/i18n/en.json`. No hard-coded copy in components.
- **Icons:** `lucide` SVGs (inline). No emoji as icons.
- **Fonts:** self-hosted through `@fontsource` (see DESIGN.md). Don't load them at runtime from Google.
- No other dependencies unless there's a concrete reason. Write that reason in the PR/commit.

## Planned structure (created in the first build session)
```
src/
  pages/index.astro            # TR
  pages/en/index.astro         # EN
  layouts/Base.astro           # <html lang>, meta, OG, JSON-LD RealEstateAgent
  components/                  # one file per section: Nav, HeroVideo, Counters, Services, Projects,
                               # ProjectModal, ValuationCta, Areas, About, Testimonials, Contact,
                               # Footer, WhatsAppFab
  i18n/tr.json, en.json
  data/projects.json           # 6 example projects: title/desc per locale, stock images + credit
  data/areas.json              # neighbourhood guide entries
  assets/                      # optimized images (from /asset raw folder)
  styles/global.css            # tokens from DESIGN.md
public/                        # favicon, robots.txt, og-image
  video/                       # hero-1080.mp4/.webm, hero-720.mp4, hero-poster.jpg (copy from asset/hero video/web/)
asset/                         # RAW client material. Never import directly; copy/optimize into src/assets or public/
```

## Conventions
- **Images:** always `astro:assets` `<Image>`/`<Picture>` → AVIF/WebP. Always set width/height. Hero loads eagerly with `fetchpriority="high"`. Everything else is lazy.
- **Video:** `astro:assets` doesn't process video, so it's served from `public/video/`. Web encodes are already in `asset/hero video/web/`. Never ship the 53 MB 4K original. Markup and behavior are in DESIGN.md → Hero video.
- **Modal:** native `<dialog>` + CSS scroll-snap. No gallery/lightbox library.
- **Counters / reveal animations:** IntersectionObserver + CSS/rAF. No animation library.
- **Request form:** `RequestForm.astro` is a 4-step form (service → details → contact → review). It hands off to WhatsApp with a structured message. There is no email backend.
  Field rules and the message builder live in `src/request.ts` (tested in `src/request.test.ts`, `npm test`). Copy lives in the `request` i18n block.
  It includes a KVKK consent checkbox, inline errors next to each field, and a copy-message fallback in case WhatsApp doesn't open.
- **WhatsApp:** `https://wa.me/905308543900?text=` + `encodeURIComponent(prefilled message in current language)`.
  Floating button, always visible on mobile and above the safe area.
- **Phones:** `tel:+903266141555` (office), `tel:+905308543900` (mobile).
- **External links:** `target="_blank" rel="noopener"`.
- **SEO:** unique title/description per locale, `hreflang` alternates, canonical, OG image, `RealEstateAgent` JSON-LD with the NAP from CLIENT.md, sitemap (`@astrojs/sitemap`).
- Mobile-first. Test at 360px, 768px, 1280px, and 1920px.

## Commands
```
npm run dev       # localhost:4321
npm run build
npm run preview
```

## Definition of done
- `npm run build` passes with no warnings.
- Lighthouse ≥ 95 in Performance, Accessibility, Best Practices, and SEO (mobile).
- `npm test` passes, and every service path in the request form opens WhatsApp with the right message.
- The WhatsApp link opens with the prefilled text in TR and EN.
- No horizontal scroll at 360px. Keyboard navigation works. `prefers-reduced-motion` is respected.
# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
