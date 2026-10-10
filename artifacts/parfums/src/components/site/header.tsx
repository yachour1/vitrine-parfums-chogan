import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { ShopLink } from './shop-link';
import { useScrollProgress } from '@/lib/motion';

const NAV = [
  { href: '#collections', label: 'Collections' },
  { href: '#catalogue', label: 'Catalogue' },
  { href: '#commander', label: 'Comment commander' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progress = useScrollProgress();
  useEffect(() => setScrolled(progress > 0.01), [progress]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled ? 'bg-[hsl(var(--background)/0.88)] backdrop-blur-md border-b border-border/70' : 'bg-transparent'
      }`}
    >
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 bg-background px-3 py-2 z-50">
        Aller au contenu
      </a>
      <div className="mx-auto flex h-16 md:h-20 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="font-display text-2xl md:text-[1.7rem] min-h-[44px] flex items-center" data-testid="link-home">
          {SITE_CONFIG.title}
        </a>
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-9">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-[0.95rem] text-foreground/80 hover:text-foreground relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[hsl(var(--champagne))] after:transition-transform after:duration-300 hover:after:scale-x-100 py-3" data-testid={`link-nav-${n.href.slice(1)}`}>
              {n.label}
            </a>
          ))}
          <ShopLink variant="solid" testId="link-shop-header" className="text-sm px-5">Accéder à la boutique</ShopLink>
        </nav>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="md:hidden h-11 w-11 -mr-2 flex items-center justify-center" aria-label="Ouvrir le menu" data-testid="button-menu-open">
              <Menu className="h-6 w-6" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-[hsl(var(--ink)/0.3)] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-[86%] max-w-sm bg-background p-6 flex flex-col data-[state=open]:animate-in data-[state=open]:slide-in-from-right duration-300">
              <div className="flex items-center justify-between">
                <Dialog.Title className="font-display text-2xl">{SITE_CONFIG.title}</Dialog.Title>
                <Dialog.Close className="h-11 w-11 -mr-2 flex items-center justify-center" aria-label="Fermer le menu" data-testid="button-menu-close">
                  <X className="h-6 w-6" />
                </Dialog.Close>
              </div>
              <Dialog.Description className="sr-only">Navigation du site</Dialog.Description>
              <nav aria-label="Navigation mobile" className="mt-10 flex flex-col">
                {NAV.map((n) => (
                  <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display text-3xl py-4 border-b border-border" data-testid={`link-mobile-${n.href.slice(1)}`}>
                    {n.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto">
                <ShopLink testId="link-shop-mobile-menu" className="w-full">Accéder à la boutique</ShopLink>
                <p className="mt-3 text-sm text-muted-foreground">Vitrine indépendante — achats sur le site Chogan via un lien de parrainage.</p>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <div aria-hidden className="absolute bottom-0 left-0 h-px w-full origin-left bg-[hsl(var(--champagne))]" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}
