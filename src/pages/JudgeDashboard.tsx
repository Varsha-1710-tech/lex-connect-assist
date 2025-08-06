import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gavel, 
  Calendar, 
  Clock, 
  TrendingUp, 
  FileText,
  Users,
  CheckCircle,
  AlertTriangle,
  Brain
} from "lucide-react";

export default function JudgeDashboard() {
  const [cases] = useState([
    {
      id: 1,
      cnr: "MHCT010012342023",
      title: "State v. John Doe",
      type: "Criminal",
      urgency: "High",
      forwardPartyStrength: 75,
      respondentPartyStrength: 68,
      pastJudgments: 8,
      extensions: 2,
      mlRecommendation: "Proceed with existing date",
      scheduledDate: "2024-08-15 10:30 AM",
      status: "Active"
    },
    {
      id: 2,
      cnr: "MHCT010012352023",
      title: "ABC Corp v. XYZ Ltd",
      type: "Civil",
      urgency: "Medium",
      forwardPartyStrength: 82,
      respondentPartyStrength: 71,
      pastJudgments: 12,
      extensions: 1,
      mlRecommendation: "Consider new hearing date",
      scheduledDate: "2024-08-15 14:00 PM",
      status: "Active"
    },
    {
      id: 3,
      cnr: "MHCT010012362023",
      title: "Property Dispute Case",
      type: "Civil",
      urgency: "Low",
      forwardPartyStrength: 65,
      respondentPartyStrength: 78,
      pastJudgments: 5,
      extensions: 0,
      mlRecommendation: "Proceed with existing date",
      scheduledDate: "2024-08-15 16:30 PM",
      status: "Pending"
    }
  ]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    return recommendation.includes("new") ? (
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
    ) : (
      <CheckCircle className="h-4 w-4 text-green-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      <header className="bg-gradient-legal text-primary-foreground shadow-legal">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gavel className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Judge Dashboard</h1>
                <p className="text-primary-foreground/80">Hon. Justice Smith - District Court Central</p>
              </div>
            </div>
            <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Today's Cases</p>
                  <p className="text-2xl font-bold">{cases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{cases.filter(c => c.status === "Pending").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">ML Insights</p>
                  <p className="text-2xl font-bold">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cases for Tomorrow */}
        <Card className="shadow-card bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Cases Scheduled for Tomorrow</span>
            </CardTitle>
            <CardDescription>
              AI-powered analysis and recommendations based on arguments, precedents, and case history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cases.map((case_) => (
                <div key={case_.id} className="border rounded-lg p-6 bg-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{case_.title}</h3>
                        <Badge variant="outline">{case_.type}</Badge>
                        <div className={`w-3 h-3 rounded-full ${getUrgencyColor(case_.urgency)}`} title={`${case_.urgency} Urgency`}></div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">CNR: {case_.cnr}</p>
                      <p className="text-sm text-muted-foreground">Scheduled: {case_.scheduledDate}</p>
                    </div>
                    <Badge variant={case_.status === "Active" ? "default" : "secondary"}>
                      {case_.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Argument Analysis */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Argument Strength Analysis</span>
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Forward Party (Petitioner)</span>
                            <span>{case_.forwardPartyStrength}%</span>
                          </div>
                          <Progress value={case_.forwardPartyStrength} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Respondent Party</span>
                            <span>{case_.respondentPartyStrength}%</span>
                          </div>
                          <Progress value={case_.respondentPartyStrength} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Case Metrics */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Case Metrics</span>
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Past Judgments:</span>
                          <p className="font-medium">{case_.pastJudgments}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Extensions:</span>
                          <p className="font-medium">{case_.extensions}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Urgency Level:</span>
                          <p className="font-medium">{case_.urgency}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Case Type:</span>
                          <p className="font-medium">{case_.type}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ML Recommendation */}
                  <div className="bg-secondary/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">AI Recommendation</h4>
                      {getRecommendationIcon(case_.mlRecommendation)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on argument analysis, case history, urgency factors, and precedent review:
                    </p>
                    <p className="font-medium">{case_.mlRecommendation}</p>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        Accept Recommendation
                      </Button>
                      <Button variant="outline" size="sm">
                        Schedule New Date
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}