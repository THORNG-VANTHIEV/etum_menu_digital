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
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    brand: 'bg-amber-100 text-amber-900 border-amber-200',
    success: 'bg-emerald-100 text-emerald-900 border-emerald-200',
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

