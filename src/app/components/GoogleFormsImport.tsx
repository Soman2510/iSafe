import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, AlertCircle, CheckCircle, Loader2, X, ExternalLink } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";

interface GoogleFormsImportProps {
  onImportQuiz: (quiz: {
    title: string;
    description: string;
    questions: {
      id: number;
      question: string;
      answers: { text: string; isCorrect: boolean }[];
    }[];
  }) => void;
}

interface ImportProgress {
  step: 'idle' | 'validating' | 'parsing' | 'mapping' | 'complete' | 'error';
  message: string;
  progress: number;
}

export function GoogleFormsImport({ onImportQuiz }: GoogleFormsImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [googleFormsUrl, setGoogleFormsUrl] = useState("");
  const [progress, setProgress] = useState<ImportProgress>({
    step: 'idle',
    message: '',
    progress: 0
  });
  const [error, setError] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);

  const validateGoogleFormsUrl = (url: string): boolean => {
    // More flexible validation for Google Forms URLs (handles both old and new formats)
    const googleFormsRegex = /^https:\/\/docs\.google\.com\/forms\/d\/(?:e\/)?[a-zA-Z0-9_-]+(?:\/(?:viewform|edit))?\/?(\?.*)?$/;
    return googleFormsRegex.test(url.trim());
  };

  const simulateImportProcess = async () => {
    setIsImporting(true);
    setError("");
    setProgress({ step: 'validating', message: 'Validating Google Forms URL...', progress: 10 });

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!validateGoogleFormsUrl(googleFormsUrl)) {
      setError("Invalid Google Forms URL. Please provide a valid Google Forms link. Examples:\n• https://docs.google.com/forms/d/1ABC123/viewform\n• https://docs.google.com/forms/d/e/1FAIpQLSdDbRWHlqhwXBYT7ocsxySR8plv-qVb_9qc4p3_VLqfTjmVig/viewform\n• https://docs.google.com/forms/d/1ABC123/edit\n• https://docs.google.com/forms/d/1ABC123/viewform?usp=sharing");
      setProgress({ step: 'error', message: 'Validation failed', progress: 0 });
      setIsImporting(false);
      return;
    }

    setProgress({ step: 'parsing', message: 'Parsing form structure...', progress: 30 });

    // Simulate parsing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setProgress({ step: 'mapping', message: 'Mapping questions and answers...', progress: 70 });

    // Simulate mapping delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock quiz data based on simulated parsing
    const mockQuiz = generateMockQuizFromUrl(googleFormsUrl);

    setProgress({ step: 'complete', message: 'Import completed successfully!', progress: 100 });

    // Simulate final delay
    await new Promise(resolve => setTimeout(resolve, 500));

    onImportQuiz(mockQuiz);
    setIsImporting(false);
    setIsOpen(false);
    setGoogleFormsUrl("");
    setProgress({ step: 'idle', message: '', progress: 0 });
  };

  const generateMockQuizFromUrl = (url: string) => {
    // Extract form ID from URL for consistent mock data generation
    const formIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const formId = formIdMatch ? formIdMatch[1] : 'default';

    // Use form ID to seed mock data for consistency
    const seed = formId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const questionTypes = ['multiple-choice', 'checkbox', 'short-answer'];
    const topics = [
      'Password Security',
      'Phishing Awareness',
      'Data Privacy',
      'Safe Internet Practices',
      'Cyberbullying Prevention'
    ];

    const questionTemplates = [
      'What is the most important step in {topic}?',
      'Which of the following is a sign of {topic} threat?',
      'How should you handle {topic} situations?',
      'What should you do if you encounter {topic}?',
      'Why is {topic} important for online safety?'
    ];

    const answerOptions = [
      ['Create strong passwords', 'Share passwords with friends', 'Use the same password everywhere', 'Write passwords on paper'],
      ['Click on suspicious links', 'Verify sender identity', 'Open all email attachments', 'Share personal information freely'],
      ['Report to trusted adults', 'Keep it secret', 'Respond aggressively', 'Ignore and hope it stops'],
      ['Contact authorities immediately', 'Try to handle it yourself', 'Delete all evidence', 'Confront the bully online']
    ];

    // Generate 3-6 questions
    const numQuestions = (seed % 4) + 3;
    const selectedTopic = topics[seed % topics.length];

    const questions = Array.from({ length: numQuestions }, (_, i) => {
      const questionType = questionTypes[(seed + i) % questionTypes.length];
      const template = questionTemplates[(seed + i) % questionTemplates.length];
      const questionText = template.replace('{topic}', selectedTopic.toLowerCase());

      let answers: { text: string; isCorrect: boolean }[] = [];

      if (questionType === 'multiple-choice') {
        const options = answerOptions[(seed + i) % answerOptions.length];
        answers = options.map((option, idx) => ({
          text: option,
          isCorrect: idx === 0 // First option is always correct in mock data
        }));
      } else if (questionType === 'checkbox') {
        // For checkbox, multiple correct answers
        const options = answerOptions[(seed + i) % answerOptions.length];
        answers = options.map((option, idx) => ({
          text: option,
          isCorrect: idx < 2 // First two options are correct
        }));
      } else {
        // Short answer - single correct answer
        answers = [
          { text: 'Strong passwords with numbers and symbols', isCorrect: true },
          { text: 'Simple words', isCorrect: false },
          { text: 'Pet names', isCorrect: false },
          { text: 'Birth dates', isCorrect: false }
        ];
      }

      return {
        id: i + 1,
        question: questionText,
        answers
      };
    });

    return {
      title: `${selectedTopic} Quiz`,
      description: `Imported from Google Forms - ${selectedTopic} assessment covering key concepts and best practices.`,
      questions
    };
  };

  const handleImport = () => {
    if (!googleFormsUrl.trim()) {
      setError("Please enter a Google Forms URL");
      return;
    }
    simulateImportProcess();
  };

  const resetImport = () => {
    setGoogleFormsUrl("");
    setProgress({ step: 'idle', message: '', progress: 0 });
    setError("");
    setIsImporting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="md"
          variant="outline"
          icon={<FileText />}
          onClick={() => setIsOpen(true)}
        >
          Import from Google Forms
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Import from Google Forms
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-forms-url">Google Forms URL</Label>
            <Input
              id="google-forms-url"
              type="url"
              placeholder="https://docs.google.com/forms/d/.../viewform"
              value={googleFormsUrl}
              onChange={(e) => setGoogleFormsUrl(e.target.value)}
              disabled={isImporting}
            />
            <p className="text-xs text-gray-500">
              Paste the shareable link to your Google Form (supports both /d/ and /d/e/ formats)
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isImporting && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {progress.step === 'validating' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                {progress.step === 'parsing' && <Loader2 className="w-4 h-4 animate-spin text-green-500" />}
                {progress.step === 'mapping' && <Loader2 className="w-4 h-4 animate-spin text-purple-500" />}
                {progress.step === 'complete' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {progress.step === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                <span className="text-sm font-medium">{progress.message}</span>
              </div>
              <Progress value={progress.progress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                resetImport();
              }}
              disabled={isImporting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting || !googleFormsUrl.trim()}
              className="flex-1"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Import Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}