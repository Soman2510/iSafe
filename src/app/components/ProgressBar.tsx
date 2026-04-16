import { motion } from "motion/react";

interface ProgressBarProps {
  progress: number;
  color?: string;
  showPercentage?: boolean;
  height?: string;
}

export function ProgressBar({
  progress,
  color = "#4A90E2",
  showPercentage = true,
  height = "h-8",
}: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className={`bg-white border-4 border-[#4A90E2] rounded-full overflow-hidden ${height} relative`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-[#2C3E50] drop-shadow-sm">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
