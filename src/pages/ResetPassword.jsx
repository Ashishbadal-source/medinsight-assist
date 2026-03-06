// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Activity, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Shield, Lock } from "lucide-react";
// import { supabase } from "../lib/supabase";

// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Try query params first (token_hash method)
//     const params = new URLSearchParams(window.location.search);
//     const token_hash = params.get("token_hash");
//     const type = params.get("type");

//     if (token_hash && type === "recovery") {
//       supabase.auth.verifyOtp({ token_hash, type: "recovery" })
//         .then(({ error }) => {
//           if (error) setError("Invalid or expired reset link. Please request a new one.");
//         });
//       return;
//     }

//     // Fallback: Try hash fragment (access_token method)
//     const hashParams = new URLSearchParams(window.location.hash.substring(1));
//     const access_token = hashParams.get("access_token");
//     const refresh_token = hashParams.get("refresh_token");

//     if (access_token && refresh_token) {
//       supabase.auth.setSession({ access_token, refresh_token })
//         .then(({ error }) => {
//           if (error) setError("Invalid or expired reset link. Please request a new one.");
//         });
//     }
//   }, []);

//   const getPasswordStrength = (pwd) => {
//     if (pwd.length === 0) return null;
//     if (pwd.length < 6) return { label: "Too short", color: "bg-red-500", width: "w-1/4" };
//     if (pwd.length < 8) return { label: "Weak", color: "bg-orange-500", width: "w-2/4" };
//     if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/)) return { label: "Strong", color: "bg-green-500", width: "w-full" };
//     return { label: "Medium", color: "bg-yellow-500", width: "w-3/4" };
//   };

//   const strength = getPasswordStrength(password);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!password) { setError("Please enter a new password"); return; }
//     if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
//     if (password !== confirmPassword) { setError("Passwords do not match"); return; }

//     setIsLoading(true);
//     const { error: updateError } = await supabase.auth.updateUser({ password });
//     setIsLoading(false);

//     if (updateError) {
//       setError(updateError.message || "Failed to update password. Please try again.");
//     } else {
//       await supabase.auth.signOut();
//       setSuccess(true);
//       setTimeout(() => navigate("/login"), 3000);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex">
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-blue-100 flex-col justify-center items-center p-12 relative overflow-hidden">
//         <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
//         <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-200/40 rounded-full blur-3xl" />
//         <div className="max-w-md text-center relative z-10">
//           <div className="flex items-center justify-center gap-3 mb-10">
//             <div className="p-3 bg-primary rounded-2xl shadow-lg">
//               <Activity className="h-10 w-10 text-white" />
//             </div>
//             <span className="text-3xl font-bold text-foreground">MedInsight AI</span>
//           </div>
//           <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/80 mb-8">
//             <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
//             <h1 className="text-2xl font-semibold text-foreground mb-3">Secure Password Reset</h1>
//             <p className="text-muted-foreground leading-relaxed">
//               Choose a strong, unique password to keep your medical data safe and secure.
//             </p>
//           </div>
//           <div className="space-y-3 text-left">
//             {["At least 6 characters long", "Mix of letters and numbers", "Avoid common passwords"].map((tip, i) => (
//               <div key={i} className="flex items-center gap-3 bg-white/50 rounded-lg px-4 py-2.5">
//                 <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
//                 <span className="text-sm text-muted-foreground">{tip}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
//         <div className="w-full max-w-md">
//           <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
//             <div className="p-2 bg-primary rounded-xl">
//               <Activity className="h-6 w-6 text-white" />
//             </div>
//             <span className="text-xl font-semibold text-foreground">MedInsight AI</span>
//           </div>

//           {success ? (
//             <div className="text-center">
//               <div className="flex justify-center mb-6">
//                 <div className="p-4 bg-green-100 rounded-full">
//                   <CheckCircle className="h-16 w-16 text-green-500" />
//                 </div>
//               </div>
//               <h2 className="text-2xl font-bold text-foreground mb-2">Password Updated!</h2>
//               <p className="text-muted-foreground mb-2">Your password has been successfully updated.</p>
//               <p className="text-sm text-muted-foreground">Redirecting to login in 3 seconds...</p>
//             </div>
//           ) : (
//             <>
//               <div className="mb-8">
//                 <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
//                   <Lock className="h-3.5 w-3.5" />
//                   Password Reset
//                 </div>
//                 <h2 className="text-3xl font-bold text-foreground mb-2">Set New Password</h2>
//                 <p className="text-muted-foreground">Create a strong password for your account.</p>
//               </div>

//               {error && (
//                 <div className="flex items-start gap-3 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-xl mb-5">
//                   <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
//                   <p className="text-sm text-destructive">{error}</p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => { setPassword(e.target.value); setError(""); }}
//                       className="w-full px-4 py-3 border border-border rounded-xl bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12 shadow-sm"
//                       placeholder="Enter new password"
//                     />
//                     <button type="button" onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1">
//                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                     </button>
//                   </div>
//                   {strength && (
//                     <div className="mt-2">
//                       <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                         <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
//                       </div>
//                       <p className={`text-xs mt-1 font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
//                   <div className="relative">
//                     <input
//                       type={showConfirm ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
//                       className="w-full px-4 py-3 border border-border rounded-xl bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12 shadow-sm"
//                       placeholder="Confirm new password"
//                     />
//                     <button type="button" onClick={() => setShowConfirm(!showConfirm)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1">
//                       {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                     </button>
//                   </div>
//                   {confirmPassword && password !== confirmPassword && (
//                     <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
//                   )}
//                   {confirmPassword && password === confirmPassword && (
//                     <p className="text-xs text-green-500 mt-1">✓ Passwords match</p>
//                   )}
//                 </div>

//                 <button type="submit" disabled={isLoading}
//                   className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm mt-2">
//                   {isLoading ? (
//                     <><Loader2 className="h-5 w-5 animate-spin" />Updating Password...</>
//                   ) : (
//                     <><Lock className="h-4 w-4" />Update Password</>
//                   )}
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;













import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, Shield, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type");
    if (token_hash && type === "recovery") {
      supabase.auth.verifyOtp({ token_hash, type: "recovery" })
        .then(({ error }) => { if (error) setError("Invalid or expired reset link. Please request a new one."); });
      return;
    }
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");
    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token })
        .then(({ error }) => { if (error) setError("Invalid or expired reset link. Please request a new one."); });
    }
  }, []);

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { label: "Too short", color: "bg-red-500", text: "text-red-500", width: "w-1/4" };
    if (pwd.length < 8) return { label: "Weak", color: "bg-orange-500", text: "text-orange-500", width: "w-2/4" };
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/)) return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-500", width: "w-full" };
    return { label: "Medium", color: "bg-yellow-500", text: "text-yellow-600", width: "w-3/4" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password) { setError("Please enter a new password"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (updateError) {
      setError(updateError.message || "Failed to update password. Please try again.");
    } else {
      await supabase.auth.signOut();
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="min-h-screen flex" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>

      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-md text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/25">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-slate-900">MedInsight <span className="text-primary">AI</span></span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800 mb-2">Secure Password Reset</h1>
            <p className="text-slate-500 text-sm leading-relaxed">Choose a strong, unique password to keep your medical data safe and secure.</p>
          </div>
          <div className="space-y-2.5 text-left">
            {["At least 6 characters long", "Mix of letters and numbers", "Avoid common passwords"].map((tip, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/80">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-sm text-slate-500">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-white/70 backdrop-blur-sm">
        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="p-2 bg-primary rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">MedInsight <span className="text-primary">AI</span></span>
          </div>

          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <div className="p-4 bg-emerald-50 rounded-full border border-emerald-100">
                  <CheckCircle className="h-14 w-14 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Updated!</h2>
              <p className="text-slate-500 text-sm mb-1">Your password has been successfully updated.</p>
              <p className="text-xs text-slate-400">Redirecting to login in 3 seconds...</p>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4 border border-primary/10">
                  <Lock className="h-3 w-3" />
                  Password Reset
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Set New Password</h2>
                <p className="text-slate-500 text-sm">Create a strong password for your account.</p>
              </div>

              {error && (
                <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-5">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-11 text-sm"
                      placeholder="Enter new password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {strength && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${strength.text}`}>{strength.label}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-11 text-sm"
                      placeholder="Confirm new password"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
                  {confirmPassword && password === confirmPassword && <p className="text-xs text-emerald-500 mt-1">✓ Passwords match</p>}
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-primary/20">
                  {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Updating Password...</> : <><Lock className="h-4 w-4" />Update Password</>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
