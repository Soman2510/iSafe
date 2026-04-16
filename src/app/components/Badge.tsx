import { motion } from "motion/react";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  color?: "blue" | "green" | "yellow" | "pink" | "purple";
  glow?: boolean;
}

export function Badge({ children, icon, color = "blue", glow = false }: BadgeProps) {
  const colorClasses = {
    blue: "bg-[#4A90E2] border-[#3A7BC8]",
    green: "bg-[#A8E6CF] border-[#8DD4B0]",
    yellow: "bg-[#FFB84D] border-[#E5A23D]",
    pink: "bg-[#FF6B9D] border-[#E55B8D]",
    purple: "bg-[#C996FF] border-[#B886EF]",
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${colorClasses[color]} ${
        glow ? "shadow-lg shadow-current/50" : "shadow-md"
      } border-4 rounded-full px-4 py-2 text-white flex items-center gap-2 min-h-[40px]`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span>{children}</span>
    </motion.div>
  );
}
