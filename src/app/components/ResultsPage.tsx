import { useEffect } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Trophy, RotateCcw, Home, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { StarRating } from "./StarRating";
import { Mascot } from "./Mascot";
import { Navigation } from "./Navigation";

interface ResultsPageProps {
  score: number;
  totalQuestions?: number;
  onNavigate: (page: string) => void;
}

export function ResultsPage({ score, totalQuestions = 3, onNavigate }: ResultsPageProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const stars = Math.ceil((score / totalQuestions) * 5);

  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4A90E2", "#FFB84D", "#A8E6CF", "#FF6B9D", "#C996FF"],
      });
    }
  }, [percentage]);

  const getMessage = () => {
    if (percentage === 100) return "Perfect Score! You're a Cyber Hero! 🦸";
    if (percentage >= 70) return "Awesome Job! Keep it up! 🎉";
    if (percentage >= 50) return "Good try! Practice makes perfect! 👍";
    return "Keep learning! You'll do better next time! 💪";
  };

  const getBadge = () => {
    if (percentage === 100) return { text: "Perfect Score!", color: "yellow" as const };
    if (percentage >= 70) return { text: "Great Job!", color: "green" as const };
    if (percentage >= 50) return { text: "Good Effort!", color: "blue" as const };
    return { text: "Keep Trying!", color: "pink" as const };
  };

  const badge = getBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#E8F8F0]">
      <Navigation currentPage="results" onNavigate={onNavigate} userRole="student" />
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <Mascot size="md" />
          </div>

          <h1 className="text-5xl mb-4 text-[#2C3E50]">{getMessage()}</h1>

          <Card color="white" className="p-12 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mb-8"
            >
              <div className="bg-gradient-to-br from-[#4A90E2] to-[#C996FF] rounded-full w-48 h-48 mx-auto flex items-center justify-center border-8 border-white shadow-2xl">
                <div className="text-center">
                  <div className="text-7xl text-white mb-2">{percentage}%</div>
                  <div className="text-xl text-white">Score</div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center mb-6">
              <StarRating earned={stars} />
            </div>

            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card color={badge.color} className="inline-flex items-center gap-3 px-8 py-4">
                  <Trophy className="w-10 h-10" />
                  <span className="text-2xl">{badge.text}</span>
                </Card>
              </motion.div>
            </div>

            <div className="text-xl text-[#6B7280] mb-2">
              You got <span className="text-[#4A90E2]">{score}</span> out of{" "}
              <span className="text-[#4A90E2]">{totalQuestions}</span> questions correct!
            </div>

            {percentage < 100 && (
              <p className="text-lg text-[#6B7280]">Try again to get a perfect score!</p>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              size="md"
              variant="secondary"
              onClick={() => onNavigate("quiz")}
              icon={<RotateCcw />}
            >
              Try Again
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={() => onNavigate("student-dashboard")}
              icon={<Home />}
            >
              Dashboard
            </Button>
            <Button
              size="md"
              variant="success"
              onClick={() => onNavigate("quiz")}
              icon={<ArrowRight />}
            >
              Next Quiz
            </Button>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
