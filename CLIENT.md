# CLIENT.md — Özdemir Emlak & Yatırım ve Gayrimenkul

Single source of truth for business facts. Claude must not invent anything that isn't listed here.
The site was handed over from a previous client (MAJÖR GAYRİMENKUL, İskenderun) on 2026-10-30. None of that client's facts, reviews or photos may be reused.

## Business
- **Name:** Özdemir Emlak & Yatırım ve Gayrimenkul
- **Address:** Mustafa Kemal Paşa, Kaymakam S. Koloğlu Sk. No:5/2, 16860 İznik/Bursa, Türkiye
- **Experience, founder, staff:** TODO(client), see Open questions.
- **Tagline:** "Hayalinizdeki evi sizin için buluyoruz." (kept from the template). TODO(client): confirm or replace.

## Brand
- **Logo:** red geometric roof mark + "Özdemir" navy script wordmark + "YATIRIM & GAYRİMENKUL" with thin red rules. Source: `asset/logo/new logo.jpg` (a 3D mock-up photo on a metal plate, raster only). The site uses an SVG redrawn from it.
- **Colours:** navy is the primary brand colour. Red is a secondary accent only, used sparingly (thin rules, the roof mark). It is never used for buttons or large surfaces.

## Contact
| Channel | Display | Link |
|---|---|---|
| Phone / WhatsApp | 0553 971 53 53 | `tel:+905539715353` · `https://wa.me/905539715353` |
| Email | isaozdmr0616@gmail.com | `mailto:isaozdmr0616@gmail.com` |
| Google Maps | — | https://maps.app.goo.gl/Lq6Xus7d4Wi966vj7 |

The phone above is the only number on the site.

WhatsApp prefilled text:
- TR: `Merhaba, web sitenizden ulaşıyorum. Bir gayrimenkul hakkında bilgi almak istiyorum.`
- EN: `Hello, I'm contacting you from your website. I'd like information about a property.`

## Online presence (complete list)
- Instagram: https://www.instagram.com/ozdemir.yatirimgayrimenkull
- Facebook: https://www.facebook.com/p/Özdemir-Yatırım-ve-Gayrimenkul-100063630309136/
- sahibinden.com store: https://ozdemiryatirimgayrimenkul.sahibinden.com/

These are all the channels the client has. There is no hepsiemlak and no Emlakjet.

## Testimonials
None yet. The Testimonials section is hidden (`Page.astro`) until real Google reviews are supplied.

## Services (confirm with client)
- Satılık konut / işyeri / arsa
- Kiralık konut / işyeri
- Gayrimenkul değerleme (ekspertiz danışmanlığı)
- Yatırım danışmanlığı

## Open questions — client to answer
- [ ] Founder / broker name, short bio (3–4 sentences) and portrait photo
- [ ] Years of experience and any real stats (properties sold/rented, followers). The Counters section stays hidden until these arrive
- [ ] Google reviews to quote, plus the overall rating and review count
- [ ] Office exterior/interior photos (About currently shows a placeholder)
- [ ] Working hours (weekdays / Saturday / Sunday)
- [ ] Confirm the services list above
- [ ] Neighbourhoods to feature in the area guide (the current list is our proposal around İznik/Bursa)
- [ ] Vector logo (SVG/AI/PDF) and exact brand colours (HEX). Ours are redrawn/eyeballed from the mock-up photo
- [ ] KVKK aydınlatma metni (privacy notice), **needed before launch**
- [ ] Domain name (the config uses `ozdemiryatirimgayrimenkul.com` as a placeholder) and who owns the Vercel account
- [ ] After launch: add the website URL to the Google Business profile

## Materials checklist → drop into `/asset`
| Folder | What | Status |
|---|---|---|
| `asset/logo/` | Logo (`new logo.jpg`, raster mock-up) | ✅ have. Vector ❌ needed |
| `asset/hero video/` | `hero section v2.mp4` (2560×1440, 8 s), used as the scroll-driven hero | ✅ have |
| `asset/team/` | Founder portrait, ≥ 1200px, clean background | ❌ needed |
| `asset/office/` | Office exterior + interior | ❌ needed |
| `asset/neighbourhoods/` | Real photos of the featured areas (stock is used until then) | optional |
