import type { ComponentPropsWithoutRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'>;

const classeBaseInput =
  'lafam-input h-[36px] w-full rounded-[8px] border border-[#E5E5E5] bg-[#FDF8F8] bg-clip-padding px-[12px] py-[4px] text-[14px] text-[#0A0A0A] shadow-sm placeholder:text-[#737373] transition-[border-color,box-shadow] duration-200 focus:border-[#D4D4D4] focus:outline-none focus:ring-0 focus-visible:border-[#D4D4D4] focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50';

export function Input({
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      type={type}
      className={`${classeBaseInput}${className ? ` ${className}` : ''}`}
    />
  );
}
