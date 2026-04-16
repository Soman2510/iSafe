import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Mascot } from "./Mascot";
import { Alert, AlertDescription } from "./ui/alert";

interface ResetPasswordPageProps {
  onNavigate: (page: string, data?: any) => void;
  resetData?: { email: string; token: string };
}

export function ResetPasswordPage({ onNavigate, resetData }: ResetPasswordPageProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Simulate token validation
    if (!resetData?.token) {
      setTokenValid(false);
      setError("Invalid or expired reset link. Please request a new password reset.");
    }
  }, [resetData]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // In a real app, this would update the password
      setTimeout(() => {
        onNavigate("login");
      }, 2000);
    }, 1500);
  };

  if (!tokenValid) {
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
            <h1 className="text-4xl mb-2 text-[#2C3E50]">Invalid Link</h1>
            <p className="text-lg text-[#6B7280]">
              This password reset link is invalid or has expired.
            </p>
          </motion.div>

          <Card color="white" className="p-8 text-center">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                Please request a new password reset link from the login page.
              </AlertDescription>
            </Alert>

            <Button
              variant="primary"
              onClick={() => onNavigate("forgot-password")}
              className="w-full mb-4"
            >
              Request New Reset Link
            </Button>

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

  if (isSuccess) {
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
            <h1 className="text-4xl mb-2 text-[#2C3E50]">Password Reset!</h1>
            <p className="text-lg text-[#6B7280]">
              Your password has been successfully updated.
            </p>
          </motion.div>

          <Card color="white" className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-[#A8E6CF] mx-auto mb-4" />
            <p className="text-[#6B7280] mb-6">
              You can now log in with your new password.
            </p>
            <Button
              variant="primary"
              onClick={() => onNavigate("login")}
              className="w-full"
            >
              Continue to Login
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
          <h1 className="text-4xl mb-2 text-[#2C3E50]">Reset Password</h1>
          <p className="text-lg text-[#6B7280]">
            Enter your new password below.
          </p>
        </motion.div>

        <Card color="white" className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-[#2C3E50]">New Password</label>
              <div className="flex items-center bg-white border-3 border-[#4A90E2] rounded-xl px-4 py-3">
                <Lock className="w-6 h-6 text-[#4A90E2] mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 outline-none bg-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-[#4A90E2] hover:text-[#3A7BC8]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-[#2C3E50]">Confirm New Password</label>
              <div className="flex items-center bg-white border-3 border-[#4A90E2] rounded-xl px-4 py-3">
                <Lock className="w-6 h-6 text-[#4A90E2] mr-3" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 outline-none bg-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-[#4A90E2] hover:text-[#3A7BC8]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
              {isLoading ? "Updating..." : "Update Password"}
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