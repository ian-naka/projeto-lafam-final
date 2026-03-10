import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
}

const Input: React.FC<InputProps> = ({ id, ...props }) => {
    return (
        <input 
            id={id}
            {...props}
            /* inputs quadrados */
            className="w-full px-[15px] py-[12px] text-[14px] text-[#333333] bg-white border border-[#e2e2e2] focus:border-[#a5002c] focus:outline-none transition-colors duration-200 placeholder:text-[#888888] rounded-none"
        />
    );
};

export default Input;
