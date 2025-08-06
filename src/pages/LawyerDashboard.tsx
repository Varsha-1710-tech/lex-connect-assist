import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Scale, Search, Video, Calendar, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LawyerDashboard() {
  const [cnrNumber, setCnrNumber] = useState("");
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnrNumber) return;

    // Simulate fetching case details
    setCaseDetails({
      cnr: cnrNumber,
      title: "State v. John Doe",
      caseType: "Criminal",
      status: "Pending",
      nextHearing: "2024-08-15 10:30 AM",
      judge: "Hon. Justice Smith",
      court: "District Court - Central",
      petitioner: "State of Maharashtra",
      respondent: "John Doe",
      description: "Case involving charges of fraud and embezzlement. The matter is scheduled for final arguments.",
    });
  };

  const handleVirtualHearing = () => {
    navigate("/virtual-hearing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      <header className="bg-gradient-legal text-primary-foreground shadow-legal">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scale className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Lawyer Dashboard</h1>
                <p className="text-primary-foreground/80">Legal Communication Platform</p>
              </div>
            </div>
            <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Case Search */}
          <div className="lg:col-span-2">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Case Search</span>
                </CardTitle>
                <CardDescription>
                  Enter CNR number to fetch case details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Label htmlFor="cnr">CNR Number</Label>
                      <Input
                        id="cnr"
                        value={cnrNumber}
                        onChange={(e) => setCnrNumber(e.target.value)}
                        placeholder="e.g., MHCT010012342023"
                        required
                      />
                    </div>
                    <Button type="submit" className="mt-6 bg-gradient-legal">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </form>

                {caseDetails && (
                  <div className="mt-6 space-y-4">
                    <div className="border rounded-lg p-4 bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">{caseDetails.title}</h3>
                        <Badge variant="outline">{caseDetails.status}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">CNR:</span> {caseDetails.cnr}
                        </div>
                        <div>
                          <span className="font-medium">Case Type:</span> {caseDetails.caseType}
                        </div>
                        <div>
                          <span className="font-medium">Judge:</span> {caseDetails.judge}
                        </div>
                        <div>
                          <span className="font-medium">Court:</span> {caseDetails.court}
                        </div>
                        <div>
                          <span className="font-medium">Petitioner:</span> {caseDetails.petitioner}
                        </div>
                        <div>
                          <span className="font-medium">Respondent:</span> {caseDetails.respondent}
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-secondary/50 rounded">
                        <p className="text-sm">{caseDetails.description}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>Next Hearing: {caseDetails.nextHearing}</span>
                        </div>
                        <Button onClick={handleVirtualHearing} className="bg-accent hover:bg-accent/90">
                          <Video className="h-4 w-4 mr-2" />
                          Join Virtual Hearing
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  File Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Hearing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Client Management
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle>Recent Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Civil Appeal 123/2024</div>
                    <div className="text-xs text-muted-foreground">Next: Aug 20, 2024</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Criminal Case 456/2024</div>
                    <div className="text-xs text-muted-foreground">Next: Aug 22, 2024</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}