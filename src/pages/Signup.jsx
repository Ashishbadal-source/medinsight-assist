import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Shield, UserPlus, CheckCircle2, Heart, Brain, FileText } from "lucide-react";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const handleSignup = async (formData) => {
    setServerError("");
    console.log("SIGNUP FORM DATA 👉", formData);
    const res = await signup({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
    });

    if (!res.success) {
      setServerError(res.error?.message || "Signup failed. Please try again.");
      return;
    }

    navigate("/profile");
  };

  const perks = [
    { icon: FileText, label: "Instant Report Analysis" },
    { icon: Heart, label: "ECG & Blood Test Insights" },
    { icon: Brain, label: "AI-Powered Clinical Summaries" },
  ];

  return (
    <div className="min-h-screen flex" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">

        {/* Decorations */}
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

          <h1 className="text-2xl font-semibold text-slate-800 mb-3">Start Your Health Journey</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Join thousands of patients and professionals using AI to understand medical reports faster and smarter.
          </p>

          {/* Perks */}
          <div className="space-y-2.5 mb-8">
            {perks.map((p) => (
              <div key={p.label} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/80">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <p.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-slate-600 font-medium">{p.label}</span>
              </div>
            ))}
          </div>

          {/* Free badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-emerald-700 font-medium">Free to use — No credit card required</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-6">
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
              <UserPlus className="h-3 w-3" />
              Create Account
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Sign up for free</h2>
            <p className="text-slate-500 text-sm">Fill in your details to get started</p>
          </div>

          <AuthForm
            type="signup"
            onSubmit={handleSignup}
            serverError={serverError}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
