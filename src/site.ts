import tr from './i18n/tr.json';
import en from './i18n/en.json';

export type Lang = 'tr' | 'en';

const dictionaries = { tr, en } as const;

/** All copy lives in src/i18n/*.json — never hard-code strings in components. */
export function t(lang: Lang) {
  return dictionaries[lang];
}

/** `/about` in TR, `/en/about` in EN. */
export function path(lang: Lang, to = '/') {
  return lang === 'tr' ? to : `/en${to === '/' ? '/' : to}`;
}

/** Facts below come from CLIENT.md. Do not change without updating CLIENT.md. */
export const site = {
  name: 'MAJÖR GAYRİMENKUL',
  // TODO(client): full street address unconfirmed (Bakü Cd. vs Savaş …) — city only for now.
  city: 'İskenderun',
  region: 'Hatay',
  country: 'TR',
  officePhone: { display: '(0326) 614 15 55', href: 'tel:+903266141555' },
  mobilePhone: { display: '0530 854 39 00', href: 'tel:+905308543900' },
  whatsappNumber: '905308543900',
  maps: 'https://maps.app.goo.gl/BicvFDZdN4DZuDTS6',
  instagram: 'https://www.instagram.com/major_gayrimenkul',
  facebook: 'https://www.facebook.com/iskenderunmajor/',
  linkedin: 'https://www.linkedin.com/in/zeki-teymur-2b55235a/',
  sahibinden: 'https://majorgayrimenkul.sahibinden.com/',
  hepsiemlak: 'https://www.hepsiemlak.com/emlak-ofisi/major-gayrimenkul-32877',
  founder: 'Zeki Teymur',
  yearsExperience: 16,
  instagramFollowers: 7500,
} as const;

export function waLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Fills `{key}` placeholders in an i18n string. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}
