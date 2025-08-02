import { useState } from "react";
import { 
  TrendingUp, 
  Plus, 
  Star, 
  MessageSquare, 
  User, 
  Calendar,
  Target,
  Award,
  Filter,
  Search,
  Send,
  Eye,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Feedback {
  id: string;
  type: "self-review" | "peer-feedback" | "360-feedback" | "goal-setting" | "general";
  title: string;
  content: string;
  targetEmployee?: string;
  rating?: number;
  category: string;
  status: "draft" | "submitted" | "reviewed" | "completed";
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isAnonymous: boolean;
}

const initialFeedbacks: Feedback[] = [
  {
    id: "fb-001",
    type: "self-review",
    title: "Q4 Self Performance Review",
    content: "This quarter I focused on improving my technical skills and collaboration with the design team. I successfully completed 3 major projects and mentored 2 junior developers.",
    rating: 4,
    category: "Performance Review",
    status: "submitted",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    tags: ["leadership", "technical-skills", "mentoring"],
    isAnonymous: false
  },
  {
    id: "fb-002",
    type: "peer-feedback",
    title: "Feedback for Sarah Chen",
    content: "Sarah has been excellent at project coordination and always ensures clear communication across teams. Her attention to detail in project planning is exceptional.",
    targetEmployee: "Sarah Chen",
    rating: 5,
    category: "Team Collaboration",
    status: "submitted",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    tags: ["communication", "project-management", "leadership"],
    isAnonymous: false
  },
  {
    id: "fb-003",
    type: "360-feedback",
    title: "360 Review - Leadership Skills",
    content: "Areas for improvement include delegating tasks more effectively and providing more detailed feedback during code reviews.",
    rating: 3,
    category: "Leadership Development",
    status: "reviewed",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-08",
    tags: ["delegation", "code-review", "feedback"],
    isAnonymous: true
  },
  {
    id: "fb-004",
    type: "goal-setting",
    title: "2024 Professional Development Goals",
    content: "1. Complete AWS certification by Q2\n2. Lead at least 2 cross-functional projects\n3. Mentor 3 junior developers\n4. Improve public speaking skills",
    category: "Goal Setting",
    status: "draft",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-14",
    tags: ["certification", "leadership", "mentoring", "communication"],
    isAnonymous: false
  }
];

export default function GrowthFeedback() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New feedback form state
  const [newFeedback, setNewFeedback] = useState({
    type: "general" as Feedback["type"],
    title: "",
    content: "",
    targetEmployee: "",
    rating: 0,
    category: "",
    tags: "",
    isAnonymous: false
  });

  const getUserName = () => {
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'You';
  };

  const handleSubmitFeedback = async () => {
    if (!newFeedback.title || !newFeedback.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedback: Feedback = {
        id: `fb-${Date.now()}`,
        type: newFeedback.type,
        title: newFeedback.title,
        content: newFeedback.content,
        targetEmployee: newFeedback.targetEmployee || undefined,
        rating: newFeedback.rating || undefined,
        category: newFeedback.category || "General",
        status: "submitted",
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        tags: newFeedback.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isAnonymous: newFeedback.isAnonymous
      };

      setFeedbacks(prev => [feedback, ...prev]);
      
      // Reset form
      setNewFeedback({
        type: "general",
        title: "",
        content: "",
        targetEmployee: "",
        rating: 0,
        category: "",
        tags: "",
        isAnonymous: false
      });

      toast({
        title: "Feedback Submitted",
        description: "Your feedback has been successfully submitted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || feedback.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: Feedback["status"]) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-700";
      case "submitted": return "bg-blue-100 text-blue-700";
      case "reviewed": return "bg-orange-100 text-orange-700";
      case "completed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: Feedback["type"]) => {
    switch (type) {
      case "self-review": return User;
      case "peer-feedback": return MessageSquare;
      case "360-feedback": return BarChart3;
      case "goal-setting": return Target;
      default: return Star;
    }
  };

  const StarRating = ({ rating, onChange, readonly = false }: { rating: number; onChange?: (rating: number) => void; readonly?: boolean }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
            onClick={() => !readonly && onChange?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-violet-500 to-violet-600">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Growth & Feedback</h1>
              <p className="text-gray-600">Manage performance reviews, feedback, and professional development</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-feedback">My Feedback</TabsTrigger>
            <TabsTrigger value="give-feedback">Give Feedback</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-violet-700">Total Feedback</p>
                      <p className="text-2xl font-bold text-violet-900">{feedbacks.length}</p>
                      <p className="text-xs text-violet-600">All submissions</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-violet-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Completed Reviews</p>
                      <p className="text-2xl font-bold text-green-900">
                        {feedbacks.filter(f => f.status === 'completed').length}
                      </p>
                      <p className="text-xs text-green-600">This quarter</p>
                    </div>
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Avg Rating</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {(feedbacks.filter(f => f.rating).reduce((acc, f) => acc + (f.rating || 0), 0) / 
                          feedbacks.filter(f => f.rating).length || 0).toFixed(1)}
                      </p>
                      <p className="text-xs text-blue-600">Out of 5.0</p>
                    </div>
                    <Star className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Feedback */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-500" />
                  Recent Feedback Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbacks.slice(0, 3).map((feedback) => {
                    const TypeIcon = getTypeIcon(feedback.type);
                    return (
                      <div key={feedback.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/40">
                        <TypeIcon className="w-5 h-5 text-violet-600" />
                        <div className="flex-1">
                          <h4 className="font-medium">{feedback.title}</h4>
                          <p className="text-sm text-gray-600">{feedback.category}</p>
                        </div>
                        <Badge className={getStatusColor(feedback.status)}>
                          {feedback.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{feedback.createdAt}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Feedback Tab */}
          <TabsContent value="my-feedback" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48 bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="self-review">Self Review</SelectItem>
                  <SelectItem value="peer-feedback">Peer Feedback</SelectItem>
                  <SelectItem value="360-feedback">360 Feedback</SelectItem>
                  <SelectItem value="goal-setting">Goal Setting</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback List */}
            <div className="grid gap-4">
              {filteredFeedbacks.map((feedback) => {
                const TypeIcon = getTypeIcon(feedback.type);
                return (
                  <Card key={feedback.id} className="bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <TypeIcon className="w-5 h-5 text-violet-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{feedback.title}</h3>
                            <p className="text-sm text-gray-600">{feedback.category}</p>
                            {feedback.targetEmployee && (
                              <p className="text-sm text-blue-600">For: {feedback.targetEmployee}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {feedback.rating && <StarRating rating={feedback.rating} readonly />}
                          <Badge className={getStatusColor(feedback.status)}>
                            {feedback.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">{feedback.content}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {feedback.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {feedback.isAnonymous && (
                            <Badge variant="outline" className="text-xs">Anonymous</Badge>
                          )}
                          <span>{feedback.updatedAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Give Feedback Tab */}
          <TabsContent value="give-feedback" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-violet-500" />
                  Submit New Feedback
                </CardTitle>
                <CardDescription>
                  Share your thoughts, review performance, or set goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Feedback Type</label>
                    <Select value={newFeedback.type} onValueChange={(value: Feedback["type"]) => 
                      setNewFeedback(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self-review">Self Review</SelectItem>
                        <SelectItem value="peer-feedback">Peer Feedback</SelectItem>
                        <SelectItem value="360-feedback">360 Feedback</SelectItem>
                        <SelectItem value="goal-setting">Goal Setting</SelectItem>
                        <SelectItem value="general">General Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Input
                      placeholder="e.g., Performance, Leadership, Skills"
                      value={newFeedback.category}
                      onChange={(e) => setNewFeedback(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="Brief title for your feedback"
                    value={newFeedback.title}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                {newFeedback.type === "peer-feedback" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Employee</label>
                    <Input
                      placeholder="Employee name"
                      value={newFeedback.targetEmployee}
                      onChange={(e) => setNewFeedback(prev => ({ ...prev, targetEmployee: e.target.value }))}
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    placeholder="Detailed feedback, observations, or goals..."
                    value={newFeedback.content}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating (Optional)</label>
                    <StarRating
                      rating={newFeedback.rating}
                      onChange={(rating) => setNewFeedback(prev => ({ ...prev, rating }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                    <Input
                      placeholder="leadership, communication, technical"
                      value={newFeedback.tags}
                      onChange={(e) => setNewFeedback(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={newFeedback.isAnonymous}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm">Submit anonymously</label>
                </div>

                <Button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="w-full bg-violet-500 hover:bg-violet-600"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-violet-500" />
                  Professional Development Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbacks.filter(f => f.type === 'goal-setting').map((goal) => (
                    <div key={goal.id} className="p-4 rounded-lg bg-white/40">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700 whitespace-pre-line">{goal.content}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {goal.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
