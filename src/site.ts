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
  name: 'Özdemir Emlak & Yatırım ve Gayrimenkul',
  street: 'Mustafa Kemal Paşa, Kaymakam S. Koloğlu Sk. No:5/2',
  postalCode: '16860',
  city: 'İznik',
  region: 'Bursa',
  country: 'TR',
  /** Single line: calls and WhatsApp. */
  phone: { display: '0553 971 53 53', href: 'tel:+905539715353' },
  whatsappNumber: '905539715353',
  email: 'isaozdmr0616@gmail.com',
  /** Monday–Saturday; closed on Sunday. */
  hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '17:00' },
  maps: 'https://maps.app.goo.gl/Lq6Xus7d4Wi966vj7',
  instagram: 'https://www.instagram.com/ozdemir.yatirimgayrimenkull',
  facebook: 'https://www.facebook.com/p/%C3%96zdemir-Yat%C4%B1r%C4%B1m-ve-Gayrimenkul-100063630309136/',
  sahibinden: 'https://ozdemiryatirimgayrimenkul.sahibinden.com/',
} as const;

export function waLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Fills `{key}` placeholders in an i18n string. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}
