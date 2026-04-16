import { motion } from "motion/react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "fun";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  className = "",
}: ButtonProps) {
  const baseClasses = "rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 border-4";

  const variantClasses = {
    primary: "bg-[#4A90E2] border-[#3A7BC8] text-white hover:bg-[#3A7BC8]",
    secondary: "bg-[#FFB84D] border-[#E5A23D] text-[#2C3E50] hover:bg-[#E5A23D]",
    success: "bg-[#A8E6CF] border-[#8DD4B0] text-[#2C3E50] hover:bg-[#8DD4B0]",
    warning: "bg-[#FF6B9D] border-[#E55B8D] text-white hover:bg-[#E55B8D]",
    danger: "bg-[#FF6B9D] border-[#E55B8D] text-white hover:bg-[#E55B8D]",
    fun: "bg-gradient-to-br from-[#C996FF] to-[#FF6B9D] border-[#B886EF] text-white hover:scale-105",
  };

  const sizeClasses = {
    sm: "px-6 py-3 min-h-[48px]",
    md: "px-8 py-4 min-h-[64px]",
    lg: "px-12 py-6 min-h-[80px]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}