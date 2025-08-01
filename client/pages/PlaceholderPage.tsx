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

        <Card className="text-center py-12 bg-white shadow-lg border-0">
          <CardHeader>
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-brand-teal to-brand-blue rounded-full flex items-center justify-center">
              <Construction className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {module}
            </CardTitle>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Coming Soon!
              </h3>
              <p className="text-gray-600 mb-4">
                This module is currently under development. We're working hard to bring you an amazing experience.
              </p>
              <p className="text-sm text-gray-500">
                Want this feature implemented? Continue prompting to add specific functionality to this page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:opacity-90">
                  Return to Dashboard
                </Button>
              </Link>
              <Button variant="outline">
                Request Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
