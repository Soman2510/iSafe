import { useState } from "react";
import { motion } from "motion/react";
import { User, Lock, Mail } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Mascot } from "./Mascot";

interface LoginPageProps {
  onNavigate: (page: string, role?: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<"student" | "parent" | "teacher">("student");

  const handleSubmit = () => {
    if (role === "student") {
      onNavigate("student-dashboard", role);
    } else if (role === "parent") {
      onNavigate("parent-dashboard", role);
    } else {
      onNavigate("teacher-dashboard", role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#FFE8F0] p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <Mascot size="md" />
          </div>
          <h1 className="text-4xl mb-2 text-[#2C3E50]">Welcome Back!</h1>
          <p className="text-lg text-[#6B7280]">Ready to continue your adventure?</p>
        </motion.div>

        <Card color="white" className="p-8">
          <div className="mb-6">
            <label className="block mb-3 text-[#2C3E50]">I am a:</label>
            <div className="grid grid-cols-3 gap-3">
              {(["student", "parent", "teacher"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-3 rounded-xl border-3 transition-all ${
                    role === r
                      ? "bg-[#4A90E2] text-white border-[#3A7BC8] shadow-lg"
                      : "bg-white text-[#2C3E50] border-[#4A90E2] hover:bg-[#E8F4F8]"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {isSignUp && (
            <div className="mb-4">
              <label className="block mb-2 text-[#2C3E50]">Name</label>
              <div className="flex items-center bg-white border-3 border-[#4A90E2] rounded-xl px-4 py-3">
                <User className="w-6 h-6 text-[#4A90E2] mr-3" />
                <input
                  type="text"
                  placeholder="Your name"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 text-[#2C3E50]">
              {role === "student" ? "Username" : "Email"}
            </label>
            <div className="flex items-center bg-white border-3 border-[#4A90E2] rounded-xl px-4 py-3">
              <Mail className="w-6 h-6 text-[#4A90E2] mr-3" />
              <input
                type={role === "student" ? "text" : "email"}
                placeholder={role === "student" ? "coolkid123" : "you@example.com"}
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-[#2C3E50]">Password</label>
            <div className="flex items-center bg-white border-3 border-[#4A90E2] rounded-xl px-4 py-3">
              <Lock className="w-6 h-6 text-[#4A90E2] mr-3" />
              <input
                type="password"
                placeholder="••••••••"
                className="flex-1 outline-none bg-transparent"
              />
            </div>
          </div>

          <Button size="lg" variant="primary" onClick={handleSubmit} className="w-full mb-4">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#4A90E2] hover:underline"
            >
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-4 text-center">
              <button
                onClick={() => onNavigate("forgot-password")}
                className="text-[#6B7280] hover:text-[#4A90E2] hover:underline text-sm"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <button onClick={() => onNavigate("landing")} className="text-[#6B7280] hover:underline">
              Back to Home
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
