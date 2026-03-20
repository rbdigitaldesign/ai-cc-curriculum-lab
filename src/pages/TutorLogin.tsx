import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import auLogo from "@/assets/au-logo-horizontal.png";

export default function TutorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (forgotPassword) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent. Check your inbox.");
        setForgotPassword(false);
      }
      return;
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to confirm your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-3">
          <img src={auLogo} alt="Adelaide University" className="h-8 mx-auto" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tutor Login</h1>
          <p className="text-sm text-muted-foreground">
            {forgotPassword
              ? "Enter your email to reset your password"
              : isSignUp
                ? "Create a tutor account"
                : "Sign in to access the dashboard"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          {!forgotPassword && (
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Please wait…"
              : forgotPassword
                ? "Send Reset Email"
                : isSignUp
                  ? "Sign Up"
                  : "Sign In"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          {!forgotPassword && (
            <button
              type="button"
              onClick={() => setForgotPassword(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </button>
          )}
          <div>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setForgotPassword(false);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
