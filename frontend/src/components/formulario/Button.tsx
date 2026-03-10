import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button 
            {...props}
            className="bg-[#181818] hover:bg-[#333333] text-white text-[13px] font-bold uppercase tracking-widest py-[14px] w-full mt-2 transition-colors duration-200 rounded-none"
        >
            {children}
        </button>
    );
};

export default Button;
