import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  leftIcon?: ReactNode;
  loading?: boolean;
  rightIcon?: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#000000] text-white hover:bg-[#171717]',
  secondary:
    'border border-[#E5E5E5] bg-[#FDF8F8] text-[#0A0A0A] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#F7F2F2]',
};

export function Button({
  children,
  className = '',
  leftIcon,
  loading = false,
  rightIcon,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const { t } = useTranslation();
  const classeBase =
    'lafam-button inline-flex h-[40px] items-center justify-center gap-[8px] rounded-[12px] px-[16px] py-[8px] text-[14px] font-medium leading-[20px] transition-colors duration-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50';

  return (
    <button
      {...props}
      type={type}
      className={`${classeBase} ${variantClasses[variant]}${className ? ` ${className}` : ''}`}
    >
      {!loading ? leftIcon : null}
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {loading ? t('common.loadingLogin') : children}
      </span>
      {!loading ? rightIcon : null}
    </button>
  );
}
