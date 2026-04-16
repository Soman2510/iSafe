import { motion } from "motion/react";
import { Shield, BookOpen, Trophy, Users } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Mascot } from "./Mascot";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#E8F8F0] p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <Mascot size="lg" />
          </div>
          <h1 className="text-6xl mb-4 text-[#2C3E50]">
            iSafe <span className="text-[#4A90E2]">Questzania</span>
          </h1>
          <p className="text-2xl text-[#6B7280] mb-8">
            Learn to stay safe online through fun games and quizzes!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="primary" onClick={() => onNavigate("login")}>
              Start Learning
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onNavigate("login")}>
              Sign Up Free
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: <Shield className="w-12 h-12" />,
              title: "Stay Safe",
              desc: "Learn about scams and phishing",
              color: "blue" as const,
            },
            {
              icon: <BookOpen className="w-12 h-12" />,
              title: "Fun Quizzes",
              desc: "Interactive learning games",
              color: "green" as const,
            },
            {
              icon: <Trophy className="w-12 h-12" />,
              title: "Earn Rewards",
              desc: "Collect badges and stars",
              color: "yellow" as const,
            },
            {
              icon: <Users className="w-12 h-12" />,
              title: "Track Progress",
              desc: "Parents can monitor learning",
              color: "pink" as const,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card color={feature.color} hoverable className="text-center h-full">
                <div className="flex justify-center mb-4 text-[#2C3E50]">{feature.icon}</div>
                <h3 className="mb-2 text-[#2C3E50]">{feature.title}</h3>
                <p className="text-[#6B7280]">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl border-4 border-[#4A90E2] shadow-2xl p-12 text-center"
        >
          <h2 className="text-4xl mb-4 text-[#2C3E50]">Join thousands of kids learning online safety!</h2>
          <p className="text-xl text-[#6B7280] mb-6">
            Make learning about cybersecurity fun and engaging
          </p>
          <Button size="lg" variant="fun" onClick={() => onNavigate("login")}>
            Get Started Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
