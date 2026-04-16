import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { QuizInterface } from "./components/QuizInterface";
import { ResultsPage } from "./components/ResultsPage";
import { ParentDashboard } from "./components/ParentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { LearnMorePage } from "./components/LearnMorePage";
import { CreateQuizPage } from "./components/CreateQuizPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { ClassManagementPage } from "./components/ClassManagementPage";
import { LiveSessionPage } from "./components/LiveSessionPage";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  material?: {
    type: 'video' | 'pdf' | 'infographic' | 'interactive';
    url?: string;
    content?: string;
    fileName?: string;
    fileSize?: number;
    file?: File;
  };
  questions: {
    id: number;
    question: string;
    answers: { text: string; isCorrect: boolean }[];
  }[];
  completed: number;
  total: number;
  avg: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  quizzesCompleted: number;
  averageScore: number;
  lastActive: string;
}

export interface GameSession {
  id: string;
  pin: string;
  title: string;
  teacherId: string;
  classId: string;
  isActive: boolean;
  startTime: string;
  duration: number; // in minutes
  participants: string[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [quizScore, setQuizScore] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("student");
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [resetData, setResetData] = useState<{ email: string; token: string } | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Introduction to Phishing",
      description: "Learn how to identify and avoid phishing attempts",
      material: {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      questions: [
        {
          id: 1,
          question: "What is phishing?",
          answers: [
            { text: "A type of email attack", isCorrect: true },
            { text: "A fishing technique", isCorrect: false },
            { text: "A computer game", isCorrect: false },
            { text: "A social media platform", isCorrect: false },
          ],
        },
      ],
      completed: 18,
      total: 24,
      avg: 85,
    },
    {
      id: "2",
      title: "Password Safety Basics",
      description: "Understanding strong password creation and management",
      material: {
        type: 'infographic',
        url: '/sample-infographic.png',
        fileName: 'password-safety-infographic.png',
        fileSize: 2048576
      },
      questions: [
        {
          id: 1,
          question: "What makes a password strong?",
          answers: [
            { text: "Using your name", isCorrect: false },
            { text: "12+ characters with mixed types", isCorrect: true },
            { text: "Simple words", isCorrect: false },
            { text: "Your birthday", isCorrect: false },
          ],
        },
      ],
      completed: 22,
      total: 24,
      avg: 90,
    },
    {
      id: "3",
      title: "Spotting Malicious Links",
      description: "Identify dangerous links and URLs",
      material: {
        type: 'interactive',
        content: '<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;"><h2>Interactive Link Safety Quiz</h2><p>Click on the suspicious links below:</p><button style="background: red; color: white; border: none; padding: 10px; margin: 5px; border-radius: 5px;">http://fake-bank-login.com</button><button style="background: green; color: white; border: none; padding: 10px; margin: 5px; border-radius: 5px;">https://secure-bank.com</button></div>'
      },
      questions: [
        {
          id: 1,
          question: "How can you spot a malicious link?",
          answers: [
            { text: "Check the URL carefully", isCorrect: true },
            { text: "Click it to find out", isCorrect: false },
            { text: "Links are always safe", isCorrect: false },
            { text: "Only check the text", isCorrect: false },
          ],
        },
      ],
      completed: 15,
      total: 24,
      avg: 78,
    },
  ]);

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@school.edu",
      level: 5,
      xp: 1250,
      quizzesCompleted: 8,
      averageScore: 92,
      lastActive: "2024-01-15",
    },
    {
      id: "2",
      name: "Alex Chen",
      email: "alex.chen@school.edu",
      level: 4,
      xp: 980,
      quizzesCompleted: 6,
      averageScore: 88,
      lastActive: "2024-01-14",
    },
    {
      id: "3",
      name: "Emma Wilson",
      email: "emma.wilson@school.edu",
      level: 3,
      xp: 750,
      quizzesCompleted: 5,
      averageScore: 85,
      lastActive: "2024-01-13",
    },
    {
      id: "4",
      name: "Michael Brown",
      email: "michael.brown@school.edu",
      level: 6,
      xp: 1450,
      quizzesCompleted: 10,
      averageScore: 95,
      lastActive: "2024-01-15",
    },
    {
      id: "5",
      name: "Olivia Davis",
      email: "olivia.davis@school.edu",
      level: 2,
      xp: 320,
      quizzesCompleted: 3,
      averageScore: 78,
      lastActive: "2024-01-12",
    },
  ]);

  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1",
      name: "Cyber Security 101",
      description: "Introduction to online safety and cyber security basics",
      teacherId: "teacher1",
      studentIds: ["1", "2", "3"],
      createdAt: "2024-01-01",
      totalQuizzes: 3,
      averageClassScore: 88,
    },
    {
      id: "2",
      name: "Advanced Digital Literacy",
      description: "Advanced topics in digital safety and privacy",
      teacherId: "teacher1",
      studentIds: ["4", "5"],
      createdAt: "2024-01-05",
      totalQuizzes: 2,
      averageClassScore: 86,
    },
  ]);

  const [gameSessions, setGameSessions] = useState<GameSession[]>([
    {
      id: "session1",
      pin: "1234",
      title: "Phishing Awareness Challenge",
      teacherId: "teacher1",
      classId: "1",
      isActive: true,
      startTime: new Date().toISOString(),
      duration: 60,
      participants: ["1", "2", "3"],
    },
    {
      id: "session2",
      pin: "5678",
      title: "Password Security Live Quiz",
      teacherId: "teacher1",
      classId: "2",
      isActive: true,
      startTime: new Date().toISOString(),
      duration: 45,
      participants: ["4", "5"],
    },
  ]);

  const handleNavigate = (page: string, data?: string | number | { email: string; token: string }) => {
    if (typeof data === "number") {
      setQuizScore(data);
    }
    if (typeof data === "string") {
      setUserRole(data);
    }
    if (data && typeof data === "object" && "email" in data && "token" in data) {
      setResetData(data);
    }

    if (page === "quiz-preview") {
      const storedQuiz = sessionStorage.getItem('previewQuiz');
      if (storedQuiz) {
        setPreviewQuiz(JSON.parse(storedQuiz));
      }
    }

    setCurrentPage(page);
  };

  const addOrUpdateQuiz = (quiz: Omit<Quiz, "id" | "completed" | "total" | "avg">) => {
    if (editingQuizId) {
      // Update existing quiz
      setQuizzes(quizzes.map(q => 
        q.id === editingQuizId 
          ? { ...q, ...quiz }
          : q
      ));
      setEditingQuizId(null);
    } else {
      // Add new quiz
      const newQuiz: Quiz = {
        ...quiz,
        id: Date.now().toString(),
        completed: 0,
        total: 24,
        avg: 0,
      };
      setQuizzes([...quizzes, newQuiz]);
    }
    setCurrentPage("teacher-dashboard");
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
  };

  const startEditQuiz = (id: string) => {
    setEditingQuizId(id);
    setCurrentPage("create-quiz");
  };

  const cancelEdit = () => {
    setEditingQuizId(null);
    setCurrentPage("teacher-dashboard");
  };

  const createClass = (classData: Omit<Class, "id" | "createdAt" | "totalQuizzes" | "averageClassScore">) => {
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      totalQuizzes: 0,
      averageClassScore: 0,
    };
    setClasses([...classes, newClass]);
  };

  const editClass = (id: string, classData: Partial<Class>) => {
    setClasses(classes.map(c => c.id === id ? { ...c, ...classData } : c));
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const assignStudentsToClass = (classId: string, studentIds: string[]) => {
    setClasses(classes.map(c =>
      c.id === classId
        ? { ...c, studentIds }
        : c
    ));
  };

  const joinGameSession = (pin: string): GameSession | null => {
    const session = gameSessions.find(s => s.pin === pin && s.isActive);
    if (session) {
      // Add current student to participants if not already there
      // For demo purposes, we'll assume student ID "1" (Alex)
      if (!session.participants.includes("1")) {
        setGameSessions(sessions =>
          sessions.map(s =>
            s.id === session.id
              ? { ...s, participants: [...s.participants, "1"] }
              : s
          )
        );
      }
      return session;
    }
    return null;
  };

  return (
    <div className="size-full overflow-auto">
      {currentPage === "live-session" && <LiveSessionPage onNavigate={handleNavigate} />}
      {currentPage === "landing" && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === "login" && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === "student-dashboard" && <StudentDashboard onNavigate={handleNavigate} quizzes={quizzes} gameSessions={gameSessions} onJoinSession={joinGameSession} />}
      {currentPage === "quiz" && (
        <QuizInterface 
          onNavigate={handleNavigate}
          quiz={(() => {
            const storedQuiz = sessionStorage.getItem('selectedQuiz');
            if (storedQuiz) {
              const quiz = JSON.parse(storedQuiz);
              return {
                title: quiz.title,
                description: quiz.description,
                material: quiz.material,
                questions: quiz.questions.map((q: any) => ({
                  question: q.question,
                  options: q.answers.map((a: any) => a.text),
                  correct: q.answers.findIndex((a: any) => a.isCorrect),
                  explanation: "Great job! Keep learning about online safety."
                }))
              };
            }
            return undefined;
          })()}
        />
      )}
      {currentPage === "quiz-preview" && previewQuiz && (
        <QuizInterface 
          onNavigate={(page, score) => {
            if (page === "results") {
              // For preview, just go back to teacher dashboard
              setCurrentPage("teacher-dashboard");
              setPreviewQuiz(null);
              sessionStorage.removeItem('previewQuiz');
            } else {
              handleNavigate(page, score);
            }
          }}
          quiz={{
            title: previewQuiz.title,
            description: previewQuiz.description,
            material: previewQuiz.material,
            questions: previewQuiz.questions.map(q => ({
              question: q.question,
              options: q.answers.map(a => a.text),
              correct: q.answers.findIndex(a => a.isCorrect),
              explanation: "Preview mode - no explanation available"
            }))
          }}
        />
      )}
      {currentPage === "results" && <ResultsPage score={quizScore} onNavigate={handleNavigate} />}
      {currentPage === "parent-dashboard" && <ParentDashboard onNavigate={handleNavigate} />}
      {currentPage === "teacher-dashboard" && (
        <TeacherDashboard 
          onNavigate={handleNavigate} 
          quizzes={quizzes}
          onEditQuiz={startEditQuiz}
          onDeleteQuiz={deleteQuiz}
        />
      )}
      {currentPage === "learn-more" && <LearnMorePage onNavigate={handleNavigate} />}
      {currentPage === "class-management" && (
        <ClassManagementPage
          onNavigate={handleNavigate}
          classes={classes}
          students={students}
          onCreateClass={createClass}
          onEditClass={editClass}
          onDeleteClass={deleteClass}
          onAssignStudents={assignStudentsToClass}
        />
      )}
      {currentPage === "create-quiz" && (
        <CreateQuizPage
          onNavigate={handleNavigate}
          onSaveQuiz={addOrUpdateQuiz}
          editingQuiz={editingQuizId ? quizzes.find(q => q.id === editingQuizId) : undefined}
          onCancel={cancelEdit}
        />
      )}
      {currentPage === "forgot-password" && <ForgotPasswordPage onNavigate={handleNavigate} />}
      {currentPage === "reset-password" && <ResetPasswordPage onNavigate={handleNavigate} resetData={resetData} />}
    </div>
  );
}