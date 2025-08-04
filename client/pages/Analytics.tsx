import { useState } from "react";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Clock, 
  FileText, 
  Activity,
  Download,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { AdminOnly } from "@/components/RoleAccess";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AnalyticsMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "stable";
  icon: React.ComponentType<any>;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function Analytics() {
  const { userProfile } = useAuth();
  const [timeRange, setTimeRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(false);

  const metrics: AnalyticsMetric[] = [
    {
      id: "total-employees",
      title: "Total Employees",
      value: 156,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "active-users",
      title: "Active Users (30d)",
      value: 142,
      change: "+8%",
      trend: "up",
      icon: Activity,
      color: "from-green-500 to-green-600"
    },
    {
      id: "avg-productivity",
      title: "Avg Productivity",
      value: "87%",
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "total-hours",
      title: "Total Hours Logged",
      value: "2,847h",
      change: "+15%",
      trend: "up",
      icon: Clock,
      color: "from-orange-500 to-orange-600"
    },
    {
      id: "policies-created",
      title: "Policies Created",
      value: 24,
      change: "+6",
      trend: "up",
      icon: FileText,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: "avg-response-time",
      title: "Avg Response Time",
      value: "2.4h",
      change: "-12%",
      trend: "up",
      icon: Clock,
      color: "from-teal-500 to-teal-600"
    }
  ];

  const departmentData: ChartData[] = [
    { name: "Engineering", value: 45, color: "#3B82F6" },
    { name: "Marketing", value: 23, color: "#10B981" },
    { name: "Sales", value: 32, color: "#F59E0B" },
    { name: "HR", value: 12, color: "#EF4444" },
    { name: "Finance", value: 18, color: "#8B5CF6" },
    { name: "Operations", value: 26, color: "#06B6D4" }
  ];

  const taskCompletionData: ChartData[] = [
    { name: "Completed", value: 78, color: "#10B981" },
    { name: "In Progress", value: 15, color: "#F59E0B" },
    { name: "Overdue", value: 7, color: "#EF4444" }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleExport = () => {
    // Simulate export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metric,Value,Change\n" +
      metrics.map(m => `${m.title},${m.value},${m.change}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminOnly fallback={
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">You need admin privileges to access analytics.</p>
      </div>
    }>
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
            <p className="text-gray-600">System performance metrics and insights</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">24 Hours</SelectItem>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleRefresh}
              variant="outline"
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
            
            <Button onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <Card key={metric.id} className="bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                      `bg-gradient-to-br ${metric.color}`
                    )}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={cn(
                      "text-xs",
                      metric.trend === "up" ? "bg-green-100 text-green-700" :
                      metric.trend === "down" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {metric.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Distribution */}
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Department Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="font-medium text-gray-700">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: dept.color,
                            width: `${(dept.value / 60) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{dept.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Task Completion */}
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Task Completion Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taskCompletionData.map((status) => (
                  <div key={status.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="font-medium text-gray-700">{status.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            backgroundColor: status.color,
                            width: `${status.value}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-10 text-right">{status.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Recent System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "2 minutes ago", action: "New employee John Doe added to Engineering", type: "user" },
                { time: "15 minutes ago", action: "Policy 'Remote Work Guidelines' updated", type: "policy" },
                { time: "1 hour ago", action: "Task completion rate increased by 5%", type: "metric" },
                { time: "2 hours ago", action: "24 employees logged hours today", type: "time" },
                { time: "3 hours ago", action: "Marketing team meeting scheduled", type: "calendar" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activity.type === "user" ? "bg-blue-500" :
                    activity.type === "policy" ? "bg-purple-500" :
                    activity.type === "metric" ? "bg-green-500" :
                    activity.type === "time" ? "bg-orange-500" :
                    "bg-gray-500"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <p>Last updated: {new Date().toLocaleString()} • Data refreshes automatically every 5 minutes</p>
        </div>
      </div>
    </AdminOnly>
  );
}
