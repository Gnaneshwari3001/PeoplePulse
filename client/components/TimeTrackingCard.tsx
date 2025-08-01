import { useState, useEffect } from "react";
import { Clock, PlayCircle, StopCircle, Calendar, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ref, set, get, push } from "firebase/database";
import { database } from "@/lib/firebase";

interface TimeTrackingData {
  clockInTime: string | null;
  clockOutTime: string | null;
  status: "off-duty" | "on-duty";
  lastClockIn: string | null;
  lastClockOut: string | null;
  totalHours: number;
}

export function TimeTrackingCard() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workData, setWorkData] = useState<TimeTrackingData>({
    clockInTime: null,
    clockOutTime: null,
    status: "off-duty",
    lastClockIn: null,
    lastClockOut: null,
    totalHours: 0,
  });
  const [loading, setLoading] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load today's work data from Firebase
  useEffect(() => {
    if (!currentUser) return;

    async function loadWorkData() {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const attendanceRef = ref(database, `attendance/${currentUser.uid}/${today}`);
        const snapshot = await get(attendanceRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const clockInTime = data.clockInTime;
          const clockOutTime = data.clockOutTime;

          if (clockInTime && !clockOutTime) {
            setWorkData(prev => ({
              ...prev,
              status: "on-duty",
              clockInTime: clockInTime,
              lastClockIn: clockInTime,
            }));
          } else if (clockInTime && clockOutTime) {
            const clockIn = new Date(clockInTime);
            const clockOut = new Date(clockOutTime);
            const totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

            setWorkData(prev => ({
              ...prev,
              status: "off-duty",
              clockInTime: clockInTime,
              clockOutTime: clockOutTime,
              lastClockIn: clockInTime,
              lastClockOut: clockOutTime,
              totalHours: totalHours,
            }));
          }
        }

        // Load last clock in/out times from recent data
        const userAttendanceRef = ref(database, `attendance/${currentUser.uid}`);
        const userSnapshot = await get(userAttendanceRef);
        if (userSnapshot.exists()) {
          const allData = userSnapshot.val();
          const dates = Object.keys(allData).sort().reverse();

          for (const date of dates) {
            const dayData = allData[date];
            if (dayData.clockInTime && !workData.lastClockIn) {
              setWorkData(prev => ({ ...prev, lastClockIn: dayData.clockInTime }));
            }
            if (dayData.clockOutTime && !workData.lastClockOut) {
              setWorkData(prev => ({ ...prev, lastClockOut: dayData.clockOutTime }));
            }
            if (workData.lastClockIn && workData.lastClockOut) break;
          }
        }
      } catch (error) {
        console.error("Error loading work data:", error);
      }
    }

    loadWorkData();
  }, [currentUser]);

  const handlePulseIn = async () => {
    if (!currentUser || loading) return;

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];

      // Update attendance record in Firebase
      const attendanceRef = ref(database, `attendance/${currentUser.uid}/${today}`);
      await set(attendanceRef, {
        clockInTime: now,
        clockOutTime: null,
        date: today,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
      });

      // Log the clock-in event
      const clockInLogRef = ref(database, `attendance_logs/${currentUser.uid}`);
      await push(clockInLogRef, {
        type: "clock_in",
        timestamp: now,
        date: today,
      });

      setWorkData(prev => ({
        ...prev,
        status: "on-duty",
        clockInTime: now,
        clockOutTime: null,
        lastClockIn: now,
      }));

      toast({
        title: "✅ Pulsed In Successfully!",
        description: `You've clocked in at ${new Date(now).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
      });
    } catch (error) {
      console.error("Error clocking in:", error);
      toast({
        title: "Error",
        description: "Failed to clock in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePulseOut = async () => {
    if (!currentUser || !workData.clockInTime || loading) return;

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];

      const clockIn = new Date(workData.clockInTime);
      const clockOut = new Date(now);
      const totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

      // Update attendance record in Firebase
      const attendanceRef = ref(database, `attendance/${currentUser.uid}/${today}`);
      await set(attendanceRef, {
        clockInTime: workData.clockInTime,
        clockOutTime: now,
        totalHours: totalHours,
        date: today,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
      });

      // Log the clock-out event
      const clockOutLogRef = ref(database, `attendance_logs/${currentUser.uid}`);
      await push(clockOutLogRef, {
        type: "clock_out",
        timestamp: now,
        date: today,
        totalHours: totalHours,
      });

      setWorkData(prev => ({
        ...prev,
        status: "off-duty",
        clockOutTime: now,
        lastClockOut: now,
        totalHours: totalHours,
      }));

      toast({
        title: "⏰ Pulsed Out Successfully!",
        description: `You've clocked out at ${new Date(now).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. Total: ${totalHours.toFixed(1)}h`,
      });
    } catch (error) {
      console.error("Error clocking out:", error);
      toast({
        title: "Error",
        description: "Failed to clock out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not recorded";
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isButtonsDisabled = workData.clockInTime && workData.clockOutTime;

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-brand-teal" />
            <span>My Work Day</span>
          </CardTitle>
          
          <Badge 
            className={`${
              workData.status === "on-duty" 
                ? "bg-green-100 text-green-800 border-green-200" 
                : "bg-gray-100 text-gray-800 border-gray-200"
            } font-medium px-3 py-1`}
          >
            {workData.status === "on-duty" ? "🟢 You are On Duty" : "🔴 You are Off Duty"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Live Clock Section */}
        <div className="text-center space-y-2 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(currentTime)}</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 font-mono">
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {workData.status === "off-duty" && !isButtonsDisabled && (
            <Button
              onClick={handlePulseIn}
              className="flex-1 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              disabled={isButtonsDisabled}
            >
              <PlayCircle className="w-6 h-6 mr-2" />
              Pulse In
            </Button>
          )}

          {workData.status === "on-duty" && (
            <Button
              onClick={handlePulseOut}
              className="flex-1 h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <StopCircle className="w-6 h-6 mr-2" />
              Pulse Out
            </Button>
          )}

          {isButtonsDisabled && (
            <div className="flex-1 h-14 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 font-medium">Work day completed</span>
            </div>
          )}
        </div>

        {/* Time Records */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <PlayCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium">Last Pulse In</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 pl-6">
              {formatTime(workData.clockInTime || workData.lastClockIn)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <StopCircle className="w-4 h-4 text-red-600" />
              <span className="font-medium">Last Pulse Out</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 pl-6">
              {formatTime(workData.clockOutTime || workData.lastClockOut)}
            </div>
          </div>
        </div>

        {/* Total Hours */}
        {workData.totalHours > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Total Hours Worked Today</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {workData.totalHours.toFixed(1)}h
              </div>
            </div>
          </div>
        )}

        {/* Helper Text */}
        {workData.status === "off-duty" && !isButtonsDisabled && (
          <div className="text-center text-sm text-gray-500">
            💡 Click "Pulse In" to start tracking your work day
          </div>
        )}
      </CardContent>
    </Card>
  );
}
