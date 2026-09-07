import React from "react";

const variants = {
  primary:
    "bg-[#0B1C2D] text-white hover:bg-[#112A46] disabled:bg-[#CBD5E1] disabled:text-white",
  secondary:
    "bg-white text-[#0B1C2D] border border-[#E5E7EB] hover:bg-slate-50",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-2xl font-semibold transition-all disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
