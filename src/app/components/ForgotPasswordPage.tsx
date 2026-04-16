import { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Mascot } from "./Mascot";
import { Alert, AlertDescription } from "./ui/alert";

interface ForgotPasswordPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // In a real app, this would send the reset email
      // For now, we'll simulate success and navigate to reset page with a token
      const resetToken = "demo-reset-token-" + Date.now();
      setTimeout(() => {
        onNavigate("reset-password", { email, token: resetToken });
      }, 2000);
    }, 1500);
  };

  if (isSubmitted) {
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
            <h1 className="text-4xl mb-2 text-[#2C3E50]">Check Your Email!</h1>
            <p className="text-lg text-[#6B7280]">
              We've sent a password reset link to {email}
            </p>
          </motion.div>

          <Card color="white" className="p-8 text-center">
            <Mail className="w-16 h-16 text-[#4A90E2] mx-auto mb-4" />
            <p className="text-[#6B7280] mb-6">
              Click the link in the email to reset your password. The link will expire in 24 hours.
            </p>
            <Button
              variant="secondary"
              onClick={() => onNavigate("login")}
              className="w-full"
            >
              Back to Login
            </Button>
          </Card>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl mb-2 text-[#2C3E50]">Forgot Password?</h1>
          <p className="text-lg text-[#6B7280]">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </motion.div>

        <Card color="white" className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 text-[#2C3E50]">Email Address</label>
              <div className="flex items-center bg-white border-3 border-[#4A90E2] rounded-xl px-4 py-3">
                <Mail className="w-6 h-6 text-[#4A90E2] mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 outline-none bg-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              size="lg"
              variant="primary"
              type="submit"
              className="w-full mb-4"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="text-[#4A90E2] hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}