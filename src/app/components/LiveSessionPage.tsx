import { motion } from "motion/react";
import { Users, Clock, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Navigation } from "./Navigation";

interface LiveSessionPageProps {
  onNavigate: (page: string) => void;
  sessionId?: string;
}

export function LiveSessionPage({ onNavigate, sessionId }: LiveSessionPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#E8F8F0]">
      <Navigation currentPage="live-session" onNavigate={onNavigate} userRole="student" />
      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate("student-dashboard")}
            icon={<ArrowLeft />}
          >
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-4xl text-[#2C3E50]">Live Session</h1>
            <p className="text-[#6B7280]">Session ID: {sessionId || "DEMO-1234"}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card color="blue" className="text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-12 h-12 text-[#4A90E2]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">24 Students</h3>
            <p className="text-[#6B7280]">Currently Online</p>
          </Card>

          <Card color="green" className="text-center">
            <div className="flex justify-center mb-3">
              <Clock className="w-12 h-12 text-[#A8E6CF]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">45:30</h3>
            <p className="text-[#6B7280]">Time Remaining</p>
          </Card>

          <Card color="yellow" className="text-center">
            <div className="flex justify-center mb-3">
              <Trophy className="w-12 h-12 text-[#FFB84D]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">Round 2</h3>
            <p className="text-[#6B7280]">of 5</p>
          </Card>
        </div>

        <Card color="white" className="mb-8">
          <h2 className="text-2xl mb-6 text-[#2C3E50]">Session Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#4A90E2] to-[#6BA3E8] rounded-lg text-white">
              <div>
                <h3 className="text-xl font-semibold">Current Challenge</h3>
                <p>Identify the phishing email from your inbox!</p>
              </div>
              <Badge color="white" className="text-[#4A90E2]">
                Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-[#2C3E50] mb-2">Your Progress</h4>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#4A90E2] h-3 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm text-[#6B7280]">75%</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-[#2C3E50] mb-2">Class Average</h4>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#A8E6CF] h-3 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-sm text-[#6B7280]">68%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card color="purple">
          <h2 className="text-2xl mb-4 text-[#2C3E50]">Live Leaderboard</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <span className="font-semibold text-[#2C3E50]">You</span>
              </div>
              <span className="font-bold text-yellow-600">1,250 pts</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <span className="text-[#2C3E50]">Sarah J.</span>
              </div>
              <span className="text-[#6B7280]">1,180 pts</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <span className="text-[#2C3E50]">Alex C.</span>
              </div>
              <span className="text-[#6B7280]">1,050 pts</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}