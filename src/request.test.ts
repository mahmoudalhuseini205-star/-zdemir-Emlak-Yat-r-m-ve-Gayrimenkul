// Run with `npm test` (Node's built-in runner; Node ≥ 22.18 strips the types).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SERVICES, visibleFields, buildEntries, buildMessage, type MessageText } from './request.ts';
import tr from './i18n/tr.json' with { type: 'json' };
import en from './i18n/en.json' with { type: 'json' };

const text = (lang: typeof tr): MessageText => ({ ...lang.request, office: 'MAJÖR GAYRİMENKUL' });

test('rooms and furnishing only show for residential types', () => {
  assert.ok(visibleFields('rent', 'apartment').includes('rooms'));
  assert.ok(visibleFields('rent', 'apartment').includes('furnished'));
  assert.ok(!visibleFields('rent', 'land').includes('rooms'));
  assert.ok(!visibleFields('rent', 'shop').includes('furnished'));
  assert.ok(!visibleFields('buy', 'apartment').includes('furnished'));
});

test('each service shows only its own fields', () => {
  assert.deepEqual(visibleFields('consult', ''), ['topic', 'callTime', 'notes']);
  assert.ok(visibleFields('sell', 'villa').includes('available'));
  assert.ok(!visibleFields('sell', 'villa').includes('budget'));
  assert.ok(visibleFields('manage', 'building').includes('units'));
  assert.ok(!visibleFields('letOut', 'office').includes('askingPrice'));
});

test('every field and option has a label in both languages', () => {
  for (const lang of [tr, en]) {
    for (const s of SERVICES) {
      assert.ok(lang.request.services[s], `${s} service label`);
      for (const f of visibleFields(s, 'apartment')) assert.ok(lang.request.labels[f as keyof typeof lang.request.labels], `${f} label`);
    }
  }
});

test('rent message: labelled lines, option labels, no empty fields, notes last', () => {
  const msg = buildMessage(
    'rent',
    {
      propertyType: 'apartment',
      city: 'İskenderun',
      district: '',
      rooms: '3+1',
      budget: '25.000 TL / ay',
      furnished: 'no',
      moveIn: 'month',
      notes: 'Okula yakın olsun',
      name: 'Ahmet Ali',
      phone: '0530 000 00 00',
      method: 'whatsapp',
      email: '',
    },
    text(tr)
  );
  assert.equal(
    msg,
    [
      'Merhaba MAJÖR GAYRİMENKUL,',
      '',
      '*Yeni gayrimenkul talebi*',
      '',
      'Hizmet: Kiralık arıyorum',
      'Emlak tipi: Daire',
      'Şehir: İskenderun',
      'Oda sayısı: 3+1',
      'Bütçe: 25.000 TL / ay',
      'Eşya durumu: Eşyasız',
      'Taşınma zamanı: 1 ay içinde',
      '',
      '*Müşteri bilgileri*',
      'Ad Soyad: Ahmet Ali',
      'Telefon: 0530 000 00 00',
      'Tercih edilen iletişim: WhatsApp',
      'Notlar: Okula yakın olsun',
    ].join('\n')
  );
});

test('hidden fields are dropped even if they still hold a value', () => {
  // User picked "apartment" (rooms filled), then switched to land.
  const entries = buildEntries('buy', { propertyType: 'land', city: 'Arsuz', rooms: '2+1', budget: '5M TL', moveIn: 'flexible' }, text(en));
  assert.ok(!entries.some(([label]) => label === en.request.labels.rooms));
  assert.deepEqual(entries[0], [en.request.serviceLabel, en.request.services.buy]);
});

test('every service path builds a message with contact details', () => {
  const values = {
    propertyType: 'office', city: 'İskenderun', district: 'Merkez', budget: '1', moveIn: 'now', size: '120',
    askingPrice: '3M TL', expectedRent: '20.000 TL', available: 'yes', location: 'https://maps.app.goo.gl/x',
    units: '4', management: 'self', challenge: 'Kiracı bulmak', topic: 'valuation', callTime: 'morning',
    name: 'Ayşe K.', phone: '+90 530 000 00 00', method: 'call', email: 'a@b.co',
  };
  for (const s of SERVICES) {
    const msg = buildMessage(s, values, text(en));
    assert.match(msg, new RegExp(`Service: ${en.request.services[s]}`));
    assert.match(msg, /Name: Ayşe K\./);
    assert.match(msg, /Preferred contact: Phone call/);
    assert.match(msg, /Email: a@b\.co/);
    assert.doesNotMatch(msg, /: *$/m, `${s}: no empty values`);
  }
});
