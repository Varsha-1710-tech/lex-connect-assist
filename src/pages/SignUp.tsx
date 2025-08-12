import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Scale, Gavel, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function SignUp() {
  const [userType, setUserType] = useState<"lawyer" | "judge">("lawyer");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    enrollmentNumber: "",
    courtId: "",
    password: "",
    confirmPassword: "",
  });
  
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on user type after profile is created
      checkUserProfileAndRedirect();
    }
  }, [user, navigate]);

  const checkUserProfileAndRedirect = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        if (profile.user_type === 'judge') {
          navigate('/judge-dashboard');
        } else {
          navigate('/lawyer-dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    
    const metadata = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: userType,
      enrollment_number: userType === 'lawyer' ? formData.enrollmentNumber : undefined,
      court_id: userType === 'judge' ? formData.courtId : undefined,
    };

    const { error } = await signUp(formData.email, formData.password, metadata);
    
    if (!error) {
      // Redirect will happen automatically after email confirmation
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-legal bg-gradient-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-legal rounded-full flex items-center justify-center">
            <Scale className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Join the Legal Communication Platform</CardDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>

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
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-legal" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-accent hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}