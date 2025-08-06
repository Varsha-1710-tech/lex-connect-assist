import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FingerprintInput } from "@/components/ui/fingerprint-input";
import { Scale, Gavel, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [userType, setUserType] = useState<"lawyer" | "judge">("lawyer");
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  const [formData, setFormData] = useState({
    enrollmentNumber: "",
    courtId: "",
    password: "",
  });
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fingerprintVerified) {
      alert("Please verify your fingerprint first");
      return;
    }
    
    // Simulate login
    if (userType === "lawyer") {
      navigate("/lawyer-dashboard");
    } else {
      navigate("/judge-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-legal bg-gradient-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-legal rounded-full flex items-center justify-center">
            <Scale className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Secure Login</CardTitle>
            <CardDescription>Access the Legal Communication Platform</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={userType}
            onValueChange={(value) => setUserType(value as "lawyer" | "judge")}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value="lawyer" id="lawyer" />
              <Label htmlFor="lawyer" className="flex items-center space-x-2 cursor-pointer">
                <Scale className="h-4 w-4" />
                <span>Lawyer</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value="judge" id="judge" />
              <Label htmlFor="judge" className="flex items-center space-x-2 cursor-pointer">
                <Gavel className="h-4 w-4" />
                <span>Judge</span>
              </Label>
            </div>
          </RadioGroup>

          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === "lawyer" ? (
              <div className="space-y-2">
                <Label htmlFor="enrollment">Enrollment Number</Label>
                <Input
                  id="enrollment"
                  value={formData.enrollmentNumber}
                  onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                  placeholder="Enter your enrollment number"
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="courtId">Court ID</Label>
                <Input
                  id="courtId"
                  value={formData.courtId}
                  onChange={(e) => setFormData({ ...formData, courtId: e.target.value })}
                  placeholder="Enter your court ID"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Fingerprint Verification</Label>
              <div className="flex justify-center">
                <FingerprintInput onVerified={setFingerprintVerified} />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-legal"
              disabled={!fingerprintVerified}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-accent hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}