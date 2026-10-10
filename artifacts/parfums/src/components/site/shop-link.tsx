import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  variant?: 'solid' | 'ghost' | 'light' | 'text';
  className?: string;
  testId: string;
};

const styles = {
  solid: 'bg-[hsl(var(--ink))] text-[hsl(var(--background))] hover:bg-[hsl(30_8%_22%)] px-6',
  ghost: 'border border-[hsl(var(--ink)/0.35)] text-foreground hover:border-[hsl(var(--champagne))] hover:bg-[hsl(var(--champagne)/0.08)] px-6',
  light: 'bg-[hsl(var(--background))] text-[hsl(var(--ink))] hover:bg-[hsl(var(--champagne-soft))] px-6',
  text: 'underline underline-offset-4 decoration-[hsl(var(--champagne))] hover:decoration-2 px-1',
};

export function ShopLink({ children, variant = 'solid', className, testId }: Props) {
  return (
    <a
      href={SITE_CONFIG.referralUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      data-testid={testId}
      className={cn(
        'inline-flex min-h-[44px] items-center justify-center gap-2 text-[0.95rem] tracking-wide transition-colors duration-300',
        styles[variant],
        className,
      )}
    >
      {children}
      <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0" />
      <span className="sr-only">(ouvre la boutique Chogan dans un nouvel onglet)</span>
    </a>
  );
}
