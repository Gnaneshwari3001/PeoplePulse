import { Check, Clock, AlertTriangle, XCircle, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "active" | "pending" | "rejected";
  timestamp?: string;
  user?: string;
  icon?: React.ComponentType<any>;
}

interface WorkflowTrackerProps {
  steps: WorkflowStep[];
  currentStep: number;
}

export function WorkflowTracker({ steps, currentStep }: WorkflowTrackerProps) {
  const getStepIcon = (step: WorkflowStep) => {
    if (step.icon) {
      const IconComponent = step.icon;
      return <IconComponent className="w-4 h-4" />;
    }

    switch (step.status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "active":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStepColor = (step: WorkflowStep, index: number) => {
    if (step.status === "completed") {
      return "bg-green-100 text-green-700 border-green-300";
    } else if (step.status === "rejected") {
      return "bg-red-100 text-red-700 border-red-300";
    } else if (index === currentStep) {
      return "bg-blue-100 text-blue-700 border-blue-300";
    } else {
      return "bg-gray-100 text-gray-500 border-gray-300";
    }
  };

  const getConnectorColor = (index: number) => {
    if (index < currentStep) {
      return "bg-green-300";
    } else if (index === currentStep) {
      return "bg-blue-300";
    } else {
      return "bg-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Workflow Progress</h4>
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200">
                <div 
                  className={cn(
                    "w-full transition-all duration-500",
                    getConnectorColor(index)
                  )}
                  style={{ 
                    height: index < currentStep ? "100%" : "0%" 
                  }}
                />
              </div>
            )}

            <div className="flex items-start gap-4 pb-6">
              {/* Step icon */}
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                getStepColor(step, index)
              )}>
                {getStepIcon(step)}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-gray-900">{step.title}</h5>
                  {step.status === "completed" && step.timestamp && (
                    <span className="text-xs text-gray-500">
                      {new Date(step.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                
                {step.user && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    {step.user}
                  </div>
                )}

                {step.status === "active" && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    In Progress
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example usage component
export function RequestWorkflowTracker({ requestId, status }: { requestId: string; status: string }) {
  const getWorkflowSteps = (status: string): WorkflowStep[] => {
    const baseSteps: WorkflowStep[] = [
      {
        id: "submitted",
        title: "Request Submitted",
        description: "Employee submitted the request",
        status: "completed",
        timestamp: new Date().toISOString(),
        user: "John Doe",
        icon: FileText
      },
      {
        id: "assigned",
        title: "Assigned for Review",
        description: "Request automatically assigned to approver",
        status: status === "pending" ? "active" : "completed",
        timestamp: status !== "pending" ? new Date().toISOString() : undefined,
        user: "Sarah Chen"
      },
      {
        id: "review",
        title: "Under Review",
        description: "Approver is reviewing the request",
        status: status === "in-progress" ? "active" : 
               status === "approved" || status === "rejected" ? "completed" : "pending",
        timestamp: status === "approved" || status === "rejected" ? new Date().toISOString() : undefined,
        user: "Sarah Chen"
      }
    ];

    // Add final step based on status
    if (status === "approved") {
      baseSteps.push({
        id: "approved",
        title: "Request Approved",
        description: "Request has been approved and processed",
        status: "completed",
        timestamp: new Date().toISOString(),
        user: "Sarah Chen"
      });
    } else if (status === "rejected") {
      baseSteps.push({
        id: "rejected",
        title: "Request Rejected",
        description: "Request has been rejected",
        status: "rejected",
        timestamp: new Date().toISOString(),
        user: "Sarah Chen"
      });
    } else if (status === "escalated") {
      baseSteps.push({
        id: "escalated",
        title: "Escalated",
        description: "Request escalated to higher authority",
        status: "active",
        timestamp: new Date().toISOString(),
        user: "System",
        icon: AlertTriangle
      });
    } else {
      baseSteps.push({
        id: "decision",
        title: "Approval Decision",
        description: "Waiting for final approval decision",
        status: "pending",
        user: "Sarah Chen"
      });
    }

    return baseSteps;
  };

  const steps = getWorkflowSteps(status);
  const currentStep = steps.findIndex(step => step.status === "active");

  return <WorkflowTracker steps={steps} currentStep={currentStep} />;
}
