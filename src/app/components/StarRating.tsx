import { motion } from "motion/react";
import { Star } from "lucide-react";

interface StarRatingProps {
  total?: number;
  earned: number;
}

export function StarRating({ total = 5, earned }: StarRatingProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Star
            className={`w-10 h-10 ${
              i < earned ? "text-[#FFB84D] fill-[#FFB84D]" : "text-gray-300 fill-gray-300"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}
