# CLIENT.md — MAJÖR GAYRİMENKUL

Single source of truth for business facts. Claude must not invent anything that isn't listed here.

## Business
- **Name:** MAJÖR GAYRİMENKUL
- **City:** İskenderun, Hatay, Türkiye
- **Experience:** 16+ yıl uzmanlık (16+ years of expertise)
- **Founder / broker:** Zeki Teymur
- **Address:** ⚠️ conflict. Instagram says "Bakü Cd. No-6 …" but Google Maps says "Savaş … İskenderun/Hatay". TODO(client): which one is current? Also fix the outdated one on that platform.
- **Staff:** Şehmuz Sönmez (0532 170 63 58, also named in a Google review as "Şehmuz bey") and Nazmiye Küyük (0532 271 10 93). TODO(client): their roles, and should they appear in a team section?
- **Tagline (from Instagram):** "Hayalinizdeki evi sizin için buluyoruz."
- **Instagram:** 7,500 followers (as of 2026-09-24). The bio also says "خدمة عقارية" (Arabic, "real estate service"), so they have Arabic-speaking clients.

## Brand
- **Logo:** blue geometric **M** mark + MAJÖR wordmark (the shop sign version). Files: `asset/branding/DD3AC9B3….webp` (on white) and `asset/branding/e5f3949c….webp` (white on blue). Both are raster only.
- The serif MAJÖR logo on Instagram is **not** used as the logo. Only its black-and-white mood is borrowed (see DESIGN.md).

## Contact
| Channel | Display | Link |
|---|---|---|
| Office phone | (0326) 614 15 55 | `tel:+903266141555` |
| Şehmuz Sönmez | 0532 170 63 58 | `tel:+905321706358` |
| Nazmiye Küyük | 0532 271 10 93 | `tel:+905322711093` |
| WhatsApp (Şehmuz Sönmez) | 0532 170 63 58 | `https://wa.me/905321706358` |
| Google Maps | — | https://maps.app.goo.gl/BicvFDZdN4DZuDTS6 |

No public email and no LinkedIn (removed at the client's request).

WhatsApp prefilled text:
- TR: `Merhaba, web sitenizden ulaşıyorum. Bir gayrimenkul hakkında bilgi almak istiyorum.`
- EN: `Hello, I'm contacting you from your website. I'd like information about a property.`

## Online presence
- Instagram: https://www.instagram.com/major_gayrimenkul
- Facebook: https://www.facebook.com/iskenderunmajor/
- Hepsiemlak office: https://www.hepsiemlak.com/emlak-ofisi/major-gayrimenkul-32877
- Emlakjet office: https://www.emlakjet.com/emlak-ofisleri/major-gayrimenkul-606934

## Testimonials (Google reviews, all 5/5)
Source: `asset/testimonials/google-reviews.png`. These are quoted verbatim, including the original spelling. On the site, show them as first name + last initial, and link each card to the Google Maps reviews page.
Public Google reviews can be quoted with attribution. Whether to show full names is the client's call.

| Order | Name on site | Quote |
|---|---|---|
| 1 | Recep A. | "Deprem sonrası bile işlerini aksatmadılar." |
| 2 | Kemal Türker U. (Doç. Dr.) | "Güvenilir ve yakın ilgisi ile Şehmuz bey işinin ehli bir emlakçı. Teknik destek ve uygun emlak alımında yardımcı bir emlakçı. Tavsiye ederim." |
| 3 | Mesut K. | "Kiralık veya satılık evler arıyorsanız doğru adres burası çalışanları çok ilgili hepside çok nazik" |
| 4 | Mazlum U. | "Gayri menkul konusunda uzman bir kuruluş." |

Excluded: Günay Ö. ("…Geri dönmedi" reads as a complaint), reviews that are too short ("Hizmet iyi", "Çok ilgili bir kurum"), and Mustafa Anıl A. (text is cut off in the screenshot).
EN versions are translated for the `/en/` page and labelled "translated from Turkish".

## Photo shot list (to take with a phone)
General rules: daylight, clean the lens, hold the phone **horizontal** (unless a vertical shot is listed), turn HDR on, no digital zoom, tidy the space first.

| # | Shot | How | Folder |
|---|---|---|---|
| 1 | **Founder portrait (Zeki Teymur)**, top priority | Waist-up, looking at camera, dark jacket, plain light wall or blurred office behind, standing near a window for soft light. 2 vertical + 2 horizontal. Add 1 natural shot at the desk talking with a client (client seen from behind) | `asset/team/` |
| 2 | **Team** | If Şehmuz bey or others work there, take individual portraits in the same spot and light as #1, plus one group shot in front of the office | `asset/team/` |
| 3 | **Office exterior** | Shoot from across the street so the whole facade and sign fit in frame. Straight-on + a slight angle, between 10:00 and 15:00, with no cars or bins in front if possible | `asset/office/` |
| 4 | **Office interior** | 3 shots: desk area, meeting table, a detail (keys on the desk, logo on the wall, documents). All lights on | `asset/office/` |
| 5 | **Neighbourhoods** | 1–2 per featured area (4–6 areas): a landmark, the seafront, or a typical nice street. Sunny day, ideally golden hour (1h before sunset). **Always include the İskenderun seafront/promenade** (used as the share image and video fallback) | `asset/neighbourhoods/<area>/` |
| 6 | **Key handover** (optional, high value) | Handing keys to a real client in front of a home, only with their permission. Faces can be out of shot | `asset/team/` |

Not needed: property photos (the example projects use stock) and hero photos (the video covers the hero).

## Services (confirm with client)
- Satılık konut / işyeri / arsa
- Kiralık konut / işyeri
- Gayrimenkul değerleme (ekspertiz danışmanlığı)
- Yatırım danışmanlığı

## Open questions — client to answer
- [ ] Full street address (for the footer, JSON-LD, and map)
- [ ] Working hours (weekdays / Saturday / Sunday)
- [ ] Confirm the services list above; anything to add or remove?
- [ ] Real stats: properties sold/rented, number of clients, active listings
- [ ] Short founder bio (3–4 sentences) and approval to use the photo
- [ ] Google overall rating + total review count (for the "Google'da 5.0 ★ · N yorum" badge) + direct reviews link
- [ ] Current address: Bakü Cd. or Savaş …? (see Business)
- [ ] Şehmuz Sönmez and Nazmiye Küyük: roles, include in a team section?
- [ ] After launch: add the website URL to the Google Business profile (it currently shows "Add website")
- [ ] KVKK aydınlatma metni (privacy notice). Get it from a lawyer/accountant or approve a standard template
- [ ] Domain name (buy or transfer?) and who owns the Vercel account
- [ ] **Vector logo** (SVG/AI/PDF) plus a white/negative version. Only raster webp exists now. Also confirm the exact brand blue (HEX/Pantone)
- [ ] Neighbourhoods to feature in the guide (4–6), each with 1–2 lines on why buyers like it
- [ ] Arabic version of the site later? (the IG bio targets Arabic speakers; currently TR + EN only)

## Materials checklist → drop into `/asset`
| Folder | What | Status |
|---|---|---|
| `asset/branding/` | Logos, shop sign, IG screenshot | ✅ have (raster only) |
| `asset/hero video/` | Hero background video, 4K original + `web/` encodes (1080 mp4 2.7 MB, 1080 webm 3.2 MB, 720 mp4 1.1 MB, poster) | ✅ done |
| `asset/logo/` | Vector logo (SVG/AI/PDF), color + white | ❌ needed |
| `asset/properties/` | Stock photos for the 6 example projects (Unsplash/Pexels, note the credit). Real project photos are optional and replace stock later | Claude sources stock during the build |
| `asset/neighbourhoods/` | One photo per featured area, ≥ 1600px | ❌ needed (or stock/own phone photos) |
| `asset/team/` | Founder portrait, ≥ 1200px, clean background | ❌ needed |
| `asset/office/` | Better office exterior + interior. The shop-sign screenshot is a placeholder | optional |
| `asset/testimonials/` | Google reviews screenshot (`google-reviews.png`) | ✅ have (4 selected, see Testimonials) |

Photos from phones are fine if they're shot in daylight with the lens cleaned and phone held horizontal. Avoid portal-watermarked images.
