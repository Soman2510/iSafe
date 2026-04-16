import { motion } from "motion/react";
import { Users, BookOpen, BarChart3, Plus, Edit, Trash2, Eye, Video, HardDrive } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Navigation } from "./Navigation";
import { Quiz } from "../App";
import { useState, useEffect } from "react";
import { getStoredVideos, getStorageInfo, deleteVideo, StoredVideo } from "../utils/videoStorage";

interface TeacherDashboardProps {
  onNavigate: (page: string) => void;
  quizzes: Quiz[];
  onEditQuiz: (id: string) => void;
  onDeleteQuiz: (id: string) => void;
}

export function TeacherDashboard({ onNavigate, quizzes, onEditQuiz, onDeleteQuiz }: TeacherDashboardProps) {
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);
  const [storedVideos, setStoredVideos] = useState<StoredVideo[]>([]);
  const [storageInfo, setStorageInfo] = useState<any>(null);

  useEffect(() => {
    // Load video storage information
    setStoredVideos(getStoredVideos());
    setStorageInfo(getStorageInfo());
  }, []);

  const handleDeleteVideo = (videoId: string, fileName: string) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      if (deleteVideo(videoId)) {
        setStoredVideos(getStoredVideos());
        setStorageInfo(getStorageInfo());
        alert("Video deleted successfully!");
      } else {
        alert("Failed to delete video.");
      }
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      onDeleteQuiz(id);
    }
  };

  const handlePreviewQuiz = (quiz: Quiz) => {
    // For preview, we'll navigate to quiz page with the quiz data
    // Since the current navigation doesn't support passing quiz data directly,
    // we'll store it temporarily and modify the QuizInterface to check for preview mode
    sessionStorage.setItem('previewQuiz', JSON.stringify(quiz));
    onNavigate('quiz-preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#E8F8F0]">
      <Navigation currentPage="teacher-dashboard" onNavigate={onNavigate} userRole="teacher" />
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-5xl mb-2 text-[#2C3E50]">Teacher Dashboard</h1>
            <p className="text-xl text-[#6B7280]">Manage quizzes and track student progress</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card color="blue" className="text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-12 h-12 text-[#4A90E2]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">24 Students</h3>
            <p className="text-[#6B7280]">Active learners</p>
          </Card>

          <Card color="green" className="text-center">
            <div className="flex justify-center mb-3">
              <BookOpen className="w-12 h-12 text-[#A8E6CF]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">{quizzes.length} Quizzes</h3>
            <p className="text-[#6B7280]">Created</p>
          </Card>

          <Card color="yellow" className="text-center">
            <div className="flex justify-center mb-3">
              <BarChart3 className="w-12 h-12 text-[#FFB84D]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">
              {quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + q.avg, 0) / quizzes.length) : 0}%
            </h3>
            <p className="text-[#6B7280]">Class average</p>
          </Card>
        </div>

        <Card color="white" className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl text-[#2C3E50]">Class Management</h2>
              <p className="text-[#6B7280]">Organize students and track class progress</p>
            </div>
            <Button size="md" variant="primary" icon={<Users />} onClick={() => onNavigate("class-management")}>
              Manage Classes
            </Button>
          </div>
        </Card>

        <Card color="white" className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl text-[#2C3E50]">Quiz Management</h2>
            <Button size="md" variant="primary" icon={<Plus />} onClick={() => onNavigate("create-quiz")}>
              Create New Quiz
            </Button>
          </div>

          <div className="space-y-4">
            {quizzes.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500 mb-2">No quizzes yet</p>
                <p className="text-gray-400">Create your first quiz to get started!</p>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <Card key={quiz.id} color="blue" hoverable>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl mb-2 text-[#2C3E50]">{quiz.title}</h3>
                      <div className="flex gap-6 text-sm text-[#6B7280]">
                        <span>{quiz.questions.length} questions</span>
                        <span>
                          {quiz.completed}/{quiz.total} completed
                        </span>
                        <span className="text-[#4A90E2]">{quiz.avg}% avg score</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handlePreviewQuiz(quiz)}
                        className="p-3 bg-[#A8E6CF] text-white rounded-xl hover:bg-[#8FD4B5] transition-colors"
                        title="Preview quiz"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onEditQuiz(quiz.id)}
                        className="p-3 bg-[#4A90E2] text-white rounded-xl hover:bg-[#3A7BC8] transition-colors"
                        title="Edit quiz"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(quiz.id, quiz.title)}
                        className="p-3 bg-[#FF6B9D] text-white rounded-xl hover:bg-[#E55B8D] transition-colors"
                        title="Delete quiz"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>

        {/* Video Management */}
        <Card color="white" className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl text-[#2C3E50]">Video Library</h2>
              <p className="text-[#6B7280]">Manage uploaded video materials</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Storage Used</p>
                <p className="text-lg font-semibold text-[#2C3E50]">
                  {storageInfo?.usagePercentage}% ({storageInfo?.totalSizeMB}MB / {storageInfo?.maxSizeMB}MB)
                </p>
              </div>
              <HardDrive className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="space-y-4">
            {storedVideos.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500 mb-2">No videos uploaded yet</p>
                <p className="text-gray-400">Upload videos when creating quizzes to see them here</p>
              </div>
            ) : (
              storedVideos.map((video) => (
                <Card key={video.id} color="blue" hoverable className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Video className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-lg text-[#2C3E50]">{video.fileName}</h3>
                        <div className="flex gap-4 text-sm text-[#6B7280]">
                          <span>{(video.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          <span>{video.mimeType}</span>
                          <span>{new Date(video.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteVideo(video.id, video.fileName)}
                        className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card color="green">
            <h2 className="text-2xl mb-6 text-[#2C3E50]">Top Performers</h2>
            <div className="space-y-4">
              {[
                { name: "Sarah Johnson", score: 98, quizzes: 8, rank: 1 },
                { name: "Alex Chen", score: 95, quizzes: 8, rank: 2 },
                { name: "Emma Wilson", score: 92, quizzes: 7, rank: 3 },
              ].map((student, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border-2 border-[#A8E6CF] flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FFB84D] to-[#E5A23D] rounded-full flex items-center justify-center text-white text-xl">
                    {student.rank}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-[#2C3E50]">{student.name}</h3>
                    <p className="text-sm text-[#6B7280]">
                      {student.score}% avg • {student.quizzes} quizzes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card color="yellow">
            <h2 className="text-2xl mb-6 text-[#2C3E50]">Recent Activity</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border-2 border-[#FFB84D]">
                <p className="text-lg text-[#2C3E50]">12 students completed "Phishing Basics"</p>
                <p className="text-sm text-[#6B7280]">2 hours ago</p>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-[#FFB84D]">
                <p className="text-lg text-[#2C3E50]">New quiz "Social Media Safety" created</p>
                <p className="text-sm text-[#6B7280]">1 day ago</p>
              </div>
              <div className="bg-white rounded-xl p-4 border-2 border-[#FFB84D]">
                <p className="text-lg text-[#2C3E50]">Class average improved to 82%</p>
                <p className="text-sm text-[#6B7280]">3 days ago</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}