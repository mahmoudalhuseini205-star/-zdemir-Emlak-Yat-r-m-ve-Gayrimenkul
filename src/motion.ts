import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Scroll reveals for every [data-reveal] block outside the hero (which has its own CSS intro).
 * Items are hidden from first paint by `.js [data-reveal]:not(.is-in)` in global.css; here GSAP takes the
 * hidden state over inline, marks them .is-in (so the CSS rule lets go), and animates them in.
 * Reduced motion: nothing is hidden or moved (global.css shows everything).
 */
export function initMotion() {
  const root = document.documentElement;
  // The head script already dropped .js (3s fallback): content is visible, don't hide it again.
  if (!root.classList.contains('js')) return;
  root.classList.add('reveal-ready');

  const items = gsap.utils.toArray<HTMLElement>('main [data-reveal]');
  const fades = items.filter((el) => el.dataset.reveal !== 'clip');
  const clips = items.filter((el) => el.dataset.reveal === 'clip');
  const headings = gsap.utils.toArray<HTMLElement>('main section:not(#hero) h2');

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: reduce)', () => {
    items.forEach((el) => el.classList.add('is-in'));
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.set(fades, { autoAlpha: 0, y: 40 });
    gsap.set(clips, { clipPath: 'inset(100% 0% 0% 0%)', y: 60 });
    items.forEach((el) => el.classList.add('is-in'));

    // Blocks entering together rise in sequence.
    ScrollTrigger.batch(fades, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.12,
          overwrite: true,
          clearProps: 'opacity,visibility,transform',
        }),
    });

    // Photos are uncovered bottom-up like a lifted sheet; -8px keeps focus rings inside visible.
    ScrollTrigger.batch(clips, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          clipPath: 'inset(-8px -8px -8px -8px)',
          y: 0,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.15,
          overwrite: true,
          clearProps: 'clipPath,transform',
        }),
    });

    // Section titles: each line slides up from behind its own mask.
    const splits = headings.map((h) =>
      SplitText.create(h, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.1,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          }),
      })
    );

    // Web fonts change line breaks and section heights: re-measure once they are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => splits.forEach((s) => s.revert());
  });
}
