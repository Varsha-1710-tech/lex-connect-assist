import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Scale, Search, Video, Calendar, FileText, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function LawyerDashboard() {
  const [cnrNumber, setCnrNumber] = useState("");
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  useEffect(() => {
    fetchRecentCases();
  }, []);

  const fetchRecentCases = async () => {
    try {
      const { data: cases, error } = await supabase
        .from('cases')
        .select(`
          *,
          hearings(hearing_date, status),
          case_participants(*)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching cases:', error);
        return;
      }

      setRecentCases(cases || []);
    } catch (error) {
      console.error('Error in fetchRecentCases:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnrNumber) return;

    setLoading(true);
    try {
      const { data: cases, error } = await supabase
        .from('cases')
        .select(`
          *,
          hearings(hearing_date, status)
        `)
        .eq('cnr_number', cnrNumber)
        .maybeSingle();

      if (error) {
        console.error('Error searching case:', error);
        setCaseDetails(null);
        return;
      }

      if (cases) {
        setCaseDetails({
          cnr: cases.cnr_number,
          title: cases.title,
          caseType: cases.case_type,
          status: cases.status,
          nextHearing: cases.hearings?.[0]?.hearing_date ? 
            new Date(cases.hearings[0].hearing_date).toLocaleString() : 'Not scheduled',
          petitioner: cases.petitioner,
          respondent: cases.respondent,
          description: cases.description,
          court: cases.court_name
        });
      } else {
        setCaseDetails(null);
        alert("No case found with this CNR number");
      }
    } catch (error) {
      console.error('Error in handleSearch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVirtualHearing = () => {
    navigate("/virtual-hearing");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleQuickAction = (action: string) => {
    // Add navigation or functionality for each action
    switch (action) {
      case 'file-documents':
        alert('File Documents feature - Coming soon!');
        break;
      case 'schedule-hearing':
        alert('Schedule Hearing feature - Coming soon!');
        break;
      case 'client-management':
        alert('Client Management feature - Coming soon!');
        break;
      default:
        break;
    }
  };

  const handleCaseClick = (caseItem: any) => {
    setCnrNumber(caseItem.cnr_number);
    setCaseDetails({
      cnr: caseItem.cnr_number,
      title: caseItem.title,
      caseType: caseItem.case_type,
      status: caseItem.status,
      nextHearing: caseItem.hearings?.[0]?.hearing_date ? 
        new Date(caseItem.hearings[0].hearing_date).toLocaleString() : 'Not scheduled',
      petitioner: caseItem.petitioner,
      respondent: caseItem.respondent,
      description: caseItem.description,
      court: caseItem.court_name
    });
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
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
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
                    <Button 
                      type="submit" 
                      className="mt-6 bg-gradient-legal"
                      disabled={loading}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {loading ? 'Searching...' : 'Search'}
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-secondary"
                  onClick={() => handleQuickAction('file-documents')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  File Documents
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-secondary"
                  onClick={() => handleQuickAction('schedule-hearing')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Hearing
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-secondary"
                  onClick={() => handleQuickAction('client-management')}
                >
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
                  {recentCases.length > 0 ? (
                    recentCases.map((caseItem) => (
                      <div 
                        key={caseItem.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => handleCaseClick(caseItem)}
                      >
                        <div className="font-medium text-sm">{caseItem.title}</div>
                        <div className="text-xs text-muted-foreground">
                          CNR: {caseItem.cnr_number}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Status: {caseItem.status}
                        </div>
                        {caseItem.hearings?.[0] && (
                          <div className="text-xs text-muted-foreground">
                            Next: {new Date(caseItem.hearings[0].hearing_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No recent cases found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}