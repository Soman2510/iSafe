import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { Navigation } from "./Navigation";
import { MaterialViewer } from "./MaterialViewer";

interface QuizInterfaceProps {
  onNavigate: (page: string, score?: number) => void;
  quiz?: {
    title: string;
    description: string;
    material?: {
      type: 'video' | 'pdf' | 'infographic' | 'interactive';
      url?: string;
      content?: string;
      fileName?: string;
      fileSize?: number;
    };
    questions: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }[];
  };
}

const quizQuestions = [
  {
    question: "Someone you don't know sends you a message asking for your password. What should you do?",
    options: [
      "Give them your password",
      "Ask your parents or teacher first",
      "Ignore it and tell an adult",
      "Reply with a fake password",
    ],
    correct: 2,
    explanation: "Never share your password with anyone! Always tell a trusted adult if someone asks for it.",
  },
  {
    question: "You receive an email saying you won a prize. What should you check first?",
    options: [
      "Click the link immediately",
      "Check if it's from a real company",
      "Share it with friends",
      "Download any attachments",
    ],
    correct: 1,
    explanation: "Always verify the sender before clicking links! Scammers often fake prize emails.",
  },
  {
    question: "What makes a strong password?",
    options: [
      "Your name and birthday",
      "123456",
      "A mix of letters, numbers, and symbols",
      "Your pet's name",
    ],
    correct: 2,
    explanation: "Strong passwords use a combination of letters, numbers, and symbols that are hard to guess!",
  },
];

export function QuizInterface({ onNavigate, quiz }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  // Use provided quiz or fallback to hardcoded quiz
  const currentQuiz = quiz || {
    title: "Cyber Security Quiz",
    description: "Test your knowledge of online safety",
    questions: quizQuestions
  };

  const question = currentQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === question.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onNavigate("results", score);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#FFE8F0]">
      <Navigation currentPage="quiz" onNavigate={onNavigate} userRole="student" />
      <div className="p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-3xl w-full">
        <div className="mb-6">
          <h1 className="text-3xl text-[#2C3E50] mb-2">{currentQuiz.title}</h1>
          <p className="text-lg text-[#6B7280]">{currentQuiz.description}</p>
        </div>

        {/* Display teaching material if available */}
        {currentQuiz.material && (
          <MaterialViewer material={currentQuiz.material} title={currentQuiz.title} />
        )}

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl text-[#2C3E50]">
              Question {currentQuestion + 1} of {currentQuiz.questions.length}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-lg text-[#2C3E50]">Score: {score}</span>
            </div>
          </div>
          <ProgressBar progress={progress} color="#4A90E2" height="h-4" showPercentage={false} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
          >
            <Card color="white" className="p-8 mb-6">
              <h1 className="text-3xl mb-8 text-[#2C3E50] leading-relaxed">{question.question}</h1>

              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                    whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback}
                    className={`w-full text-left p-6 rounded-2xl border-4 transition-all ${
                      showFeedback
                        ? index === question.correct
                          ? "bg-[#A8E6CF] border-[#52C41A] text-[#2C3E50]"
                          : index === selectedAnswer
                          ? "bg-[#FFE8F0] border-[#FF6B9D] text-[#2C3E50]"
                          : "bg-white border-[#E0E0E0] text-[#6B7280]"
                        : "bg-white border-[#4A90E2] text-[#2C3E50] hover:bg-[#E8F4F8]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{option}</span>
                      {showFeedback && index === question.correct && (
                        <CheckCircle className="w-8 h-8 text-[#52C41A]" />
                      )}
                      {showFeedback && index === selectedAnswer && index !== question.correct && (
                        <XCircle className="w-8 h-8 text-[#FF6B9D]" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>

            {showFeedback && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Card
                  color={selectedAnswer === question.correct ? "green" : "pink"}
                  className="p-6 mb-6"
                >
                  <div className="flex items-start gap-4">
                    {selectedAnswer === question.correct ? (
                      <CheckCircle className="w-12 h-12 text-[#52C41A] flex-shrink-0" />
                    ) : (
                      <XCircle className="w-12 h-12 text-[#FF6B9D] flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="text-2xl mb-2 text-[#2C3E50]">
                        {selectedAnswer === question.correct ? "Correct! 🎉" : "Not quite! 🤔"}
                      </h3>
                      <p className="text-lg text-[#2C3E50]">{question.explanation}</p>
                    </div>
                  </div>
                </Card>

                <Button
                  size="lg"
                  variant="primary"
                  onClick={handleNext}
                  className="w-full"
                  icon={<ArrowRight />}
                >
                  {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
