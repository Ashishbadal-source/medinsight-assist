import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, Shield, Lock, FileText, Heart, Brain } from "lucide-react";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  if (isAuthenticated) {
    navigate("/profile");
    return null;
  }

  const handleLogin = async (formData) => {
    setServerError("");
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate("/profile");
    } else {
      setServerError(result.error || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden"
        style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
        
        {/* Background decoration */}
        <div className="absolute top-20 right-10 w-40 h-40 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-md text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/25">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-slate-900">MedInsight <span className="text-primary">AI</span></span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-800 mb-3">Welcome Back</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Access your medical reports and AI-assisted clinical insights. View your analysis history and download reports.
          </p>

          {/* Feature pills */}
          <div className="space-y-2.5">
            {[
              { icon: FileText, label: "Lab Report Analysis" },
              { icon: Heart, label: "ECG Interpretation" },
              { icon: Brain, label: "Explainable AI Results" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/80">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <f.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-slate-600 font-medium">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-8">
            <Shield className="h-3.5 w-3.5" />
            <span>Your data is secure and confidential</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-white/70 backdrop-blur-sm">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="p-2 bg-primary rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">MedInsight <span className="text-primary">AI</span></span>
          </div>

          <div className="mb-7">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4 border border-primary/10">
              <Lock className="h-3 w-3" />
              Secure Login
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Login to your account</h2>
            <p className="text-slate-500 text-sm">Enter your credentials to access your dashboard</p>
          </div>

          <AuthForm
            type="login"
            onSubmit={handleLogin}
            isLoading={isLoading}
            serverError={serverError}
          />

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
