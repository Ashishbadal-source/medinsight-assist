// // import { useNavigate } from "react-router-dom";
// // import { Activity, Shield } from "lucide-react";
// // import AuthForm from "../components/AuthForm.jsx";
// // import { useAuth } from "../context/AuthContext.jsx";

// // const Signup = () => {
// //   const { signup, isLoading, isAuthenticated } = useAuth();
// //   const navigate = useNavigate();

// //   // Redirect if already logged in
// //   if (isAuthenticated) {
// //     navigate("/profile");
// //     return null;
// //   }

// //   const handleSignup = async (formData) => {
// //     const result = await signup({
// //       name: formData.name,
// //       email: formData.email,
// //       age: formData.age || null,
// //       gender: formData.gender || null,
// //     });
// //     if (result.success) {
// //       navigate("/profile");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-background flex">
// //       {/* Left side - Branding */}
// //       <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col justify-center items-center p-12">
// //         <div className="max-w-md text-center">
// //           <div className="flex items-center justify-center gap-3 mb-8">
// //             <Activity className="h-12 w-12 text-primary" />
// //             <span className="text-3xl font-bold text-foreground">MedInsight AI</span>
// //           </div>
// //           <h1 className="text-2xl font-semibold text-foreground mb-4">
// //             Clinical Decision Support System
// //           </h1>
// //           <p className="text-muted-foreground mb-8">
// //             AI-assisted analysis of medical reports to support clinical decision-making. 
// //             Upload blood tests, X-rays, ECGs, and more.
// //           </p>
// //           <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
// //             <Shield className="h-4 w-4" />
// //             <span>Your data is secure and confidential</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Right side - Form */}
// //       <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
// //         <div className="w-full max-w-md">
// //           {/* Mobile logo */}
// //           <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
// //             <Activity className="h-8 w-8 text-primary" />
// //             <span className="text-xl font-semibold text-foreground">MedInsight AI</span>
// //           </div>

// //           <div className="mb-8">
// //             <h2 className="text-2xl font-bold text-foreground mb-2">
// //               Create Account
// //             </h2>
// //             <p className="text-muted-foreground">
// //               Sign up to access your medical dashboard
// //             </p>
// //           </div>

// //           <AuthForm type="signup" onSubmit={handleSignup} isLoading={isLoading} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Signup;











// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";

// const Signup = () => {
//   const { signup } = useAuth();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     age: "",
//     gender: "",
//   });

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const res = await signup(form);
//   //   if (!res.success) alert(res.error.message);
//   // };



//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const res = await signup({
//     email: form.email,
//     password: form.password,
//     name: form.name,
//     age: form.age,
//     gender: form.gender,
//   });

//   if (!res.success) {
//     alert(res.error.message);
//   }
// };


//   return (
//     <form onSubmit={handleSubmit}>
//       <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
//       <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
//       <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} />
//       <input placeholder="Age" onChange={e => setForm({...form, age: e.target.value})} />
//       <input placeholder="Gender" onChange={e => setForm({...form, gender: e.target.value})} />
//       <button>Signup</button>
//     </form>
//   );
// };

// export default Signup;











import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await signup(form);
    if (!res.success) {
      alert(res.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name"/>
      <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email"/>
      <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password"/>
      <input type="password" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})} placeholder="Confirm Password"/>
      <input value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="Age"/>
      <input value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} placeholder="Gender"/>
      <button>Create Account</button>
    </form>
  );
};

export default Signup;
