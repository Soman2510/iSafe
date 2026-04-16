import { motion } from "motion/react";
import { Play, Book, Trophy, Target, Star, Award, Eye } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";
import { Mascot } from "./Mascot";
import { Navigation } from "./Navigation";
import { Quiz } from "../App";
import { GameSession } from "../App";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
  quizzes?: Quiz[];
  gameSessions?: GameSession[];
  onJoinSession?: (pin: string) => GameSession | null;
}

export function StudentDashboard({ onNavigate, quizzes = [], gameSessions = [], onJoinSession }: StudentDashboardProps) {
  const [gamePin, setGamePin] = useState("");
  const [pinError, setPinError] = useState("");

  const handleStartQuiz = (quiz: Quiz) => {
    // Store the selected quiz and navigate to quiz
    sessionStorage.setItem('selectedQuiz', JSON.stringify(quiz));
    onNavigate('quiz');
  };

  const validatePin = (pin: string): boolean => {
    // 4-6 digit numeric code
    const pinRegex = /^\d{4,6}$/;
    return pinRegex.test(pin);
  };

  const handleJoinSession = () => {
    if (!validatePin(gamePin)) {
      setPinError("Please enter a valid 4-6 digit PIN");
      return;
    }

    const session = onJoinSession?.(gamePin);
    if (session) {
      setPinError("");
      setGamePin("");
      onNavigate('live-session');
    } else {
      setPinError("Invalid or inactive session PIN");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#E8F8F0]">
      <Navigation currentPage="student-dashboard" onNavigate={onNavigate} userRole="student" />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-start mb-8">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-5xl mb-2 text-[#2C3E50]">
              Hi <span className="text-[#4A90E2]">Alex</span>! 👋
            </h1>
            <p className="text-xl text-[#6B7280]">Ready to become a cyber hero today?</p>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <Mascot size="sm" />
          </motion.div>
        </div>

        {/* Game PIN Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card color="purple" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#9B59B6] to-[#8E44AD] rounded-full -mr-16 -mt-16 opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#9B59B6] to-[#8E44AD] p-3 rounded-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-[#2C3E50]">Join Live Session</h2>
                  <p className="text-[#6B7280]">Enter your Game PIN to join an active session</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="game-pin" className="text-[#2C3E50] font-medium">
                    Game PIN
                  </Label>
                  <Input
                    id="game-pin"
                    type="text"
                    placeholder="Enter 4-6 digit PIN"
                    value={gamePin}
                    onChange={(e) => {
                      setGamePin(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setPinError("");
                    }}
                    className={`mt-1 ${pinError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    maxLength={6}
                  />
                  {pinError && (
                    <p className="text-red-500 text-sm mt-1">{pinError}</p>
                  )}
                </div>
                <Button
                  variant="primary"
                  onClick={handleJoinSession}
                  disabled={!gamePin || !!pinError}
                  className="px-8"
                >
                  Join Session
                </Button>
              </div>

              {gameSessions.filter(s => s.isActive).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-[#6B7280] mb-2">Active Sessions:</p>
                  <div className="flex flex-wrap gap-2">
                    {gameSessions.filter(s => s.isActive).map((session) => (
                      <Badge key={session.id} color="green" className="cursor-pointer hover:bg-green-200" onClick={() => setGamePin(session.pin)}>
                        {session.title} ({session.pin})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card color="blue" className="text-center">
            <div className="flex justify-center mb-3">
              <Target className="w-12 h-12 text-[#4A90E2]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">Level 5</h3>
            <p className="text-[#6B7280] mb-4">Cyber Scout</p>
            <ProgressBar progress={65} color="#4A90E2" height="h-6" />
            <p className="text-sm text-[#6B7280] mt-2">350/500 XP to Level 6</p>
          </Card>

          <Card color="yellow" className="text-center">
            <div className="flex justify-center mb-3">
              <Trophy className="w-12 h-12 text-[#FFB84D]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">8 Badges</h3>
            <p className="text-[#6B7280] mb-4">Total earned</p>
            <div className="flex justify-center gap-2">
              <Star className="w-8 h-8 text-[#FFB84D] fill-[#FFB84D]" />
              <Star className="w-8 h-8 text-[#FFB84D] fill-[#FFB84D]" />
              <Star className="w-8 h-8 text-[#FFB84D] fill-[#FFB84D]" />
            </div>
          </Card>

          <Card color="green" className="text-center">
            <div className="flex justify-center mb-3">
              <Award className="w-12 h-12 text-[#A8E6CF]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">12 Quizzes</h3>
            <p className="text-[#6B7280] mb-4">Completed</p>
            <p className="text-3xl text-[#2C3E50]">87%</p>
            <p className="text-sm text-[#6B7280]">Average Score</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card color="white" className="h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#4A90E2] to-[#6BA3E8] p-4 rounded-2xl">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl text-[#2C3E50]">Available Quizzes</h2>
                  <p className="text-[#6B7280]">Choose a quiz to start learning!</p>
                </div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {quizzes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No quizzes available yet</p>
                ) : (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#2C3E50]">{quiz.title}</h3>
                        <p className="text-sm text-[#6B7280]">{quiz.questions.length} questions</p>
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStartQuiz(quiz)}
                        icon={<Play />}
                      >
                        Start
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card color="white" className="h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#A8E6CF] to-[#8DD4B0] p-4 rounded-2xl">
                  <Book className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl text-[#2C3E50]">Learn More</h2>
                  <p className="text-[#6B7280]">Watch fun videos!</p>
                </div>
              </div>
              <Button size="lg" variant="success" onClick={() => onNavigate("learn-more")} className="w-full">
                Watch & Learn
              </Button>
            </Card>
          </motion.div>
        </div>

        <Card color="purple">
          <h2 className="text-2xl mb-4 text-[#2C3E50]">My Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge icon={<Trophy />} color="yellow" glow>
              Quiz Master
            </Badge>
            <Badge icon={<Star />} color="blue" glow>
              First Quiz
            </Badge>
            <Badge icon={<Award />} color="green" glow>
              Perfect Score
            </Badge>
            <Badge icon={<Target />} color="pink" glow>
              5 Day Streak
            </Badge>
            <Badge icon={<Trophy />} color="purple" glow>
              Phishing Expert
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}
