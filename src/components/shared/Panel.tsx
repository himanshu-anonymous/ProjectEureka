import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  accentColor?: 'navy' | 'saffron' | 'blue' | 'red' | 'none';
}

const accentClasses: Record<NonNullable<PanelProps['accentColor']>, string> = {
  navy: 'border-t-2 border-t-[var(--gov-primary)]',
  saffron: 'border-t-2 border-t-[var(--gov-accent)]',
  blue: 'border-t-2 border-t-[var(--gov-blue)]',
  red: 'border-t-2 border-t-[var(--status-danger)]',
  none: '',
};

export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  actions,
  accentColor = 'none',
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-surface border border-borderLine-standard rounded-lg shadow-sm flex flex-col overflow-hidden',
        accentClasses[accentColor],
        className
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="px-4 py-3 border-b border-borderLine-subtle bg-surface flex items-center justify-between min-h-[48px]">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-[var(--gov-primary)] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-content-muted mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4 flex-1">{children}</div>
    </div>
  );
};
