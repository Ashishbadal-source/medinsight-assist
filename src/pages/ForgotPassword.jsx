// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Activity, ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
// import { supabase } from "../lib/supabase";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email.trim()) {
//       setError("Please enter your email address");
//       return;
//     }
//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
//       redirectTo: `${window.location.origin}/reset-password`,
//     });

//     setIsLoading(false);

//     if (resetError) {
//       setError(resetError.message || "Something went wrong. Please try again.");
//     } else {
//       setSuccess(true);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Left side - Branding */}
//       <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col justify-center items-center p-12">
//         <div className="max-w-md text-center">
//           <div className="flex items-center justify-center gap-3 mb-8">
//             <Activity className="h-12 w-12 text-primary" />
//             <span className="text-3xl font-bold text-foreground">MedInsight AI</span>
//           </div>
//           <h1 className="text-2xl font-semibold text-foreground mb-4">
//             Reset Your Password
//           </h1>
//           <p className="text-muted-foreground">
//             Enter your registered email and we'll send you a link to reset your password.
//           </p>
//         </div>
//       </div>

//       {/* Right side - Form */}
//       <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
//         <div className="w-full max-w-md">

//           {/* Mobile logo */}
//           <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
//             <Activity className="h-8 w-8 text-primary" />
//             <span className="text-xl font-semibold text-foreground">MedInsight AI</span>
//           </div>

//           <Link
//             to="/login"
//             className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Login
//           </Link>

//           {success ? (
//             /* Success state */
//             <div className="text-center">
//               <div className="flex justify-center mb-4">
//                 <CheckCircle className="h-16 w-16 text-green-500" />
//               </div>
//               <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
//               <p className="text-muted-foreground mb-6">
//                 We've sent a password reset link to{" "}
//                 <span className="font-medium text-foreground">{email}</span>.
//                 Check your inbox and follow the instructions.
//               </p>
//               <p className="text-sm text-muted-foreground mb-6">
//                 Didn't receive the email? Check your spam folder or{" "}
//                 <button
//                   onClick={() => setSuccess(false)}
//                   className="text-primary hover:underline font-medium"
//                 >
//                   try again
//                 </button>
//                 .
//               </p>
//               <Link
//                 to="/login"
//                 className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Back to Login
//               </Link>
//             </div>
//           ) : (
//             /* Form state */
//             <>
//               <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h2>
//                 <p className="text-muted-foreground">
//                   No worries! Enter your email and we'll send you a reset link.
//                 </p>
//               </div>

//               {error && (
//                 <div className="flex items-start gap-3 px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg mb-5">
//                   <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
//                   <p className="text-sm text-destructive">{error}</p>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-1.5">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                         setError("");
//                       }}
//                       className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//                       placeholder="Enter your registered email"
//                     />
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="h-5 w-5 animate-spin" />
//                       Sending Reset Link...
//                     </>
//                   ) : (
//                     "Send Reset Link"
//                   )}
//                 </button>

//                 <p className="text-center text-sm text-muted-foreground">
//                   Remember your password?{" "}
//                   <Link to="/login" className="text-primary hover:underline font-medium">
//                     Back to Login
//                   </Link>
//                 </p>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;













import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { supabase } from "../lib/supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address"); return; }
    setIsLoading(true);
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);
    if (resetError) {
      setError(resetError.message || "Something went wrong. Please try again.");
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>

      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
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
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/80 mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800 mb-2">Reset Your Password</h1>
            <p className="text-slate-500 text-sm leading-relaxed">Enter your registered email and we'll send you a secure link to reset your password.</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Shield className="h-3.5 w-3.5" />
            <span>Your data is secure and confidential</span>
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

          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <div className="p-4 bg-emerald-50 rounded-full border border-emerald-100">
                  <CheckCircle className="h-14 w-14 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                We've sent a password reset link to <span className="font-semibold text-slate-800">{email}</span>. Check your inbox and follow the instructions.
              </p>
              <p className="text-sm text-slate-400 mb-6">
                Didn't receive the email? Check your spam folder or{" "}
                <button onClick={() => setSuccess(false)} className="text-primary hover:underline font-medium">try again</button>.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4 border border-primary/10">
                  <Mail className="h-3 w-3" />
                  Password Reset
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Forgot Password?</h2>
                <p className="text-slate-500 text-sm">No worries! Enter your email and we'll send you a reset link.</p>
              </div>

              {error && (
                <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-5">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                      placeholder="Enter your registered email"
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-primary/20">
                  {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending Reset Link...</> : "Send Reset Link"}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">Back to Login</Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
