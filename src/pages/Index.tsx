import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Gavel, Shield, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      {/* Header */}
      <header className="bg-gradient-legal text-primary-foreground shadow-legal">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scale className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">LegalConnect</h1>
                <p className="text-primary-foreground/80">Professional Legal Communication Platform</p>
              </div>
            </div>
            <div className="space-x-3">
              <Link to="/login">
                <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="secondary">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-legal bg-clip-text text-transparent">
            Secure Legal Communication & Virtual Hearings
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Professional platform designed for lawyers and judges to conduct secure virtual hearings, 
            manage cases, and communicate efficiently within the legal system.
          </p>
          <div className="space-x-4">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-legal">
                Join as Lawyer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">
                Join as Judge
                <Gavel className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-card bg-gradient-card text-center">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto text-accent mb-4" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                Multi-factor authentication with fingerprint verification for maximum security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card bg-gradient-card text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-accent mb-4" />
              <CardTitle>Virtual Hearings</CardTitle>
              <CardDescription>
                Professional video conferencing with party communication and document sharing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card bg-gradient-card text-center">
            <CardHeader>
              <Gavel className="h-12 w-12 mx-auto text-accent mb-4" />
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Machine learning analysis for case scheduling and argument evaluation
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* User Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <Scale className="h-8 w-8 text-accent mb-3" />
              <CardTitle>For Lawyers</CardTitle>
              <CardDescription>Access case information, join virtual hearings, and communicate with all parties</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">CNR-based case search</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Virtual hearing participation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Secure client communication</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full mt-4 bg-gradient-legal">
                  Register as Lawyer
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <Gavel className="h-8 w-8 text-accent mb-3" />
              <CardTitle>For Judges</CardTitle>
              <CardDescription>Manage court schedules, analyze cases, and conduct hearings efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">AI-powered case analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Hearing schedule management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Precedent-based recommendations</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full mt-4 bg-gradient-legal">
                  Register as Judge
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 LegalConnect. Secure, Professional, Efficient.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
