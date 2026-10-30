# DESIGN.md: Özdemir Emlak & Yatırım ve Gayrimenkul

## Direction: "navy & roof luxury"
The client's logo (red geometric roof + navy "Özdemir" script) in a calm black-and-white setting.
Mostly white/off-white and near-black, a serif display face, and large calm imagery. **Brand navy is the main accent**: primary CTAs, links, icons, and one navy band section. **Logo red is a secondary accent used very sparingly**: the roof mark, thin rules, and the nav reading-progress line. It is never used for buttons, text blocks, or large fills.
It should feel trustworthy and established (İznik / Bursa) while still premium, closer to a boutique developer than a property portal.

**Avoid:** gold/brass, gradients other than photo overlays, glassmorphism, handshake stock photos, auto-rotating carousels, emoji, and any second accent color.

Brand source: `asset/logo/new logo.jpg` (3D mock-up photo). The site uses SVGs redrawn from it in `src/assets/brand/`: `logo.svg` (stacked, OG image), `logo-h.svg` / `logo-h-white.svg` (horizontal, nav + footer), and `public/favicon.svg` (roof mark). The wordmark is Damion and the subtitle is Montserrat, both outlined to paths so no font loads.

## Color tokens
Define these on `:root` in `src/styles/global.css` and expose them to Tailwind via `@theme`.
Sampled from the logo photo (navy ≈ #2A374E, red ≈ #9E343A under the photo's lighting) and deepened for contrast. **Re-check them against the vector logo when the client sends it.**

| Token | Hex | Use |
|---|---|---|
| `--brand` | `#22304A` | Logo navy. Primary buttons, valuation band, focus ring |
| `--brand-mark` | `#34466B` | Lighter navy. Links, icons, hover states |
| `--brand-red` | `#A62F36` | Logo red. Roof mark, thin rules, reading-progress line only |
| `--ink` | `#111318` | Headings, body text, footer background |
| `--graphite` | `#58595B` | Wordmark gray. Secondary text (≈6.5:1 on paper) |
| `--paper` | `#F7F7F5` | Alternate section background |
| `--white` | `#FFFFFF` | Page background, text on brand/ink/video |
| `--line` | `#E4E4E7` | Borders, dividers |

### Dark theme (added 2026-09-24)
A nav toggle switches `data-theme` on `<html>` (saved in localStorage, defaulting to the OS preference). Components use the role tokens `surface`, `fg`, `accent` (icons, eyebrows, links), and `accent-strong` (big brand-coloured text). In dark mode: surface `#0D0F14`, paper `#15181F`, fg `#ECEDEF`, graphite `#A3A6AD`, line `#2A2E38`, accent `#A9B9DE`, accent-strong `#C9D4EE`. `--brand` is unchanged, so buttons and the valuation band keep white-on-navy. Keep `text-white`/`bg-ink` only where they sit on photos, the video, brand blue, or the footer.

### Halo instead of shadows (2026-09-24)
- `halo` utility: a 4px ring in `--halo` (brand tint on light, lifted blue in dark, faint white inside `.on-dark`). Use it on icon tiles, social buttons, avatars, and gallery arrows. Hover grows it to 6–7px.
- `on-photo` utility: white text and icons over photos or the video get a soft dark text-shadow/drop-shadow halo. The transparent nav gets the same treatment.
- `field` utility for form controls: `--color-field` border (≥ 3:1 against the field and the section), and on focus a 2px accent edge plus a halo.
- Drop shadows are kept small: the counters panel and the WhatsApp FAB use a halo ring plus a short, faint shadow.

- Primary CTA: `--brand` background, white text (≈15:1). Hover: `--brand-mark`.
- Secondary CTA: 1px `--ink` outline, ink text. On the video, use a 1px white outline with white text.
- WhatsApp green `#25D366` is allowed **only** on WhatsApp buttons (FAB, modal, cards).
- sahibinden yellow `#FFE800` is allowed **only** inside its portal logo (`PortalLogo.astro`), so visitors recognise the store at a glance.
- Hero/photo overlay: `linear-gradient(to top, rgb(17 19 24 / .75), rgb(17 19 24 / .25))` so white text stays ≥ 4.5:1 on every frame.

## Typography
- **Display:** `Cormorant Garamond` 500/600, for a calm, premium contrast with the script wordmark. Use it for h1–h3 only.
- **Body/UI:** `Montserrat` 400/500/600. Its geometric shapes match the logo wordmark.
- **Eyebrows:** Montserrat 500, `0.75rem`, uppercase, letter-spacing `0.3em`, `--brand-mark`. This echoes "G A Y R İ M E N K U L".
- Both fonts cover Turkish (İ ı Ş ş Ğ ğ Ç ç Ö ö Ü ü). Uppercase needs `lang="tr"` so "i" becomes "İ".
- Scale: h1 `clamp(2.75rem, 6vw, 5.5rem)`, h2 `clamp(2rem, 4vw, 3.5rem)`, h3 `1.5rem`, body `1rem` / 1.7, small `0.875rem`.

## Spacing & layout
- Spacing scale: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px. Sections get 112px padding on desktop and 64px on mobile.
- Container max 1280px with a 24px gutter (16px under 400px).
- Radius 0–2px (sharp corners read as premium and match the angular M). Cards have no heavy shadow: a 1px `--line` border, and the image scales to 1.03 on hover.
- The roof-line motif from the logo can be used as a subtle section divider or background line pattern (SVG, `--line` color). Use it once or twice at most.

## Page sections (in order)
1. **Nav:** logo on the left (white version over the video, color version once scrolled). Anchor links: Hizmetler, Projeler, Bölgeler, Hakkımızda, İletişim. On the right: TR/EN switch and a WhatsApp button. The nav is transparent over the hero and turns solid white with a bottom border on scroll. Mobile gets a full-screen menu.
2. **Hero (scroll-scrubbed):** pinned full-viewport stage + overlay; the walk-through advances with scroll (see Components → Hero scrub). h1 "Hayalinizdeki evi sizin için buluyoruz." (from the client's IG). Subhead: "İznik ve Bursa'da güvenilir gayrimenkul danışmanlığı." CTAs: "WhatsApp'tan Yazın" (primary) and "Projeleri İnceleyin" (secondary). A small scroll cue sits at the bottom.
3. **Counters:** 3–4 numbers in a thin band. They count up the first time they come into view. Only verified figures. **Hidden for now** (removed from `Page.astro`) because the new client has supplied none yet: `TODO(client)`.
4. **Services:** Satılık, Kiralık, Değerleme, Yatırım Danışmanlığı, each with a Lucide icon, a title, and 2 lines of text.
5. **Proje Örnekleri:** 6 static cards (stock photo, project type, and a short descriptor such as "Deniz manzaralı 3+1 rezidans"). **No prices, addresses, or listing claims**: these are example projects, and the section intro says so. Clicking a card opens the gallery modal. The section ends with a "Tüm güncel ilanlar" CTA linking to the sahibinden.com store.
6. **Valuation CTA band:** full-width `--brand` background, h2 "Evinizin değerini ücretsiz öğrenin", and a button that scrolls to the contact form on Consultation with the topic set to Valuation (`data-request-preset="consult:valuation"`).
7. **Neighbourhood guide:** 4–6 İznik/Bursa area cards (image, name, 2 lines, and a "Bu bölgede ilan sor" WhatsApp link). The area list is `TODO(client)`.
8. **About / founder:** founder portrait, short story, and the office photo. All three are placeholders until the client supplies them (`TODO(client)`).
9. **Testimonials:** hidden (removed from `Page.astro`) until the new client supplies real Google reviews. Layout when restored: the strongest quote large on its own, the rest in a row that scrolls in via a scroll-snap row on mobile. Each card has 5 stars, the quote in Cormorant italic, and the name with a small "Google" source label. For the avatar, show initials in a `--brand` circle. Don't use fake photos. Above the cards, add a "Google'da 5.0 ★ · N yorum" badge linking to the Google reviews (N = `TODO(client)`).
10. **Contact:** form on the left. On the right: phone/WhatsApp, email, address, hours, and the map (click-to-load facade).
11. **Footer:** `--ink` background, white logo, name/address/phone, social icons, KVKK link, ©.
    Social icons (Instagram, Facebook; `Socials.astro`) also appear as a vertical rail on the hero (a row under the CTAs on mobile) and in the contact details.
12. **WhatsApp FAB:** bottom-right, 56px, respects the safe area, always visible on mobile.

## Components
### Gallery modal
- Native `<dialog>` opened with `showModal()`. Closes on Esc, on backdrop click, and with a close button (44px, `aria-label="Kapat"`).
- The gallery is a CSS scroll-snap strip with prev/next buttons and a counter ("2 / 5"). Swipe works on mobile. Images are lazy-loaded.
- Footer: project title, and a WhatsApp button prefilled with
  TR: `Merhaba, "<title>" projesine benzer seçenekler hakkında bilgi almak istiyorum.`
  EN: `Hello, I'd like information about options similar to "<title>".`
- On close, focus returns to the card that opened it. Page scroll is locked while the modal is open.

### Counters
- IntersectionObserver fires once and runs `requestAnimationFrame` easeOutCubic over 1.6s. Numbers are formatted per locale (`7.500` in TR, `7,500` in EN).
- Under `prefers-reduced-motion`, the final value renders immediately. The real value is in the HTML (not 0), so it works with no JS and is SEO-safe.

### Hero scrub (Apple-style)
- Source: `asset/hero video/hero section v2.mp4` (exterior → pool → living room). `scripts/hero-frames.sh` turns it into 95 WebP frames: `public/video/frames/d/` (1600×900) and `frames/m/` (720×960 centre crop, used when the viewport is portrait). ~4.5 MB / ~2.3 MB.
- The section is 260svh tall with a sticky 100svh stage. JS sets `--p` (0 → 1) from scroll and draws the nearest loaded frame to a `<canvas>` (cover-fit). A `<video>` is not used because it can't seek smoothly.
- Depth, all from `--p` in global.css: the media tilts back ≤3° and settles from scale 1.12; the copy fades and rises fast; the roof line drifts as a foreground plane; in the last 15% the frame insets slightly like a card. The nav stays transparent for the whole pinned distance (`--hero-travel`).
- Frames load only after `load` (coarse-to-fine: every 16th, 8th, …, so the whole range scrubs early). The poster (first frame) is the LCP element.
- Opt-in: an inline `<head>` script adds `html.scrub` only with JS on, motion allowed, no Save-Data/slow link, and `svh` support. Without it (reduced motion, no JS, old browsers) no frames load and the hero is a normal 100svh poster. Frames also wait until the hero is on screen, and faded-out hero links ignore taps (`.is-faded`).

## Motion
- **Signature:** the logo's roof line (eave → beam → ridge). It draws itself over the hero video on load (2.4s), and again in the valuation band, where scroll position drives it (CSS `animation-timeline: view()`, static where unsupported).
- Hero: headline words rise out of masks with a 70ms stagger, and the phrase marked `*...*` in i18n is set in Cormorant italic. The media settles from scale 1.08 to 1 on load. Once the roof line has drawn, a small point of light travels along it 3 times over 5s each, then stops (`.m-comet`), so it doesn't repaint forever. The roof line shows on mobile too.
- Sections fade in and rise 24px, 700ms `cubic-bezier(0.16,1,0.3,1)`. Photos use `data-reveal="clip"` (uncovered bottom-up). Built with IntersectionObserver + CSS, no animation library.
- Buttons (`btn` utility): the fill sweeps in from the left on hover, with a 1px press on `:active`. Links (`link-line`): the underline grows from the left.
- Nav: IntersectionObserver sentinel (no scroll listener), plus a 1px brand reading-progress line (scroll timeline).
- About photo: gentle parallax (scroll timeline). Gallery modal: fade/lift via `@starting-style`, and arrow keys page through photos.
- Everything above is disabled under `prefers-reduced-motion`.

## Layout notes (2026-09-24 redesign)
- Counters are a white panel overlapping the hero's bottom edge (the scroll cue was dropped because the panel covers that spot).
- Services: sticky heading + rows. Projects: 6-cell bento (1 large feature cell). Areas: accordion strip on desktop, scroll-snap on mobile. Testimonials: the earthquake quote large on its own, the other 3 in a row.
- Eyebrows only on Projects, About, and Contact, so the label doesn't repeat on every section.

## Accessibility checklist
- Text contrast ≥ 4.5:1 (large text ≥ 3:1), including text over the video on its brightest frame.
- Every image has alt text in both languages. Decorative images use `alt=""`.
- The hero canvas and poster are `aria-hidden` (decorative). The frames move only when the visitor scrolls, so there is nothing autoplaying to pause. They are never loaded under `prefers-reduced-motion` or Save-Data.
- Focus ring: 2px `--brand` outline with a 2px offset. Use white on dark sections. Never remove it.
- Tap targets ≥ 44×44px with ≥ 8px spacing.
- Form: a `<label>` on every field, errors linked with `aria-describedby`, and status announced via `aria-live="polite"`.
- `<html lang="tr">` or `lang="en"`. The language switch has an `aria-label`.
- No horizontal scroll at 360px. Pinch-zoom is never disabled.
