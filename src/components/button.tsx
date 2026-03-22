import type { ButtonHTMLAttributes } from "react";

export const Button = ({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button className={`${className}`} {...props}>
    {children}
  </button>
}