import { motion } from "motion/react";
import {
  Home,
  PlayCircle,
  BookOpen,
  Trophy,
  LogOut,
  Users,
  TrendingUp,
  FileText,
  BarChart3,
  Plus
} from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: "student" | "parent" | "teacher";
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  page: string;
}

export function Navigation({ currentPage, onNavigate, userRole }: NavigationProps) {
  const studentNav: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" />, page: "student-dashboard" },
    { id: "quiz", label: "Play Quiz", icon: <PlayCircle className="w-5 h-5" />, page: "quiz" },
    { id: "learn", label: "Learn More", icon: <BookOpen className="w-5 h-5" />, page: "learn-more" },
    { id: "scores", label: "My Scores", icon: <Trophy className="w-5 h-5" />, page: "results" },
  ];

  const parentNav: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" />, page: "parent-dashboard" },
  ];

  const teacherNav: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" />, page: "teacher-dashboard" },
    { id: "classes", label: "Class Management", icon: <Users className="w-5 h-5" />, page: "class-management" },
    { id: "create", label: "Create Quiz", icon: <Plus className="w-5 h-5" />, page: "create-quiz" },
  ];

  const navItems = userRole === "student" ? studentNav : userRole === "parent" ? parentNav : teacherNav;

  const gradientColors = {
    student: "from-purple-500 to-pink-500",
    parent: "from-blue-500 to-green-500",
    teacher: "from-blue-600 to-indigo-600",
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${gradientColors[userRole]} rounded-xl flex items-center justify-center shadow-lg`}>
              <span className="text-2xl">🛡️</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-800">iSafe Questzania</h1>
              <p className="text-xs text-gray-500 capitalize">{userRole} Portal</p>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item, index) => {
              const isActive = currentPage === item.page;
              return (
                <motion.button
                  key={item.id}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onNavigate(item.page)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${gradientColors[userRole]} text-white shadow-lg scale-105`
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                  whileHover={{ scale: isActive ? 1.05 : 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.button>
              );
            })}

            {/* Logout Button */}
            <motion.button
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: navItems.length * 0.05 }}
              onClick={() => onNavigate("landing")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all ml-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
