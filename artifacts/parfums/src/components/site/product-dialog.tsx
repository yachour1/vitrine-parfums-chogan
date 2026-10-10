import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { Product } from '@/lib/catalog';
import { collectionVisual, VISUAL_CAPTION } from '@/lib/catalog';
import { ShopLink } from './shop-link';
import { RefMark } from './product-card';

export function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const v = product ? collectionVisual(product) : null;
  return (
    <Dialog.Root open={!!product} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[hsl(var(--ink)/0.45)] backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 duration-300" />
        <Dialog.Content
          className="fixed z-50 inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[min(920px,92vw)] max-h-[92dvh] overflow-y-auto bg-background shadow-[0_30px_80px_-30px_hsl(30_20%_10%/0.5)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 duration-400"
          data-testid="dialog-product"
        >
          {product && (
            <div className="grid md:grid-cols-[1fr_1.1fr]">
              <div className="relative bg-[hsl(var(--blush)/0.55)] min-h-[240px] md:min-h-[520px] flex items-center justify-center p-8">
                {v ? (
                  <figure className="flex flex-col items-center">
                    <img src={v.src} alt={v.alt} className="max-h-[300px] md:max-h-[400px] w-auto object-contain" width={360} height={420} />
                    <figcaption className="mt-4 text-xs tracking-wide text-muted-foreground">{VISUAL_CAPTION}</figcaption>
                  </figure>
                ) : (
                  <RefMark code={product.reference} large />
                )}
              </div>
              <div className="p-7 md:p-12 flex flex-col">
                <Dialog.Close className="absolute right-3 top-3 h-11 w-11 flex items-center justify-center bg-background/80 hover:bg-secondary transition-colors" aria-label="Fermer la fiche" data-testid="button-dialog-close">
                  <X className="h-5 w-5" />
                </Dialog.Close>
                <p className="eyebrow text-[hsl(var(--champagne))]">Référence</p>
                <Dialog.Title className="font-display text-6xl md:text-7xl leading-none mt-2" data-testid="text-dialog-reference">
                  {product.reference}
                </Dialog.Title>
                <Dialog.Description className="mt-6 text-muted-foreground">
                  Référence d’inspiration citée dans la brochure :
                </Dialog.Description>
                <p className="font-display italic text-3xl mt-1" data-testid="text-dialog-name">{product.referenceName}</p>
                <p className="mt-1 text-foreground/80">{product.referenceBrand}</p>
                <dl className="mt-7 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[0.95rem] border-t border-border pt-5">
                  <dt className="text-muted-foreground">Catégorie</dt>
                  <dd>{product.categories.join(' · ') || '—'}</dd>
                  {product.families.length > 0 && (<><dt className="text-muted-foreground">Famille(s) / classement</dt><dd>{product.families.join(' · ')}</dd></>)}
                  <dt className="text-muted-foreground">Source du classement</dt>
                  <dd>{product.classificationSource || 'Brochure — non confirmé par le nouveau tableau'}</dd>
                  {product.collection && (<><dt className="text-muted-foreground">Collection</dt><dd>{product.collection}</dd></>)}
                  <dt className="text-muted-foreground">Prix</dt>
                  <dd>Voir le prix sur la boutique</dd>
                </dl>
                <div className="mt-8">
                  <ShopLink testId="link-shop-dialog" className="w-full md:w-auto">Commander sur Chogan</ShopLink>
                  <p className="mt-3 text-[0.95rem]">
                    Sur la boutique, recherchez la référence <strong className="font-semibold">{product.reference}</strong>.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Le lien ouvre la page d’accueil de la boutique via un lien de parrainage, et non directement ce produit. Les marques citées sont des références d’inspiration, sans affiliation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
