import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll motion for everything outside the hero (which has its own CSS intro and canvas scrub).
 * - [data-reveal] blocks (photos and titles included) fade and rise in batches. Only opacity and transform are
 *   animated: they stay on the compositor, so phones don't repaint while scrolling.
 * - Services: spotlight on the row at the middle of the screen.
 * Items are hidden from first paint by `.js [data-reveal]:not(.is-in)` (global.css); GSAP takes that hidden state
 * over inline and marks them .is-in. Reduced motion: nothing is hidden or moved.
 */
export function initMotion() {
  const root = document.documentElement;
  // The head script already dropped .js (3s fallback): content is visible, don't hide it again.
  if (!root.classList.contains('js')) return;
  root.classList.add('reveal-ready');

  const items = gsap.utils.toArray<HTMLElement>('main [data-reveal]');
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    items.forEach((el) => el.classList.add('is-in'));
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.set(items, { autoAlpha: 0, y: 40 });
    items.forEach((el) => el.classList.add('is-in'));

    // Blocks entering together rise in sequence.
    ScrollTrigger.batch(items, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          overwrite: true,
          clearProps: 'opacity,visibility,transform',
        }),
    });

    const services = document.getElementById('hizmetler');
    if (services) spotlight(services);
  });
}

/** Services: the row crossing the middle of the screen lights up, the counter flips to it, a line fills with scroll. */
function spotlight(section: HTMLElement) {
  const list = section.querySelector<HTMLElement>('[data-svc-list]');
  const rows = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.service-row'));
  const digits = section.querySelector<HTMLElement>('[data-svc-digits]');
  const fill = section.querySelector<HTMLElement>('[data-svc-fill]');
  if (!list || !rows.length) return;
  list.classList.add('spotlight');

  if (fill)
    gsap.to(fill, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top center', end: 'bottom center', scrub: 0.6 },
    });

  const light = (i: number) => {
    rows.forEach((r, j) => r.classList.toggle('is-lit', j === i));
    if (digits) gsap.to(digits, { yPercent: (-100 / rows.length) * i, duration: 0.7, ease: 'expo.out', overwrite: true });
  };

  rows.forEach((row, i) =>
    ScrollTrigger.create({
      trigger: row,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => light(i),
      onEnterBack: () => light(i),
    })
  );
}
