import { Construction, ArrowLeft, CheckSquare, Calendar, Clock, Users, MessageSquare, Receipt, DollarSign, FileText, FolderOpen, UserPlus, TrendingUp, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  module: string;
  description: string;
}

export default function PlaceholderPage({ module, description }: PlaceholderPageProps) {
  const getModuleIcon = () => {
    switch (module) {
      case "Task Center": return CheckSquare;
      case "Smart Calendar": return Calendar;
      case "Time & Attendance": return Clock;
      case "Team Directory": return Users;
      case "Connect": return MessageSquare;
      case "Claim Manager": return Receipt;
      case "Salary Center": return DollarSign;
      case "Policy Vault": return FileText;
      case "Document Box": return FolderOpen;
      case "Hiring Hub": return UserPlus;
      case "Growth & Feedback": return TrendingUp;
      case "Support & Helpdesk": return Headphones;
      default: return Construction;
    }
  };

  const getSampleData = () => {
    switch (module) {
      case "Task Center":
        return [
          { title: "Review Q4 Performance Reports", status: "In Progress", priority: "High", due: "Today" },
          { title: "Update Employee Handbook", status: "Pending", priority: "Medium", due: "Dec 15" },
          { title: "Prepare Budget Presentation", status: "Pending", priority: "High", due: "Dec 10" },
          { title: "Schedule Team Meeting", status: "To Do", priority: "Low", due: "Dec 8" }
        ];
      case "Smart Calendar":
        return [
          { title: "Team Standup", time: "9:00 AM", type: "Meeting" },
          { title: "Project Review", time: "2:00 PM", type: "Meeting" },
          { title: "Sarah's Birthday", time: "All Day", type: "Event" },
          { title: "Christmas Holiday", time: "Dec 25", type: "Holiday" }
        ];
      case "Time & Attendance":
        return [
          { date: "Dec 5, 2024", clockIn: "9:15 AM", clockOut: "6:30 PM", hours: "8.25h", status: "Complete" },
          { date: "Dec 4, 2024", clockIn: "9:00 AM", clockOut: "6:00 PM", hours: "8.0h", status: "Complete" },
          { date: "Dec 3, 2024", clockIn: "9:10 AM", clockOut: "6:15 PM", hours: "8.08h", status: "Complete" },
          { date: "Dec 2, 2024", clockIn: "9:05 AM", clockOut: "6:10 PM", hours: "8.08h", status: "Complete" }
        ];
      default:
        return [];
    }
  };

  const ModuleIcon = getModuleIcon();
  const sampleData = getSampleData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-brand-teal to-brand-blue rounded-full flex items-center justify-center">
              <ModuleIcon className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {module}
            </CardTitle>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </CardHeader>

          <CardContent>
            {/* Sample Data Preview */}
            {sampleData.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-left">
                  Preview Data
                </h3>
                <div className="space-y-3">
                  {sampleData.map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
                      {module === "Task Center" && (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant={item.status === "In Progress" ? "default" : "secondary"}>
                                {item.status}
                              </Badge>
                              <Badge variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "default" : "secondary"}>
                                {item.priority}
                              </Badge>
                              <span className="text-sm text-gray-600">Due: {item.due}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {module === "Smart Calendar" && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-600">{item.time}</p>
                          </div>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                      )}

                      {module === "Time & Attendance" && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-900">{item.date}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">In: {item.clockIn}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Out: {item.clockOut}</p>
                          </div>
                          <div>
                            <p className="font-medium text-blue-600">{item.hours}</p>
                          </div>
                          <div>
                            <Badge variant="secondary">{item.status}</Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:opacity-90">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
