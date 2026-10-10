import { useEffect, useState } from 'react';

/** One-shot reveal on scroll. Content stays visible if JS / IO fails. */
export function useRevealObserver(dep: unknown) {
  useEffect(() => {
    const root = document.documentElement;
    if (!('IntersectionObserver' in window)) return;
    root.classList.add('js-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    const safety = window.setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('is-in');
      });
    }, 1500);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [dep]);
}

export function useRichMotion() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (pointer: fine)');
    const update = () => setOk(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return ok;
}

/** Subtle desktop-only parallax: elements with data-depth="0.1" */
export function useParallax(enabled: boolean) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-depth]'));
    if (!enabled) {
      els.forEach((el) => (el.style.transform = ''));
      return;
    }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const depth = Number(el.dataset.depth || 0.08);
        const off = (r.top + r.height / 2 - vh / 2) * -depth;
        el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);
}

export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return p;
}
