import { motion } from "motion/react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Search,
  Filter
} from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Navigation } from "./Navigation";
import { Class, Student } from "../App";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useForm } from "react-hook-form";

interface ClassManagementPageProps {
  onNavigate: (page: string) => void;
  classes: Class[];
  students: Student[];
  onCreateClass: (classData: Omit<Class, "id" | "createdAt" | "totalQuizzes" | "averageClassScore">) => void;
  onEditClass: (id: string, classData: Partial<Class>) => void;
  onDeleteClass: (id: string) => void;
  onAssignStudents: (classId: string, studentIds: string[]) => void;
}

interface ClassFormData {
  name: string;
  description: string;
}

export function ClassManagementPage({
  onNavigate,
  classes,
  students,
  onCreateClass,
  onEditClass,
  onDeleteClass,
  onAssignStudents,
}: ClassManagementPageProps) {
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const createForm = useForm<ClassFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const editForm = useForm<ClassFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleCreateClass = (data: ClassFormData) => {
    onCreateClass({
      name: data.name,
      description: data.description,
      teacherId: "teacher1", // In a real app, this would come from auth
      studentIds: [],
    });
    createForm.reset();
    setShowCreateDialog(false);
  };

  const handleEditClass = (data: ClassFormData) => {
    if (editingClass) {
      onEditClass(editingClass.id, {
        name: data.name,
        description: data.description,
      });
      editForm.reset();
      setEditingClass(null);
    }
  };

  const handleDeleteClass = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      onDeleteClass(id);
    }
  };

  const handleAssignStudents = (studentIds: string[]) => {
    if (selectedClass) {
      onAssignStudents(selectedClass.id, studentIds);
      setShowAssignDialog(false);
      setSelectedClass(null);
    }
  };

  const getClassStudents = (classItem: Class) => {
    return students.filter(student => classItem.studentIds.includes(student.id));
  };

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const averageClassSize = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E7FF] via-[#F0F8FF] to-[#E8F8F0]">
      <Navigation currentPage="class-management" onNavigate={onNavigate} userRole="teacher" />
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-5xl mb-2 text-[#2C3E50]">Class Management</h1>
            <p className="text-xl text-[#6B7280]">Organize and monitor student progress</p>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card color="blue" className="text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-12 h-12 text-[#4A90E2]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">{totalStudents}</h3>
            <p className="text-[#6B7280]">Total Students</p>
          </Card>

          <Card color="green" className="text-center">
            <div className="flex justify-center mb-3">
              <BarChart3 className="w-12 h-12 text-[#A8E6CF]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">{totalClasses}</h3>
            <p className="text-[#6B7280]">Active Classes</p>
          </Card>

          <Card color="yellow" className="text-center">
            <div className="flex justify-center mb-3">
              <TrendingUp className="w-12 h-12 text-[#FFB84D]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">{averageClassSize}</h3>
            <p className="text-[#6B7280]">Avg Class Size</p>
          </Card>

          <Card color="purple" className="text-center">
            <div className="flex justify-center mb-3">
              <Award className="w-12 h-12 text-[#C77DFF]" />
            </div>
            <h3 className="mb-2 text-[#2C3E50]">
              {classes.length > 0 ? Math.round(classes.reduce((sum, c) => sum + c.averageClassScore, 0) / classes.length) : 0}%
            </h3>
            <p className="text-[#6B7280]">Avg Class Score</p>
          </Card>
        </div>

        {/* Search and Create */}
        <Card color="white" className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="md" variant="primary" icon={<Plus />}>
                  Create New Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                  <DialogDescription>
                    Set up a new class for your students.
                  </DialogDescription>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(handleCreateClass)} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="name"
                      rules={{ required: "Class name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Cyber Security 101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="description"
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of the class..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowCreateDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary">
                        Create Class
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Classes List */}
        <div className="space-y-6">
          {filteredClasses.length === 0 ? (
            <Card color="white" className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 mb-2">No classes found</p>
              <p className="text-gray-400">Create your first class to get started!</p>
            </Card>
          ) : (
            filteredClasses.map((classItem) => {
              const classStudents = getClassStudents(classItem);
              return (
                <Card key={classItem.id} color="white" hoverable>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl mb-2 text-[#2C3E50]">{classItem.name}</h3>
                      <p className="text-[#6B7280] mb-3">{classItem.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {classStudents.length} students
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          {classItem.totalQuizzes} quizzes
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {classItem.averageClassScore}% avg score
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created {new Date(classItem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<UserPlus />}
                        onClick={() => {
                          setSelectedClass(classItem);
                          setShowAssignDialog(true);
                        }}
                      >
                        Assign Students
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<Edit />}
                        onClick={() => {
                          setEditingClass(classItem);
                          editForm.reset({
                            name: classItem.name,
                            description: classItem.description,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        icon={<Trash2 />}
                        onClick={() => handleDeleteClass(classItem.id, classItem.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Student List */}
                  {classStudents.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-lg mb-3 text-[#2C3E50]">Students ({classStudents.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {classStudents.map((student) => (
                          <div
                            key={student.id}
                            className="bg-gray-50 rounded-lg p-3 flex items-center gap-3"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4A90E2] to-[#357ABD] rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#2C3E50] truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-[#6B7280]">
                                Level {student.level} • {student.averageScore}% avg
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* Edit Class Dialog */}
        <Dialog open={!!editingClass} onOpenChange={(open) => !open && setEditingClass(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
              <DialogDescription>
                Update class information.
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditClass)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  rules={{ required: "Class name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cyber Security 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the class..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditingClass(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Update Class
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Assign Students Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Students to {selectedClass?.name}</DialogTitle>
              <DialogDescription>
                Select students to add to this class.
              </DialogDescription>
            </DialogHeader>
            <StudentAssignmentDialog
              students={students}
              selectedStudentIds={selectedClass?.studentIds || []}
              onAssign={handleAssignStudents}
              onCancel={() => setShowAssignDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface StudentAssignmentDialogProps {
  students: Student[];
  selectedStudentIds: string[];
  onAssign: (studentIds: string[]) => void;
  onCancel: () => void;
}

function StudentAssignmentDialog({
  students,
  selectedStudentIds,
  onAssign,
  onCancel,
}: StudentAssignmentDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedStudentIds);

  const toggleStudent = (studentId: string) => {
    setSelectedIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssign = () => {
    onAssign(selectedIds);
  };

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {students.map((student) => (
            <div
              key={student.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedIds.includes(student.id)
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => toggleStudent(student.id)}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="w-10 h-10 bg-gradient-to-br from-[#4A90E2] to-[#357ABD] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2C3E50]">{student.name}</p>
                  <p className="text-xs text-[#6B7280]">{student.email}</p>
                  <p className="text-xs text-[#6B7280]">
                    Level {student.level} • {student.quizzesCompleted} quizzes • {student.averageScore}% avg
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-sm text-[#6B7280]">
          {selectedIds.length} student{selectedIds.length !== 1 ? 's' : ''} selected
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAssign}>
            Assign Students
          </Button>
        </div>
      </div>
    </div>
  );
}