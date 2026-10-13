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
}

export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  actions,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-surface border border-borderLine-standard rounded-md flex flex-col',
        className
      )}
      {...props}
    >
      {(title || actions) && (
        <div className="px-4 py-3 border-b border-borderLine-subtle flex items-center justify-between min-h-[48px]">
          <div>
            {title && <h3 className="text-sm font-semibold text-content-primary">{title}</h3>}
            {subtitle && <p className="text-xs text-content-muted">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4 flex-1">{children}</div>
    </div>
  );
};
