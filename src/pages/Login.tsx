import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FingerprintInput } from "@/components/ui/fingerprint-input";
import { Scale, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Check user profile to determine role and redirect accordingly
      setTimeout(() => {
        fetchUserProfile();
      }, 0);
    }
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      // Redirect based on user type
      if (profile.role === 'judge') {
        navigate("/judge-dashboard");
      } else {
        navigate("/lawyer-dashboard");
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      navigate("/lawyer-dashboard"); // fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fingerprintVerified) {
      alert("Please verify your fingerprint first");
      return;
    }
    
    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      // Navigation will happen automatically via useEffect
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
            <CardTitle className="text-2xl font-bold">Secure Login</CardTitle>
            <CardDescription>Access the Legal Communication Platform</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={!fingerprintVerified || loading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Signing In..." : "Sign In"}
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