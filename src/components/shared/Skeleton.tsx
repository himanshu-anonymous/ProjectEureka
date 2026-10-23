import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'dark' | 'amber';
  pulse?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'default',
  pulse = true,
  ...props
}) => {
  const variantClass =
    variant === 'dark'
      ? 'animate-shimmer-dark bg-slate-800'
      : variant === 'subtle'
      ? 'animate-shimmer-subtle bg-slate-100'
      : variant === 'amber'
      ? 'animate-shimmer-amber bg-amber-500'
      : 'animate-shimmer bg-slate-200/80';

  const pulseClass = pulse ? 'animate-pulse' : '';

  return (
    <div
      className={`rounded ${variantClass} ${pulseClass} ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={`bg-white border border-slate-200/90 rounded-xl shadow-sm overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const DarkHeaderSkeleton: React.FC<{
  titleWidth?: string;
  badgeWidth?: string;
  className?: string;
}> = ({ titleWidth = 'w-44', badgeWidth = 'w-20', className = '' }) => (
  <div
    className={`bg-slate-900 px-3.5 py-2.5 flex items-center justify-between select-none ${className}`}
  >
    <div className="flex items-center gap-2">
      <Skeleton variant="dark" className="w-4 h-4 rounded shrink-0" />
      <Skeleton variant="dark" className={`h-3.5 ${titleWidth} rounded`} />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton variant="dark" className={`h-3 ${badgeWidth} rounded`} />
      <Skeleton variant="dark" className="w-5 h-5 rounded-md" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{
  columns: number;
  className?: string;
}> = ({ columns = 8, className = '' }) => (
  <tr className={`border-b border-slate-100 ${className}`}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-3 px-3">
        <Skeleton
          className={`h-3.5 ${
            i === 0
              ? 'w-6'
              : i === 1
              ? 'w-24'
              : i === 2
              ? 'w-16'
              : i === columns - 1
              ? 'w-16 ml-auto'
              : 'w-12 mx-auto'
          }`}
        />
      </td>
    ))}
  </tr>
);
