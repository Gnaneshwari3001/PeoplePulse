import { useState } from "react";
import { Plus, X, UserPlus, CheckSquare, FileText, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickActions } from "@/components/QuickActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  // Don't show for basic employees
  if (userProfile.role === "employee" || userProfile.role === "intern") {
    return null;
  }

  const quickActions = [
    {
      icon: UserPlus,
      label: "Add Employee",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => setIsDialogOpen(true),
      show: ["hr_manager", "admin"].includes(userProfile.role)
    },
    {
      icon: CheckSquare,
      label: "Create Task",
      color: "bg-green-500 hover:bg-green-600",
      action: () => setIsDialogOpen(true),
      show: true
    },
    {
      icon: FileText,
      label: "New Policy",
      color: "bg-indigo-500 hover:bg-indigo-600",
      action: () => setIsDialogOpen(true),
      show: ["hr_manager", "admin"].includes(userProfile.role)
    },
    {
      icon: Calendar,
      label: "Schedule Meeting",
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => setIsDialogOpen(true),
      show: true
    }
  ].filter(action => action.show);

  return (
    <>
      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <div className="flex flex-col-reverse items-end gap-3">
          {/* Quick action buttons */}
          {isOpen && (
            <div className="flex flex-col-reverse gap-3 mb-2">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    size="sm"
                    className={cn(
                      "h-12 w-12 rounded-full shadow-lg transform transition-all duration-300 ease-out p-0",
                      action.color,
                      isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    )}
                    style={{ 
                      transitionDelay: `${(quickActions.length - index - 1) * 50}ms` 
                    }}
                    onClick={() => {
                      action.action();
                      setIsOpen(false);
                    }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Button>
                );
              })}
            </div>
          )}

          {/* Main FAB */}
          <Button
            size="lg"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all duration-300 p-0",
              isOpen && "rotate-45"
            )}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Plus className="w-6 h-6 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Desktop Quick Actions (Always visible in sidebar area) */}
      <div className="hidden lg:block fixed bottom-6 left-80 z-40">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 max-w-xs">
          <QuickActions layout="compact" showTitle={false} maxActions={4} />
        </div>
      </div>

      {/* Quick Actions Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Actions
            </DialogTitle>
            <DialogDescription>
              Quickly perform common tasks and actions
            </DialogDescription>
          </DialogHeader>
          <QuickActions layout="grid" showTitle={false} />
        </DialogContent>
      </Dialog>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
