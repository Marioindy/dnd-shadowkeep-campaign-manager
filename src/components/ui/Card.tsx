import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * A styled container that renders `children` and becomes interactive when `onClick` is provided.
 *
 * @param children - Content to render inside the card
 * @param className - Additional CSS classes to append to the card container
 * @param onClick - Click handler; when present the card gains pointer and hover border styles
 * @returns A div element styled as a card containing `children`
 */
export function Card({ children, className, onClick }: CardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick) {
      if (event.key === 'Enter') {
        onClick();
      } else if (event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    }
  };

  return (
    <div
      className={clsx(
        'bg-gray-900 rounded-lg p-6 border border-gray-800',
        onClick && 'cursor-pointer hover:border-purple-500 transition-colors',
        className
      )}
      onClick={onClick}
      {...(onClick && {
        role: 'button',
        tabIndex: 0,
        onKeyDown: handleKeyDown
      })}
    >
      {children}
    </div>
  );
}

/**
 * Renders the header section of a Card with built-in bottom spacing.
 *
 * @param children - Header content to render inside the container
 * @param className - Optional additional CSS classes to apply to the header container
 * @returns A div element that wraps header content with a bottom margin
 */
export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
}

/**
 * Renders the card's title element with base typography and color styles.
 *
 * @param children - Content to display inside the title
 * @param className - Optional additional CSS classes to merge with the base styles
 * @returns An `h3` element styled as the card title
 */
export function CardTitle({ children, className }: CardProps) {
  return (
    <h3 className={clsx('text-xl font-semibold text-white', className)}>
      {children}
    </h3>
  );
}

/**
 * Renders the card's content area with muted text styling.
 *
 * @param children - Content to display inside the card body
 * @param className - Additional CSS classes to apply to the content container
 * @returns A JSX element representing the card content container
 */
export function CardContent({ children, className }: CardProps) {
  return (
    <div className={clsx('text-gray-300', className)}>
      {children}
    </div>
  );
}