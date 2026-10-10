import { useMemo, useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { products, matches, CATEGORIES, FAMILIES, LUXE, type Product } from '@/lib/catalog';
import { ProductCard } from './product-card';
import { ProductDialog } from './product-dialog';
import { useRevealObserver } from '@/lib/motion';

export type Filters = { category: string | null; family: string | null; luxe: boolean };
export const EMPTY_FILTERS: Filters = { category: null, family: null, luxe: false };
const PAGE = 12;

function Chip({ active, onClick, children, testId }: { active: boolean; onClick: () => void; children: React.ReactNode; testId: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      data-testid={testId}
      className={`min-h-[44px] shrink-0 px-4 text-[0.92rem] border transition-colors duration-300 ${
        active
          ? 'bg-[hsl(var(--ink))] text-[hsl(var(--background))] border-[hsl(var(--ink))]'
          : 'border-border hover:border-[hsl(var(--champagne))] bg-card/60'
      }`}
    >
      {children}
    </button>
  );
}

export function Catalogue({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const [selected, setSelected] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const hasLuxe = useMemo(() => products.some((p) => p.collection === LUXE), []);
  const families = useMemo(() => FAMILIES.filter((f) => products.some((p) => p.families.includes(f))), []);

  const results = useMemo(
    () =>
      products.filter(
        (p) =>
          matches(p, query) &&
          (!filters.category || p.categories.includes(filters.category)) &&
          (!filters.family || p.families.includes(filters.family)) &&
          (!filters.luxe || p.collection === LUXE),
      ),
    [query, filters],
  );
  const visible = results.slice(0, limit);
  useRevealObserver(`${visible.length}-${query}-${JSON.stringify(filters)}`);

  const active = !!query || !!filters.category || !!filters.family || filters.luxe;
  const update = (f: Filters) => {
    setFilters(f);
    setLimit(PAGE);
  };
  const reset = () => {
    setQuery('');
    update(EMPTY_FILTERS);
  };

  return (
    <section id="catalogue" aria-labelledby="catalogue-title" className="scroll-mt-20 px-5 md:px-10 py-24 md:py-36 mx-auto max-w-[1400px]">
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-end" data-reveal>
        <div>
          <p className="eyebrow text-[hsl(var(--champagne))]">Catalogue</p>
          <h2 id="catalogue-title" className="font-display text-5xl md:text-7xl mt-3 leading-[0.95]">
            Toutes les références,<br /><span className="italic">une à une.</span>
          </h2>
        </div>
        <p className="max-w-sm text-muted-foreground">
          Recherchez un code, un nom ou une marque citée comme inspiration. Ouvrez une fiche pour noter la référence.
        </p>
      </div>

      <div className="sticky top-16 md:top-20 z-20 mt-12 -mx-5 md:mx-0 px-5 md:px-0 py-4 bg-[hsl(var(--background)/0.92)] backdrop-blur-md border-b border-border">
        <div className="flex gap-3">
          <label className="relative flex-1">
            <span className="sr-only">Rechercher par code, nom ou marque</span>
            <Search aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }}
              placeholder="Code, nom ou marque — ex. 055"
              className="w-full min-h-[48px] pl-11 pr-11 bg-card border border-input text-base focus:outline-none focus:border-[hsl(var(--champagne))] transition-colors"
              data-testid="input-search"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Effacer la recherche" className="absolute right-1 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center" data-testid="button-clear-search">
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
          <button
            type="button"
            className="md:hidden min-h-[48px] px-4 border border-input flex items-center gap-2"
            aria-expanded={showFilters}
            aria-controls="filters-panel"
            onClick={() => setShowFilters((s) => !s)}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filtres
          </button>
        </div>
        <div id="filters-panel" className={`${showFilters ? 'block' : 'hidden'} md:block mt-4 space-y-3`}>
          <div role="group" aria-label="Catégorie" className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={filters.category === c} onClick={() => update({ ...filters, category: filters.category === c ? null : c })} testId={`filter-category-${c}`}>
                {c === 'Mixte' ? 'Mixtes' : c}
              </Chip>
            ))}
            {hasLuxe && (
              <Chip active={filters.luxe} onClick={() => update({ ...filters, luxe: !filters.luxe })} testId="filter-luxe">Collection Luxe</Chip>
            )}
          </div>
          {families.length > 0 && (
            <div role="group" aria-label="Rubrique de la brochure" className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {families.map((f) => (
                <Chip key={f} active={filters.family === f} onClick={() => update({ ...filters, family: filters.family === f ? null : f })} testId={`filter-family-${f}`}>
                  {f}
                </Chip>
              ))}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <p aria-live="polite" data-testid="text-result-count">
            {results.length} {results.length > 1 ? 'références' : 'référence'}
          </p>
          {active && (
            <button type="button" onClick={reset} className="min-h-[44px] px-2 underline underline-offset-4 decoration-[hsl(var(--champagne))]" data-testid="button-reset">
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="py-24 text-center max-w-md mx-auto" data-testid="status-empty">
          <p className="font-display italic text-4xl">Aucune référence trouvée.</p>
          <p className="mt-4 text-muted-foreground">
            Vérifiez l’orthographe, essayez le code seul (par exemple 055) ou retirez un filtre.
          </p>
          <button type="button" onClick={reset} className="mt-8 min-h-[44px] px-6 border border-[hsl(var(--ink)/0.35)] hover:border-[hsl(var(--champagne))] transition-colors" data-testid="button-reset-empty">
            Réinitialiser la recherche
          </button>
        </div>
      ) : (
        <>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 md:gap-y-16">
            {visible.map((p, i) => (
              <ProductCard key={p.reference} product={p} index={i} onOpen={setSelected} />
            ))}
          </div>
          {results.length > limit && (
            <div className="mt-16 flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground">{visible.length} sur {results.length}</p>
              <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="min-h-[48px] px-8 border border-[hsl(var(--ink)/0.35)] hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--background))] transition-colors duration-300" data-testid="button-load-more">
                Voir plus
              </button>
            </div>
          )}
        </>
      )}
      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
