import { motion } from "motion/react";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  color?: "blue" | "green" | "yellow" | "pink" | "purple" | "white";
  hoverable?: boolean;
}

export function Card({ children, className = "", color = "white", hoverable = false }: CardProps) {
  const colorClasses = {
    blue: "bg-[#D1E7FF] border-[#4A90E2]",
    green: "bg-[#E8F8F0] border-[#A8E6CF]",
    yellow: "bg-[#FFF4E0] border-[#FFB84D]",
    pink: "bg-[#FFE8F0] border-[#FF6B9D]",
    purple: "bg-[#F4E8FF] border-[#C996FF]",
    white: "bg-white border-[#4A90E2]",
  };

  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02, y: -4 } : {}}
      className={`${colorClasses[color]} border-4 rounded-3xl shadow-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
