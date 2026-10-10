import rawProducts from '@/data/products.json';

export type Product = {
  reference: string;
  referenceName: string;
  referenceBrand: string;
  categories: string[];
  families: string[];
  collection: string | null;
  image: string | null;
  sourcePages: number[];
  verificationStatus: string;
};

export const LUXE = 'Luxe / Luxury';
export const CATEGORIES = ['Pour elle', 'Pour lui', 'Mixte'] as const;
export const FAMILIES = ['Floraux', 'Parfums d’été', 'Hespéridés', 'Boisés', 'Orientaux ambrés'] as const;

export const products: Product[] = (rawProducts as unknown as Product[]).filter(
  (p) => p && p.verificationStatus === 'verified',
);

export function normalize(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, ' ').trim();
}

export function matches(p: Product, q: string) {
  const n = normalize(q);
  if (!n) return true;
  const hay = normalize(`${p.reference} ${p.referenceName} ${p.referenceBrand}`);
  return n.split(/\s+/).every((t) => hay.includes(t));
}

/** Only an explicit, confirmed per-product photo. No collection fallback. */
export function collectionVisual(p: Product): { src: string; alt: string } | null {
  if (p.image) return { src: p.image, alt: `Photo de la référence ${p.reference}` };
  return null;
}

export const VISUAL_CAPTION = 'Photo non contractuelle';
