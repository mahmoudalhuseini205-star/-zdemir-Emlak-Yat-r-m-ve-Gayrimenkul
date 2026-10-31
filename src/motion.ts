import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
// The mobile address bar showing/hiding resizes the viewport; re-measuring every pin then makes the page jump.
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Scroll motion for everything outside the hero (which has its own CSS intro and canvas scrub).
 * - [data-reveal] blocks rise in batches; [data-reveal="clip"] photos are uncovered bottom-up; h2s rise line by line.
 * - Services: spotlight on the row at the middle of the screen. Areas: pinned horizontal scroll.
 *   Testimonials: pinned stack of cards.
 * Items are hidden from first paint by `.js [data-reveal]:not(.is-in)` (global.css); GSAP takes that hidden state
 * over inline and marks them .is-in. ScrollTriggers are created section by section, top to bottom, so the pins
 * shift everything below them correctly on refresh. Reduced motion: nothing is hidden, pinned or moved.
 * Phones (< 768px) get the same choreography minus the paint-heavy parts: photos fade and rise instead of a
 * clip-path uncover (which repaints the image every frame), and the area photos skip their parallax drift.
 */
export function initMotion() {
  const root = document.documentElement;
  // The head script already dropped .js (3s fallback): content is visible, don't hide it again.
  if (!root.classList.contains('js')) return;
  root.classList.add('reveal-ready');

  const items = gsap.utils.toArray<HTMLElement>('main [data-reveal]');
  const mm = gsap.matchMedia();

  mm.add({ motion: '(prefers-reduced-motion: no-preference)', phone: '(max-width: 767px)' }, (ctx) => {
    const { motion, phone } = ctx.conditions!;
    if (!motion) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const isClip = (el: HTMLElement) => !phone && el.dataset.reveal === 'clip';
    gsap.set(
      items.filter((el) => !isClip(el)),
      { autoAlpha: 0, y: 40 }
    );
    gsap.set(items.filter(isClip), { clipPath: 'inset(100% 0% 0% 0%)', y: 60 });
    items.forEach((el) => el.classList.add('is-in'));

    const splits: SplitText[] = [];
    for (const section of gsap.utils.toArray<HTMLElement>('main section:not(#hero)')) {
      revealSection(section, splits, isClip);
      if (section.id === 'hizmetler') spotlight(section);
      if (section.hasAttribute('data-areas')) horizontal(section, phone);
      if (section.hasAttribute('data-reviews')) stack(section);
    }

    // Web fonts change line breaks and section heights: re-measure once they are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => splits.forEach((s) => s.revert());
  });
}

function revealSection(section: HTMLElement, splits: SplitText[], isClip: (el: HTMLElement) => boolean) {
  // Section title: each line slides up from behind its own mask.
  section.querySelectorAll<HTMLElement>('h2').forEach((h) =>
    splits.push(
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
    )
  );

  const own = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('[data-reveal]'));
  const fades = own.filter((el) => !isClip(el));
  const clips = own.filter(isClip);

  // Blocks entering together rise in sequence.
  if (fades.length)
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
  if (clips.length)
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
    // The icon draws itself in as its row lights up.
    const path = rows[i].querySelector('path');
    if (path) gsap.fromTo(path, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', overwrite: true });
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

/** Areas: pin the section and turn vertical scroll into a right-to-left slide of the panels. */
function horizontal(section: HTMLElement, phone: boolean) {
  const track = section.querySelector<HTMLElement>('[data-areas-track]');
  const panels = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.area-panel'));
  const digits = section.querySelector<HTMLElement>('[data-areas-digits]');
  const bar = section.querySelector<HTMLElement>('[data-areas-bar]');
  if (!track || panels.length < 2) return;
  section.classList.add('is-pinned');

  const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
  let shown = -1;

  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: 'none', // required: scroll position and slide position must map 1:1
    scrollTrigger: {
      trigger: section,
      // A section taller than the screen pins once its bottom is in view, so the panels are never cut off.
      start: () => (section.offsetHeight > innerHeight ? 'bottom bottom' : 'top top'),
      end: () => `+=${distance()}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (bar) gsap.set(bar, { scaleX: self.progress });
        const i = Math.round(self.progress * (panels.length - 1));
        if (i !== shown && digits) {
          shown = i;
          gsap.to(digits, { yPercent: (-100 / panels.length) * i, duration: 0.6, ease: 'expo.out', overwrite: true });
        }
      },
    },
  });

  panels.forEach((panel) => {
    // Each panel grows to full size as it reaches the middle...
    gsap.fromTo(
      panel,
      { scale: 0.9 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left right', end: 'center center', scrub: true },
      }
    );
    // ...while its photo drifts the other way, slower than the panel (depth).
    const media = panel.querySelector('.area-media');
    if (media && !phone)
      gsap.fromTo(
        media,
        { xPercent: -8 },
        {
          xPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true },
        }
      );
  });

  // Keyboard: tabbing to a link in an off-screen panel scrolls the page to where that panel is in view.
  panels.forEach((panel, i) =>
    panel.addEventListener('focusin', () => {
      const st = slide.scrollTrigger!;
      const y = st.start + (st.end - st.start) * (i / (panels.length - 1));
      if (Math.abs(scrollY - y) > 4) scrollTo({ top: y, behavior: 'instant' });
    })
  );
}

/** Testimonials: pin the section; each card slides up over the previous one, which sinks back and dims. */
function stack(section: HTMLElement) {
  const list = section.querySelector<HTMLElement>('[data-review-stack]');
  const cards = gsap.utils.toArray<HTMLElement>(section.querySelectorAll('.review-card'));
  if (!list || cards.length < 2) return;
  list.classList.add('is-stacked');

  gsap.set(cards.slice(1), { yPercent: 115, autoAlpha: 0 });
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut', duration: 1 },
    scrollTrigger: {
      trigger: section,
      start: () => (section.offsetHeight > innerHeight ? 'bottom bottom' : 'center center'),
      end: () => `+=${innerHeight * 0.9 * (cards.length - 1)}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });
  cards.slice(1).forEach((card, i) => {
    // Cards already in the stack sink back one more step as the new one arrives on top.
    tl.to(
      cards.slice(0, i + 1),
      { scale: (j: number) => 1 - 0.05 * (i + 1 - j), y: (j: number) => -14 * (i + 1 - j), opacity: (j: number) => 1 - 0.25 * (i + 1 - j) },
      i
    ).to(card, { yPercent: 0, autoAlpha: 1 }, i);
  });
}
