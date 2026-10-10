import type { Product } from '@/lib/catalog';
import { collectionVisual, VISUAL_CAPTION } from '@/lib/catalog';

export function RefMark({ code, large }: { code: string; large?: boolean }) {
  return (
    <div aria-hidden className="relative flex items-center justify-center">
      <span className={`absolute rounded-full border border-[hsl(var(--champagne)/0.45)] ${large ? 'h-56 w-56' : 'h-32 w-32'}`} />
      <span className={`font-display italic text-[hsl(var(--ink)/0.88)] ${large ? 'text-8xl' : 'text-6xl'}`}>{code}</span>
    </div>
  );
}

const TONES = ['bg-[hsl(var(--blush)/0.5)]', 'bg-[hsl(var(--champagne-soft)/0.45)]', 'bg-[hsl(36_20%_90%)]'];

export function ProductCard({ product, index, onOpen }: { product: Product; index: number; onOpen: (p: Product) => void }) {
  const v = collectionVisual(product);
  const tone = TONES[index % 3];
  return (
    <article data-reveal style={{ ['--d' as string]: `${(index % 4) * 70}ms` }} data-testid={`card-product-${product.reference}`}>
      <button
        type="button"
        onClick={() => onOpen(product)}
        className="group img-zoom block w-full text-left"
        aria-label={`Voir la référence ${product.reference}, inspiration ${product.referenceName} de ${product.referenceBrand}`}
        data-testid={`button-open-${product.reference}`}
      >
        <div className={`relative aspect-[4/5] ${tone} flex items-center justify-center overflow-hidden`}>
          {v ? (
            <img src={v.src} alt="" loading="lazy" width={240} height={300} className="max-h-[72%] w-auto object-contain" />
          ) : (
            <RefMark code={product.reference} />
          )}
          {product.collection && (
            <span className="absolute left-3 top-3 eyebrow text-[0.62rem] text-[hsl(var(--ink)/0.7)]">Luxe</span>
          )}
          {v && <span className="absolute bottom-2 inset-x-0 text-center text-[0.65rem] text-muted-foreground">{VISUAL_CAPTION}</span>}
        </div>
        <div className="pt-4 flex items-baseline justify-between gap-3">
          <span className="font-display text-3xl leading-none" data-testid={`text-reference-${product.reference}`}>{product.reference}</span>
          <span className="text-xs text-muted-foreground text-right">{product.categories.join(' · ')}</span>
        </div>
        <p className="mt-2 text-[1rem] leading-snug group-hover:underline underline-offset-4 decoration-[hsl(var(--champagne))]">
          Inspiration <span className="italic font-display text-[1.15rem]">{product.referenceName}</span>
        </p>
        <p className="text-sm text-muted-foreground">{product.referenceBrand}</p>
      </button>
    </article>
  );
}
