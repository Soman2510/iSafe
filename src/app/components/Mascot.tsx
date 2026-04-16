import { motion } from "motion/react";
import { Shield, Sparkles } from "lucide-react";

interface MascotProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function Mascot({ size = "md", animate = true }: MascotProps) {
  const sizes = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
  };

  return (
    <motion.div
      animate={
        animate
          ? {
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }
          : {}
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className={`${sizes[size]} relative flex items-center justify-center`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2] to-[#C996FF] rounded-full opacity-20 blur-xl" />
      <div className="relative bg-gradient-to-br from-[#4A90E2] to-[#6BA3E8] rounded-full border-4 border-white shadow-2xl w-full h-full flex items-center justify-center">
        <Shield className="w-3/5 h-3/5 text-white" strokeWidth={3} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-8 h-8 text-[#FFB84D]" fill="#FFB84D" />
        </motion.div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border-2 border-[#4A90E2] shadow-md">
          <span className="text-xs text-[#4A90E2]">iSafe Questzania</span>
        </div>
      </div>
    </motion.div>
  );
}
