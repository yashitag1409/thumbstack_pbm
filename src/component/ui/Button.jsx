import React from "react";

export const Button = ({
  children,
  onClick,
  type = "button",
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none";

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  const variants = {
    primary: "bg-primary text-white hover:opacity-90 shadow-md hover:shadow-lg",

    secondary: "bg-secondary text-white hover:opacity-90",

    outline: "border border-card-border text-foreground hover:bg-card",

    ghost: "text-foreground hover:bg-card",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
