import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, TrendingUp, Award, Calendar, Plus, X, CheckCircle, User } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { ProgressBar } from "./ProgressBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Navigation } from "./Navigation";

interface ParentDashboardProps {
  onNavigate: (page: string) => void;
}

interface Child {
  id: number;
  name: string;
  username: string;
  age: number;
  level: number;
  progress: number;
  quizzes: number;
  avatar: string;
}

const performanceData = [
  { name: "Mon", score: 75 },
  { name: "Tue", score: 80 },
  { name: "Wed", score: 90 },
  { name: "Thu", score: 85 },
  { name: "Fri", score: 95 },
];

const avatarOptions = ["👦", "👧", "🧒", "👶", "🧑", "👨", "👩", "🙂", "😊", "🌟"];

export function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const [children, setChildren] = useState<Child[]>([
    { id: 1, name: "Alex", username: "alex_cyber", age: 10, level: 5, progress: 65, quizzes: 12, avatar: "👦" },
    { id: 2, name: "Emma", username: "emma_safe", age: 8, level: 3, progress: 40, quizzes: 8, avatar: "👧" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    age: "",
    password: "",
    avatar: "👦"
  });

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    const newChild: Child = {
      id: children.length + 1,
      name: formData.name,
      username: formData.username,
      age: parseInt(formData.age),
      level: 1,
      progress: 0,
      quizzes: 0,
      avatar: formData.avatar
    };
    setChildren([...children, newChild]);
    setIsModalOpen(false);
    setShowSuccess(true);
    setFormData({ name: "", username: "", age: "", password: "", avatar: "👦" });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#E8F8F0]">
      <Navigation currentPage="parent-dashboard" onNavigate={onNavigate} userRole="parent" />
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-5xl mb-2 text-[#2C3E50]">Parent Dashboard</h1>
            <p className="text-xl text-[#6B7280]">Monitor your child's learning progress</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card color="blue" className="text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-12 h-12 text-[#4A90E2]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">{children.length} {children.length === 1 ? 'Child' : 'Children'}</h3>
            <p className="text-[#6B7280]">Registered accounts</p>
          </Card>

          <Card color="green" className="text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-12 h-12 text-[#A8E6CF]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">85%</h3>
            <p className="text-[#6B7280]">Average score</p>
          </Card>

          <Card color="yellow" className="text-center">
            <div className="flex justify-center mb-3">
              <Calendar className="w-12 h-12 text-[#FFB84D]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">7 Days</h3>
            <p className="text-[#6B7280]">Current streak</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card color="white">
            <h2 className="text-2xl mb-6 text-[#2C3E50]">My Children</h2>
            <div className="space-y-4 mb-6">
              {children.map((child) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card color="blue" hoverable>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
                        {child.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl mb-1 text-[#2C3E50]">{child.name}</h3>
                        <p className="text-sm text-[#6B7280] mb-2">
                          @{child.username} • Level {child.level} • {child.quizzes} quizzes completed
                        </p>
                        <ProgressBar progress={child.progress} color="#4A90E2" height="h-3" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            <Button
              size="md"
              variant="primary"
              icon={<Plus />}
              className="w-full"
              onClick={() => setIsModalOpen(true)}
            >
              Add Child
            </Button>
          </Card>

          <Card color="white">
            <h2 className="text-2xl mb-6 text-[#2C3E50]">Weekly Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis key="xaxis" dataKey="name" stroke="#6B7280" />
                <YAxis key="yaxis" stroke="#6B7280" />
                <Tooltip
                  key="tooltip"
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #4A90E2",
                    borderRadius: "12px",
                  }}
                />
                <Bar key="bar" dataKey="score" fill="#4A90E2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card color="purple">
          <div className="flex items-start gap-6">
            <div className="bg-gradient-to-br from-[#A8E6CF] to-[#8DD4B0] p-6 rounded-2xl">
              <Award className="w-16 h-16 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl mb-3 text-[#2C3E50]">Recent Achievements</h2>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border-2 border-[#A8E6CF]">
                  <p className="text-lg text-[#2C3E50]">
                    <span className="text-[#4A90E2]">Alex</span> earned the "Perfect Score" badge! 🏆
                  </p>
                  <p className="text-sm text-[#6B7280]">2 hours ago</p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-[#FFB84D]">
                  <p className="text-lg text-[#2C3E50]">
                    <span className="text-[#4A90E2]">Emma</span> completed "Phishing Basics" quiz! ⭐
                  </p>
                  <p className="text-sm text-[#6B7280]">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Child Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Add Child Account</h2>
                    <p className="text-blue-100 text-sm">Create a new learning account</p>
                  </div>
                </div>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddChild} className="p-6 space-y-5">
                {/* Child Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter child's name"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username / ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Choose a username"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <select
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Select age</option>
                    {[7, 8, 9, 10, 11, 12].map((age) => (
                      <option key={age} value={age}>
                        {age} years old
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Create a password"
                  />
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Avatar
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar })}
                        className={`w-full aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                          formData.avatar === avatar
                            ? "bg-blue-500 scale-110 shadow-lg"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  Add Child
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm text-green-100">Child added successfully!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
