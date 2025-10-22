import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>{children}</div>;
};
