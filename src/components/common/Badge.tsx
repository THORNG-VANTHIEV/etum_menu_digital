import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'neutral' | 'brand';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    neutral: 'bg-stone-100 dark:bg-palm-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-palm-800',
    brand: 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    success: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-stone-800 text-white border-stone-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

