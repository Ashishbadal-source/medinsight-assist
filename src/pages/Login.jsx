import { useNavigate } from "react-router-dom";
import { Activity, Shield } from "lucide-react";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/profile");
    return null;
  }

  const handleLogin = async (formData) => {
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Activity className="h-12 w-12 text-primary" />
            <span className="text-3xl font-bold text-foreground">MedInsight AI</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mb-8">
            Access your medical reports and AI-assisted clinical insights. 
            View your analysis history and download reports.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your data is secure and confidential</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-foreground">MedInsight AI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Login
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Login;
