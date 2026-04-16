import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Save, Send, Hash, CheckCircle, X, Upload, FileText, Image, Play, Code } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Navigation } from "./Navigation";
import { GoogleFormsImport } from "./GoogleFormsImport";
import { Quiz } from "../App";
import { storeVideo, StoredVideo } from "../utils/videoStorage";

interface CreateQuizPageProps {
  onNavigate: (page: string) => void;
  onSaveQuiz: (quiz: Omit<Quiz, "id" | "completed" | "total" | "avg">) => void;
  editingQuiz?: Quiz;
  onCancel: () => void;
}

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

interface MaterialData {
  type: 'video' | 'pdf' | 'infographic' | 'interactive';
  url?: string;
  content?: string;
  fileName?: string;
  fileSize?: number;
  file?: File; // Add file reference for uploaded videos
}

export function CreateQuizPage({ onNavigate, onSaveQuiz, editingQuiz, onCancel }: CreateQuizPageProps) {
  const [quizTitle, setQuizTitle] = useState(editingQuiz?.title || "");
  const [quizDescription, setQuizDescription] = useState(editingQuiz?.description || "");
  const [material, setMaterial] = useState<MaterialData | null>(editingQuiz?.material || null);
  const [materialType, setMaterialType] = useState<'video' | 'pdf' | 'infographic' | 'interactive'>(editingQuiz?.material?.type || 'video');
  const [videoUrl, setVideoUrl] = useState(editingQuiz?.material?.url || "");
  const [interactiveContent, setInteractiveContent] = useState(editingQuiz?.material?.content || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(editingQuiz?.questions || [
    {
      id: 1,
      question: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [gamePin, setGamePin] = useState("");

  const addQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1,
      question: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: number, text: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question: text } : q))
    );
  };

  const updateAnswer = (questionId: number, answerIndex: number, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a, i) =>
                i === answerIndex ? { ...a, text } : a
              ),
            }
          : q
      )
    );
  };

  const setCorrectAnswer = (questionId: number, answerIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a, i) => ({
                ...a,
                isCorrect: i === answerIndex,
              })),
            }
          : q
      )
    );
  };

  const handleMaterialTypeChange = (type: 'video' | 'pdf' | 'infographic' | 'interactive') => {
    setMaterialType(type);
    setMaterial(null);
    setVideoUrl("");
    setInteractiveContent("");
    setUploadedFile(null);
    setUploadError("");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");

    try {
      // Client-side validation
      const maxSize = materialType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 100MB for videos, 10MB for others
      const allowedTypes = {
        pdf: ['application/pdf'],
        infographic: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/quicktime']
      };

      if (file.size > maxSize) {
        throw new Error(`File size must be less than ${materialType === 'video' ? '100MB' : '10MB'}`);
      }

      if (materialType === 'pdf' && !allowedTypes.pdf.includes(file.type)) {
        throw new Error("Please upload a valid PDF file");
      }

      if (materialType === 'infographic' && !allowedTypes.infographic.includes(file.type)) {
        throw new Error("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
      }

      if (materialType === 'video' && !allowedTypes.video.includes(file.type)) {
        throw new Error("Please upload a valid video file (MP4, WebM, OGG, AVI, MOV)");
      }

      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // For videos, we need to read the file for storage simulation
      if (materialType === 'video') {
        // This would normally be an actual upload, but we're simulating
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadedFile(file);

      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setMaterial({
        type: materialType,
        url,
        fileName: file.name,
        fileSize: file.size,
        file // Store file reference for videos
      });

      // Clear progress after a moment
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);

    } catch (error) {
      setUploadError(error.message);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    if (url.trim()) {
      setMaterial({
        type: 'video',
        url: url.trim()
      });
    } else {
      setMaterial(null);
    }
  };

  const handleInteractiveContentChange = (content: string) => {
    setInteractiveContent(content);
    if (content.trim()) {
      setMaterial({
        type: 'interactive',
        content: content.trim()
      });
    } else {
      setMaterial(null);
    }
  };

  const generateGamePin = () => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setGamePin(pin);
    setShowPinModal(true);
  };

  const handleSave = async () => {
    try {
      let processedMaterial = material;

      // Handle video file storage
      if (material?.type === 'video' && material.file && !material.url?.startsWith('blob:')) {
        const storedVideo = await storeVideo(material.file);
        processedMaterial = {
          ...material,
          url: `stored:${storedVideo.id}`, // Special URL format for stored videos
          file: undefined // Remove file reference after storage
        };
      }

      const quiz: Omit<Quiz, "id" | "completed" | "total" | "avg"> = {
        title: quizTitle,
        description: quizDescription,
        material: processedMaterial || undefined,
        questions: questions,
      };
      onSaveQuiz(quiz);
      alert("Quiz saved as draft!");
    } catch (error) {
      alert("Failed to save quiz: " + error.message);
    }
  };

  const handleImportQuiz = (importedQuiz: {
    title: string;
    description: string;
    questions: {
      id: number;
      question: string;
      answers: { text: string; isCorrect: boolean }[];
    }[];
  }) => {
    setQuizTitle(importedQuiz.title);
    setQuizDescription(importedQuiz.description);
    setQuestions(importedQuiz.questions);
    setMaterial(null);
    setMaterialType('video');
    setVideoUrl("");
    setInteractiveContent("");
    setUploadedFile(null);
    setUploadError("");
  };

  const handlePublish = async () => {
    try {
      let processedMaterial = material;

      // Handle video file storage
      if (material?.type === 'video' && material.file && !material.url?.startsWith('blob:')) {
        const storedVideo = await storeVideo(material.file);
        processedMaterial = {
          ...material,
          url: `stored:${storedVideo.id}`, // Special URL format for stored videos
          file: undefined // Remove file reference after storage
        };
      }

      const quiz: Omit<Quiz, "id" | "completed" | "total" | "avg"> = {
        title: quizTitle,
        description: quizDescription,
        material: processedMaterial || undefined,
        questions: questions,
      };
      onSaveQuiz(quiz);
      alert("Quiz published successfully!");
    } catch (error) {
      alert("Failed to publish quiz: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#E8F8F0]">
      <Navigation currentPage="create-quiz" onNavigate={onNavigate} userRole="teacher" />
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl text-[#2C3E50]">
              {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
            </h1>
            <p className="text-lg text-[#6B7280]">Design your cyber security quiz</p>
          </div>
          <div className="flex gap-3">
            <GoogleFormsImport onImportQuiz={handleImportQuiz} />
            <Button size="md" variant="secondary" onClick={handleSave} icon={<Save />}>
              Save Draft
            </Button>
            <Button size="md" variant="primary" onClick={handlePublish} icon={<Send />}>
              {editingQuiz ? "Update Quiz" : "Publish Quiz"}
            </Button>
          </div>
        </motion.div>

        {/* Quiz Details Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card color="white" className="mb-6">
            <h2 className="text-2xl text-[#2C3E50] mb-6">Quiz Details</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="e.g., Introduction to Password Security"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  rows={3}
                  placeholder="Briefly describe what students will learn from this quiz"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Teaching Material Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Card color="white" className="mb-6">
            <h2 className="text-2xl text-[#2C3E50] mb-6">Teaching Material (Optional)</h2>

            {/* Material Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Material Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { type: 'video' as const, label: 'Video', icon: Play, color: 'text-red-500' },
                  { type: 'pdf' as const, label: 'PDF Document', icon: FileText, color: 'text-blue-500' },
                  { type: 'infographic' as const, label: 'Infographic', icon: Image, color: 'text-green-500' },
                  { type: 'interactive' as const, label: 'Interactive', icon: Code, color: 'text-purple-500' }
                ].map(({ type, label, icon: Icon, color }) => (
                  <button
                    key={type}
                    onClick={() => handleMaterialTypeChange(type)}
                    className={`p-4 border-2 rounded-xl transition-all flex flex-col items-center gap-2 ${
                      materialType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${color}`} />
                    <span className="text-sm font-medium text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Preview */}
            {materialType === 'video' && material && material.url && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Video Preview</h3>
                <div className="bg-black rounded-xl overflow-hidden max-w-2xl">
                  <video
                    controls
                    className="w-full h-auto max-h-96"
                    src={material.url}
                    poster="/api/placeholder/640/360"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Preview of your video material. Students will see this when taking the quiz.
                </p>
              </div>
            )}

            {/* Material Content Input */}
            <div className="space-y-4">
              {materialType === 'video' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Video URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="https://example.com/video.mp4"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a direct link to your video file (MP4, WebM, etc.) or upload a file below
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Video File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="video-upload"
                        disabled={isUploading}
                      />
                      <label htmlFor="video-upload" className={`cursor-pointer ${isUploading ? 'pointer-events-none' : ''}`}>
                        {isUploading ? (
                          <>
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-lg text-gray-600 mb-2">Uploading video...</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500">{uploadProgress}%</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg text-gray-600 mb-2">
                              Click to upload video
                            </p>
                            <p className="text-sm text-gray-500">
                              Max file size: 100MB • Supported: MP4, WebM, OGG, AVI, MOV
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    {uploadError && (
                      <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                    )}
                    {uploadedFile && materialType === 'video' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm">
                          ✓ {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(materialType === 'pdf' || materialType === 'infographic') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload {materialType === 'pdf' ? 'PDF' : 'Image'} File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      accept={materialType === 'pdf' ? '.pdf' : 'image/*'}
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <label htmlFor="file-upload" className={`cursor-pointer ${isUploading ? 'pointer-events-none' : ''}`}>
                      {isUploading ? (
                        <>
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-lg text-gray-600 mb-2">Uploading {materialType}...</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500">{uploadProgress}%</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg text-gray-600 mb-2">
                            Click to upload {materialType === 'pdf' ? 'PDF' : 'image'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Max file size: 10MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  {uploadError && (
                    <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                  )}
                  {uploadedFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">
                        ✓ {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {materialType === 'interactive' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    HTML Content
                  </label>
                  <textarea
                    value={interactiveContent}
                    onChange={(e) => handleInteractiveContentChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none font-mono text-sm"
                    rows={8}
                    placeholder="<div><h1>Interactive Content</h1><p>Your HTML here...</p></div>"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter HTML content for interactive elements (safe HTML only)
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Questions Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card color="white" className="mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-[#2C3E50]">Questions</h2>
              <span className="text-lg text-[#6B7280]">
                {questions.length} {questions.length === 1 ? "question" : "questions"}
              </span>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIndex * 0.05 }}
                >
                  <Card color="blue" className="relative">
                    {/* Question Number Badge */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {qIndex + 1}
                    </div>

                    {/* Remove Button */}
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}

                    <div className="mt-2">
                      {/* Question Input */}
                      <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Question
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                          placeholder="Enter your question here"
                        />
                      </div>

                      {/* Answer Options */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Answer Options (select the correct one)
                        </label>
                        <div className="space-y-3">
                          {question.answers.map((answer, aIndex) => (
                            <div
                              key={aIndex}
                              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${
                                answer.isCorrect
                                  ? "bg-green-50 border-green-400"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={answer.isCorrect}
                                onChange={() => setCorrectAnswer(question.id, aIndex)}
                                className="w-5 h-5 cursor-pointer accent-green-500"
                              />
                              <input
                                type="text"
                                value={answer.text}
                                onChange={(e) =>
                                  updateAnswer(question.id, aIndex, e.target.value)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white"
                                placeholder={`Option ${aIndex + 1}`}
                              />
                              {answer.isCorrect && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Add Question Button */}
              <motion.button
                onClick={addQuestion}
                className="w-full py-4 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 font-semibold hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Plus className="w-5 h-5" />
                Add Another Question
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card color="white">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleSave}
                icon={<Save />}
                className="flex-1"
              >
                Save as Draft
              </Button>
              <Button
                size="lg"
                variant="primary"
                onClick={handlePublish}
                icon={<Send />}
                className="flex-1"
              >
                {editingQuiz ? "Update Quiz" : "Publish Quiz"}
              </Button>
              <Button
                size="lg"
                variant="success"
                onClick={generateGamePin}
                icon={<Hash />}
                className="flex-1"
              >
                Generate Game PIN
              </Button>
              <Button
                size="lg"
                variant="danger"
                onClick={onCancel}
                icon={<X />}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Game PIN Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Content */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-center">
                <Hash className="w-16 h-16 text-white mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Game PIN Generated!</h2>
                <p className="text-green-100">Share this PIN with your students</p>
              </div>

              <div className="p-8 text-center">
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 mb-6 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Game PIN</p>
                  <p className="text-6xl font-black text-transparent bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text tracking-wider">
                    {gamePin}
                  </p>
                </div>
                <p className="text-gray-600 mb-6">
                  Students can join using this PIN at the quiz start screen
                </p>
                <motion.button
                  onClick={() => setShowPinModal(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}