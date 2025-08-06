import { useState } from "react";
import {
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
  Filter,
  Search,
  FileText,
  Presentation,
  MessageSquare,
  Edit,
  Eye,
  Calendar,
  User,
  MoreVertical,
  Star,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TaskNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface TaskSlide {
  id: string;
  title: string;
  content: string;
  slideNumber: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignee: string;
  category: string;
  notes: TaskNote[];
  slides: TaskSlide[];
  attachments: string[];
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Review Q4 Performance Reports",
    description: "Analyze and review quarterly performance metrics for all departments",
    status: "done",
    priority: "high",
    dueDate: "2024-06-12",
    assignee: "You",
    category: "HR",
    notes: [
      {
        id: "n1",
        content: "All department reports received. Engineering shows 15% improvement.",
        createdAt: "2024-01-15 10:30",
        createdBy: "You",
      },
    ],
    slides: [],
    attachments: ["Q4_Performance_Summary.pdf"],
  },
  {
    id: "2",
    title: "Update Employee Handbook",
    description: "Revise policies and procedures in the employee handbook",
    status: "todo",
    priority: "medium",
    dueDate: "2024-15-12",
    assignee: "You",
    category: "Documentation",
    notes: [
      {
        id: "n2",
        content: "Need to review remote work policy and vacation policy sections.",
        createdAt: "2024-01-10 14:20",
        createdBy: "HR Manager",
      },
    ],
    slides: [],
    attachments: [],
  },
  {
    id: "3",
    title: "Prepare Budget Presentation",
    description: "Create slides for Q1 2025 budget presentation",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-10-12",
    assignee: "You",
    category: "Finance",
    notes: [
      {
        id: "n3",
        content: "Finance team provided budget data. Need to create executive summary.",
        createdAt: "2024-01-12 09:15",
        createdBy: "You",
      },
    ],
    slides: [
      {
        id: "s1",
        title: "Budget Overview",
        content: "Q1 2025 budget overview and key highlights",
        slideNumber: 1,
      },
      {
        id: "s2",
        title: "Department Allocations",
        content: "Breakdown of budget allocation by department",
        slideNumber: 2,
      },
    ],
    attachments: ["Budget_Data_Q1_2025.xlsx"],
  },
  {
    id: "4",
    title: "Schedule Team Meeting",
    description: "Organize monthly team sync meeting",
    status: "todo",
    priority: "low",
    dueDate: "2024-08-12",
    assignee: "You",
    category: "Management",
    notes: [],
    slides: [],
    attachments: [],
  },
  {
    id: "5",
    title: "Complete Training Module",
    description: "Finish cybersecurity awareness training",
    status: "done",
    priority: "medium",
    dueDate: "2024-01-12",
    assignee: "You",
    category: "Training",
    notes: [
      {
        id: "n5",
        content: "Training completed with 95% score. Certificate received.",
        createdAt: "2024-01-01 16:45",
        createdBy: "You",
      },
    ],
    slides: [],
    attachments: ["Cybersecurity_Certificate.pdf"],
  },
];

export default function TaskCenter() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newSlide, setNewSlide] = useState({ title: "", content: "" });
  const { toast } = useToast();

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const tasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    "in-progress": filteredTasks.filter((task) => task.status === "in-progress"),
    done: filteredTasks.filter((task) => task.status === "done"),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in-progress":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "done":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus.replace("-", " ")}`,
    });
  };

  const addNote = (taskId: string) => {
    if (!newNote.trim()) return;

    const note: TaskNote = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toLocaleString(),
      createdBy: "You",
    };

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, notes: [...task.notes, note] } : task
      )
    );

    setNewNote("");
    toast({
      title: "Note Added",
      description: "Your note has been added to the task",
    });
  };

  const addSlide = (taskId: string) => {
    if (!newSlide.title.trim() || !newSlide.content.trim()) return;

    const task = tasks.find((t) => t.id === taskId);
    const slideNumber = task ? task.slides.length + 1 : 1;

    const slide: TaskSlide = {
      id: Date.now().toString(),
      title: newSlide.title,
      content: newSlide.content,
      slideNumber,
    };

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, slides: [...task.slides, slide] } : task
      )
    );

    setNewSlide({ title: "", content: "" });
    toast({
      title: "Slide Added",
      description: "New slide has been added to the presentation",
    });
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {task.title}
              </h3>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {task.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>Category: {task.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>Assignee: {task.assignee}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openTaskDetail(task)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openTaskDetail(task)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(task.status)}>
              {task.status === "in-progress" ? "In Progress" : task.status === "todo" ? "Todo" : "Done"}
            </Badge>
            {task.notes.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MessageSquare className="w-3 h-3" />
                <span>{task.notes.length} notes</span>
              </div>
            )}
            {task.slides.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Presentation className="w-3 h-3" />
                <span>{task.slides.length} slides</span>
              </div>
            )}
            {task.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Paperclip className="w-3 h-3" />
                <span>{task.attachments.length} files</span>
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const statusOrder = ["todo", "in-progress", "done"];
              const currentIndex = statusOrder.indexOf(task.status);
              const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length] as Task["status"];
              updateTaskStatus(task.id, nextStatus);
            }}
            className="text-xs"
          >
            Update Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Center</h1>
              <p className="text-gray-600">
                Manage your tasks with notes, slides, and presentations
              </p>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 gap-2">
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {tasksByStatus["in-progress"].length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {tasksByStatus.done.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">High Priority</p>
                  <p className="text-3xl font-bold text-red-600">
                    {tasks.filter((t) => t.priority === "high").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do (2)</SelectItem>
                  <SelectItem value="in-progress">In Progress (1)</SelectItem>
                  <SelectItem value="done">Done (2)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="all">All Tasks ({filteredTasks.length})</TabsTrigger>
            <TabsTrigger value="todo">To Do ({tasksByStatus.todo.length})</TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({tasksByStatus["in-progress"].length})
            </TabsTrigger>
            <TabsTrigger value="done">Done ({tasksByStatus.done.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="todo" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasksByStatus.todo.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasksByStatus["in-progress"].map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="done" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasksByStatus.done.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Task Detail Dialog */}
        <Dialog open={isTaskDetailOpen} onOpenChange={setIsTaskDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                {selectedTask?.title}
              </DialogTitle>
              <DialogDescription>{selectedTask?.description}</DialogDescription>
            </DialogHeader>

            {selectedTask && (
              <div className="space-y-6">
                {/* Task Info */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <Badge className={getStatusColor(selectedTask.status)}>
                      {selectedTask.status === "in-progress"
                        ? "In Progress"
                        : selectedTask.status === "todo"
                          ? "Todo"
                          : "Done"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Priority</Label>
                    <Badge className={getPriorityColor(selectedTask.priority)}>
                      {selectedTask.priority.charAt(0).toUpperCase() +
                        selectedTask.priority.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Due Date</Label>
                    <p className="text-sm">
                      {new Date(selectedTask.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Category</Label>
                    <p className="text-sm">{selectedTask.category}</p>
                  </div>
                </div>

                <Tabs defaultValue="notes" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="notes">
                      Notes ({selectedTask.notes.length})
                    </TabsTrigger>
                    <TabsTrigger value="slides">
                      Slides ({selectedTask.slides.length})
                    </TabsTrigger>
                    <TabsTrigger value="attachments">
                      Files ({selectedTask.attachments.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="space-y-4">
                    <div className="space-y-3">
                      {selectedTask.notes.map((note) => (
                        <Card key={note.id} className="bg-gray-50">
                          <CardContent className="p-4">
                            <p className="text-sm mb-2">{note.content}</p>
                            <div className="text-xs text-gray-500">
                              {note.createdBy} • {note.createdAt}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={2}
                      />
                      <Button
                        onClick={() => addNote(selectedTask.id)}
                        disabled={!newNote.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="slides" className="space-y-4">
                    <div className="space-y-3">
                      {selectedTask.slides.map((slide) => (
                        <Card key={slide.id} className="bg-blue-50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium">
                                Slide {slide.slideNumber}: {slide.title}
                              </h4>
                              <Presentation className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600">{slide.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Slide title..."
                        value={newSlide.title}
                        onChange={(e) =>
                          setNewSlide({ ...newSlide, title: e.target.value })
                        }
                      />
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Slide content..."
                          value={newSlide.content}
                          onChange={(e) =>
                            setNewSlide({ ...newSlide, content: e.target.value })
                          }
                          rows={2}
                        />
                        <Button
                          onClick={() => addSlide(selectedTask.id)}
                          disabled={!newSlide.title.trim() || !newSlide.content.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="attachments" className="space-y-4">
                    <div className="space-y-3">
                      {selectedTask.attachments.map((attachment, index) => (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Paperclip className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{attachment}</span>
                              <Button size="sm" variant="outline" className="ml-auto">
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {selectedTask.attachments.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No attachments yet
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
