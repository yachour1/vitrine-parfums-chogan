import { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { Header } from '@/components/site/header';
import { ShopLink } from '@/components/site/shop-link';
import { Catalogue, EMPTY_FILTERS, type Filters } from '@/components/site/catalogue';
import { products, LUXE } from '@/lib/catalog';
import { useParallax, useRevealObserver, useRichMotion } from '@/lib/motion';

const count = (fn: (p: (typeof products)[number]) => boolean) => products.filter(fn).length;

function Visual({ src, alt, w, h, className = '', depth, caption = true }: { src: string; alt: string; w: number; h: number; className?: string; depth?: number; caption?: boolean }) {
  return (
    <figure className={className}>
      <div data-depth={depth}>
        <img src={src} alt={alt} width={w} height={h} loading="lazy" className="w-full h-auto object-contain" />
      </div>
      {caption && <figcaption className="mt-2 text-[0.7rem] tracking-wide text-muted-foreground">Visuel de collection — non contractuel</figcaption>}
    </figure>
  );
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const rich = useRichMotion();
  useParallax(rich);
  useRevealObserver('home');

  const jump = (f: Partial<Filters>) => {
    setFilters({ ...EMPTY_FILTERS, ...f });
    document.getElementById('catalogue')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const entries = [
    { key: 'Pour elle', title: 'Pour elle', line: 'Fleurs blanches, lys, compositions lumineuses.', img: '/images/section-pour-elle.webp', alt: 'Flacon rouge Olfazeta, illustration de la section Pour elle', tone: 'bg-[hsl(var(--blush)/0.6)]' },
    { key: 'Pour lui', title: 'Pour lui', line: 'Lignes sombres, flacon noir, reflets.', img: '/images/brochure-p12-178.webp', alt: 'Flacon noir avec reflet issu de la brochure', tone: 'bg-[hsl(36_18%_88%)]' },
    { key: 'Mixte', title: 'Mixtes', line: 'À porter sans étiquette, à deux ou seul.', img: '/images/brochure-p18-309.webp', alt: 'Oranges issues de la brochure', tone: 'bg-[hsl(var(--champagne-soft)/0.5)]' },
  ];
  const hasLuxe = products.some((p) => p.collection === LUXE);
  const famImg: Record<string, string> = {
    Floraux: '/images/brochure-p12-2882.webp',
    'Parfums d’été': '/images/brochure-p8-1508.webp',
    Hespéridés: '/images/section-hesperides.webp',
    Boisés: '/images/brochure-p18-310.webp',
    'Orientaux ambrés': '/images/brochure-p2-50.webp',
  };
  const families = Object.keys(famImg).filter((f) => products.some((p) => p.families.includes(f)));

  return (
    <div id="top" className="grain min-h-[100dvh] bg-background">
      <Header />
      <main id="contenu">
        {/* HERO */}
        <section className="relative min-h-[100dvh] overflow-hidden pt-24 md:pt-28 px-5 md:px-10">
          <div aria-hidden className="absolute -right-[20vw] top-[10vh] h-[80vh] w-[80vh] rounded-full bg-[hsl(var(--blush)/0.55)] blur-3xl" />
          <div className="relative mx-auto max-w-[1400px] grid md:grid-cols-12 gap-12 md:gap-10 lg:gap-16 items-center min-h-[calc(100dvh-8rem)] pb-20 md:pb-24">
            <div className="md:col-span-6 lg:col-span-6 z-10">
              <p className="eyebrow text-[hsl(var(--champagne))]" data-reveal>Vitrine indépendante · Brochure parfums</p>
              <h1 className="font-display text-[3rem] leading-[0.94] sm:text-7xl md:text-[4.6rem] lg:text-[6rem] xl:text-[7rem] mt-6" data-reveal style={{ ['--d' as string]: '80ms' }}>
                Trouvez le parfum<br />qui vous <span className="italic text-[hsl(30_20%_30%)]">ressemble</span>
              </h1>
              <p className="mt-8 max-w-md text-[1.05rem] text-foreground/75" data-reveal style={{ ['--d' as string]: '160ms' }}>
                Une sélection des références de la brochure, rangées pour flâner : par envie, par famille, par code. Notez celle qui vous parle, puis retrouvez-la sur la boutique Chogan.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3" data-reveal style={{ ['--d' as string]: '240ms' }}>
                <a href="#catalogue" className="inline-flex min-h-[48px] items-center justify-center px-7 bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(30_8%_22%)] transition-colors duration-300" data-testid="link-explore">
                  Explorer les parfums
                </a>
                <ShopLink variant="ghost" testId="link-shop-hero" className="min-h-[48px]">Accéder à la boutique</ShopLink>
              </div>
            </div>
            <div className="md:col-span-6 relative flex justify-center md:justify-end pb-16 md:pb-0">
              <figure className="relative w-full max-w-[min(560px,62dvh)]" data-reveal style={{ ['--d' as string]: '200ms' }}>
                <div aria-hidden className="absolute -inset-3 md:-inset-5 border border-[hsl(var(--champagne)/0.35)]" />
                <div data-depth="-0.04" className="relative aspect-square bg-[hsl(var(--card))] overflow-hidden">
                  <img src="/images/hero-ambiance.webp" alt="Ambiance parfumée : flacon, pétales et fleurs blanches" width={1080} height={1080} fetchPriority="high" className="h-full w-full object-contain" />
                </div>
                <figcaption className="mt-6 md:mt-8 text-[0.7rem] tracking-wide text-muted-foreground text-right">Image d’ambiance — non contractuelle</figcaption>
              </figure>
            </div>
          </div>
          <a href="#collections" className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs eyebrow text-muted-foreground min-h-[44px]" data-testid="link-scroll-cue">
            Défiler <ArrowDown aria-hidden className="h-4 w-4 scroll-cue" />
          </a>
        </section>

        {/* MANIFESTO */}
        <section className="px-5 md:px-10 py-24 md:py-40 bg-[hsl(var(--ink))] text-[hsl(var(--background))]">
          <div className="mx-auto max-w-5xl grid md:grid-cols-[1fr_1.3fr] gap-12 items-center">
            <Visual src="/images/section-avant-choisir.webp" alt="Flacon doré Olfazeta Luxury, illustration de la section Avant de choisir" w={1080} h={1080} className="w-full max-w-[260px] mx-auto [&_figcaption]:text-[hsl(40_20%_70%)]" />
            <div data-reveal>
              <p className="eyebrow text-[hsl(var(--champagne-soft))]">Avant de choisir</p>
              <p className="font-display text-4xl md:text-6xl leading-[1.05] mt-5">
                Un parfum se choisit lentement. <span className="italic text-[hsl(var(--champagne-soft))]">Ici, rien ne presse.</span>
              </p>
              <p className="mt-8 text-[hsl(40_20%_82%)] max-w-lg">
                {products.length > 0 ? `${products.length} références vérifiées une à une sur la brochure. ` : ''}Pas de panier, pas de compte : seulement de quoi repérer un code avant de passer sur la boutique.
              </p>
            </div>
          </div>
        </section>

        {/* COLLECTIONS */}
        <section id="collections" aria-labelledby="col-title" className="scroll-mt-20 px-5 md:px-10 py-24 md:py-36">
          <div className="mx-auto max-w-[1400px]">
            <div data-reveal className="max-w-2xl">
              <p className="eyebrow text-[hsl(var(--champagne))]">Collections</p>
              <h2 id="col-title" className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">Par où <span className="italic">commencer ?</span></h2>
            </div>

            <div className="mt-16 grid md:grid-cols-12 gap-6 md:gap-8">
              {entries.map((e, i) => {
                const layout = ['md:col-span-7 md:row-span-2', 'md:col-span-5', 'md:col-span-5'][i];
                const n = count((p) => p.categories.includes(e.key));
                return (
                  <button
                    key={e.key}
                    type="button"
                    onClick={() => jump({ category: e.key })}
                    data-reveal
                    style={{ ['--d' as string]: `${i * 100}ms` }}
                    className={`img-zoom group relative overflow-hidden text-left ${e.tone} ${layout} p-7 md:p-10 flex ${i === 0 ? 'flex-col min-h-[460px] md:min-h-[640px]' : 'items-center gap-6 min-h-[260px] md:min-h-[300px]'}`}
                    data-testid={`button-collection-${e.key}`}
                  >
                    <div className={i === 0 ? '' : 'flex-1'}>
                      <p className="eyebrow text-muted-foreground">{String(i + 1).padStart(2, '0')} · {n} références</p>
                      <h3 className={`font-display mt-3 ${i === 0 ? 'text-6xl md:text-8xl' : 'text-5xl'}`}>{e.title}</h3>
                      <p className="mt-3 text-foreground/75 max-w-xs">{e.line}</p>
                      <span className="mt-6 inline-block text-sm underline underline-offset-4 decoration-[hsl(var(--champagne))] group-hover:decoration-2">Voir la sélection</span>
                    </div>
                    <div className={i === 0 ? 'mt-auto self-end w-[70%] md:w-[60%]' : 'w-[38%] shrink-0'}>
                      <img src={e.img} alt={e.alt} loading="lazy" width={400} height={400} className="w-full h-auto object-contain" />
                      <p className="mt-1 text-[0.65rem] text-muted-foreground text-right">Visuel de collection — non contractuel</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* LUXE moment */}
        {hasLuxe && (
          <section aria-labelledby="luxe-title" className="relative overflow-hidden px-5 md:px-10 py-24 md:py-40 bg-[hsl(36_22%_90%)]">
            <div className="mx-auto max-w-[1300px] grid md:grid-cols-2 gap-12 items-center">
              <figure className="relative mx-auto w-full max-w-[460px] order-2 md:order-1">
                <div data-depth="0.05" className="aspect-square">
                  <img src="/images/luxe-collection-doree.webp" alt="Illustration dorée générique de la collection Luxe" width={1080} height={1080} loading="lazy" className="h-full w-full object-contain" />
                </div>
                <figcaption className="mt-3 text-[0.7rem] text-muted-foreground">Illustration de collection — non contractuelle</figcaption>
              </figure>
              <div className="order-1 md:order-2" data-reveal>
                <p className="eyebrow text-[hsl(var(--champagne))]">Collection Luxe / Luxury</p>
                <h2 id="luxe-title" className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">Le flacon <span className="italic">habillé</span> de la brochure.</h2>
                <p className="mt-6 text-foreground/75 max-w-md">
                  Les références signalées Luxe / Luxury dans la brochure, rassemblées à part. {count((p) => p.collection === LUXE)} au total.
                </p>
                <button type="button" onClick={() => jump({ luxe: true })} className="mt-10 min-h-[48px] px-7 bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(30_8%_22%)] transition-colors duration-300" data-testid="button-collection-luxe">
                  Voir la collection Luxe
                </button>
              </div>
            </div>
          </section>
        )}

        {/* FAMILIES ribbon */}
        {families.length > 0 && (
          <section aria-labelledby="fam-title" className="px-5 md:px-10 py-24 md:py-32">
            <div className="mx-auto max-w-[1400px]">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6" data-reveal>
                <h2 id="fam-title" className="font-display text-5xl md:text-6xl leading-[0.95]">Rubriques <span className="italic">de la brochure</span></h2>
                <p className="text-muted-foreground max-w-sm">Les familles telles que la brochure les présente, reprises sans interprétation. Choisissez-en une pour filtrer le catalogue.</p>
              </div>
              <ul className="mt-12 border-t border-border">
                {families.map((f, i) => (
                  <li key={f} data-reveal style={{ ['--d' as string]: `${i * 60}ms` }}>
                    <button type="button" onClick={() => jump({ family: f })} className="group img-zoom w-full grid grid-cols-[auto_1fr_auto] items-center gap-5 md:gap-10 py-6 md:py-8 border-b border-border text-left hover:bg-[hsl(var(--blush)/0.3)] transition-colors duration-300 px-2" data-testid={`button-family-${f}`}>
                      <span className="text-sm text-muted-foreground w-8">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-4xl md:text-6xl group-hover:italic">{f}</span>
                      <span className="flex items-center gap-5">
                        <span className="hidden sm:inline text-sm text-muted-foreground">{count((p) => p.families.includes(f))} réf.</span>
                        <img src={famImg[f]} alt="" loading="lazy" width={96} height={96} className="h-16 w-16 md:h-24 md:w-24 object-contain" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.7rem] text-muted-foreground">Illustrations de section — non contractuelles</p>
            </div>
          </section>
        )}

        <div aria-hidden className="relative h-[34vh] md:h-[48vh] overflow-hidden">
          <img src="/images/transition-florale.webp" alt="" width={1080} height={1080} loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <Catalogue filters={filters} setFilters={setFilters} />

        {/* HOW TO ORDER */}
        <section id="commander" aria-labelledby="order-title" className="scroll-mt-20 px-5 md:px-10 py-24 md:py-36 bg-[hsl(var(--blush)/0.45)]">
          <div className="mx-auto max-w-[1300px] grid lg:grid-cols-[0.9fr_1.4fr] gap-14">
            <div data-reveal>
              <p className="eyebrow text-[hsl(var(--champagne))]">Comment commander</p>
              <h2 id="order-title" className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">Trois gestes, <span className="italic">simplement.</span></h2>
              <Visual src="/images/brochure-p24-2977.webp" alt="Flacon générique et fleurs blanches, visuel issu de la brochure" w={360} h={360} className="hidden lg:block mt-12 max-w-[300px]" depth={0.05} />
            </div>
            <ol className="space-y-0">
              {[
                ['Repérez votre parfum', 'Parcourez le catalogue et notez sa référence — par exemple 055 ou 148W.'],
                ['Ouvrez la boutique', 'Accédez au site Chogan via le lien de parrainage de cette vitrine.'],
                ['Recherchez la référence', 'Saisissez le code dans la recherche de la boutique, puis suivez ses étapes de commande.'],
              ].map(([t, d], i) => (
                <li key={t} data-reveal style={{ ['--d' as string]: `${i * 120}ms` }} className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-8 border-b border-[hsl(var(--ink)/0.15)] first:border-t">
                  <span className="font-display italic text-6xl md:text-7xl leading-none text-[hsl(var(--champagne))]">{i + 1}</span>
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl">{t}</h3>
                    <p className="mt-2 text-foreground/75 max-w-md">{d}</p>
                    {i === 1 && <ShopLink variant="text" testId="link-shop-step" className="mt-3">Ouvrir la boutique</ShopLink>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FINAL CTA */}
        <section aria-labelledby="cta-title" className="relative overflow-hidden px-5 md:px-10 py-24 md:py-36 bg-[hsl(var(--ink))] text-[hsl(var(--background))]">
          <div className="mx-auto max-w-[1200px] grid md:grid-cols-[1.4fr_1fr] gap-14 items-center">
            <div data-reveal>
              <h2 id="cta-title" className="font-display text-5xl md:text-8xl leading-[0.92]">Votre référence <span className="italic text-[hsl(var(--champagne-soft))]">est notée ?</span></h2>
              <p className="mt-6 text-[hsl(40_20%_82%)] max-w-md">Les achats s’effectuent sur le site Chogan via mon lien de parrainage.</p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <ShopLink variant="light" testId="link-shop-final" className="min-h-[52px] px-8">Accéder à la boutique</ShopLink>
                <span className="inline-flex items-center bg-[hsl(var(--background))] px-3 py-2">
                  <img src="/images/logo-chogan.webp" alt="Logo Chogan, boutique de destination" width={569} height={167} loading="lazy" className="h-6 w-auto" data-testid="img-chogan-logo" />
                </span>
              </div>
            </div>
            <div data-reveal style={{ ['--d' as string]: '150ms' }} className="justify-self-center md:justify-self-end text-center">
              <div className="bg-[hsl(var(--background))] p-5 inline-block">
                <img src="/images/referral-qr.png" alt="QR code menant au lien de parrainage vers la boutique Chogan" width={200} height={200} className="h-[200px] w-[200px]" data-testid="img-qr" />
              </div>
              <p className="mt-4 text-sm text-[hsl(40_20%_78%)]">Scannez, ou</p>
              <a href={SITE_CONFIG.referralUrl} target="_blank" rel="sponsored noopener noreferrer" className="mt-1 inline-flex min-h-[44px] items-center break-all text-sm underline underline-offset-4 decoration-[hsl(var(--champagne))]" data-testid="link-shop-qr">
                {SITE_CONFIG.referralUrl.replace(/^https?:\/\//, '')}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="px-5 md:px-10 pt-20 pb-28 md:pb-16 bg-[hsl(36_20%_92%)]">
        <div className="mx-auto max-w-[1300px] grid md:grid-cols-3 gap-10 text-[0.95rem]">
          <div>
            <p className="font-display text-3xl">{SITE_CONFIG.title}</p>
            <p className="mt-3 text-muted-foreground">Vitrine indépendante. Ce site n’est pas le site officiel de Chogan et n’est affilié à aucune des marques citées.</p>
          </div>
          <div>
            <p className="eyebrow text-[hsl(var(--champagne))]">Lien de parrainage</p>
            <p className="mt-3 text-foreground/80">
              Les boutons « Accéder à la boutique » et « Commander sur Chogan » ouvrent le site Chogan via mon lien de parrainage. Les achats, prix et conditions relèvent exclusivement de la boutique. Les noms de parfums et de marques sont des références d’inspiration citées dans la brochure ; les produits originaux ne sont pas vendus ici.
            </p>
          </div>
          <div>
            <p className="eyebrow text-[hsl(var(--champagne))]">Informations légales</p>
            <p className="mt-3 text-foreground/80 whitespace-pre-line" data-testid="text-legal">{SITE_CONFIG.legalText}</p>
            <p className="mt-4 text-sm text-muted-foreground">Aucun cookie de suivi ni outil de mesure d’audience.</p>
          </div>
        </div>
      </footer>

      {/* Mobile sticky shop */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-30">
        <ShopLink testId="link-shop-sticky" className="w-full shadow-[0_12px_30px_-10px_hsl(30_20%_10%/0.5)]">Boutique</ShopLink>
      </div>
    </div>
  );
}
