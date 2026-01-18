import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type ButtonVariant = 'solid' | 'outline' | 'solid-inverted' | 'outline-inverted' | 'primary';
type ButtonSize = 'sm' | 'md';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    href?: never;
  };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  solid:
    'bg-text text-background hover:bg-text/90 hover:shadow-lg hover:shadow-white/10',
  outline:
    'border border-border bg-surface text-text hover:bg-surface-elevated hover:border-primary/30',
  'solid-inverted':
    'bg-white text-primary hover:bg-white/90 hover:shadow-lg hover:shadow-white/20',
  'outline-inverted':
    'border border-white/50 bg-transparent text-white hover:bg-white/10 hover:border-white',
  primary:
    'bg-primary text-text hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  md: 'px-5 py-3',
};

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium font-title transition-all duration-300 hover:scale-[1.02] cursor-pointer';

export const Button = ({
  variant = 'solid',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (props.as === 'a') {
    const { as: _, ...linkProps } = props;
    return (
      <a className={combinedStyles} {...linkProps}>
        {children}
      </a>
    );
  }

  const { as: _, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={combinedStyles} {...buttonProps}>
      {children}
    </button>
  );
};

// Arrow icon commonly used in CTAs
export const ArrowIcon = () => (
  <svg
    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default Button;
