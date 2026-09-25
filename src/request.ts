// Real-estate request form: which fields each service asks for, and the WhatsApp message they produce.
// No imports on purpose: this runs in the browser bundle and under `node --test` (src/request.test.ts).

export const SERVICES = ['rent', 'buy', 'sell', 'letOut', 'manage', 'consult'] as const;
export type Service = (typeof SERVICES)[number];

/** Detail fields per service, in the order they are shown and written into the message. */
const DETAILS: Record<Service, string[]> = {
  rent: ['propertyType', 'city', 'district', 'rooms', 'budget', 'furnished', 'moveIn', 'notes'],
  buy: ['propertyType', 'city', 'district', 'rooms', 'budget', 'moveIn', 'notes'],
  sell: ['propertyType', 'city', 'district', 'rooms', 'size', 'askingPrice', 'available', 'location', 'notes'],
  letOut: ['propertyType', 'city', 'district', 'rooms', 'size', 'expectedRent', 'available', 'location', 'notes'],
  manage: ['propertyType', 'city', 'district', 'units', 'management', 'challenge', 'notes'],
  consult: ['topic', 'callTime', 'notes'],
};

/** Room count and furnishing only make sense for homes. */
const RESIDENTIAL = ['apartment', 'villa', 'townhouse', 'other'];
const HOME_ONLY = ['rooms', 'furnished'];

export const CONTACT_FIELDS = ['name', 'phone', 'method', 'email'];

export function visibleFields(service: Service, propertyType: string) {
  return DETAILS[service].filter((f) => !HOME_ONLY.includes(f) || RESIDENTIAL.includes(propertyType));
}

/** The `request` block of src/i18n/*.json plus the office name. */
export interface MessageText {
  office: string;
  greeting: string;
  heading: string;
  serviceLabel: string;
  clientHeading: string;
  services: Record<Service, string>;
  labels: Record<string, string>;
  options: Record<string, Record<string, string>>;
}

type Values = Record<string, string | undefined>;
type Entry = [label: string, value: string];

function entries(fields: string[], values: Values, t: MessageText): Entry[] {
  return fields.flatMap((f): Entry[] => {
    const raw = values[f]?.trim();
    return raw ? [[t.labels[f], t.options[f]?.[raw] ?? raw]] : [];
  });
}

/** Service line + the service's filled-in detail fields (notes go with the client block). */
export function buildEntries(service: Service, values: Values, t: MessageText): Entry[] {
  const fields = visibleFields(service, values.propertyType ?? '').filter((f) => f !== 'notes');
  return [[t.serviceLabel, t.services[service]], ...entries(fields, values, t)];
}

/** Contact details, then notes last so the office reads them just before replying. */
export function clientEntries(values: Values, t: MessageText): Entry[] {
  return entries([...CONTACT_FIELDS, 'notes'], values, t);
}

export function buildMessage(service: Service, values: Values, t: MessageText) {
  const line = ([label, value]: Entry) => `${label}: ${value}`;
  return [
    t.greeting.replace('{office}', t.office),
    '',
    `*${t.heading}*`,
    '',
    ...buildEntries(service, values, t).map(line),
    '',
    `*${t.clientHeading}*`,
    ...clientEntries(values, t).map(line),
  ].join('\n');
}
