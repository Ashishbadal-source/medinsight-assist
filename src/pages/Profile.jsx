// // // import { useEffect } from "react";
// // // import { useNavigate, Link } from "react-router-dom";
// // // import { Upload, FileText } from "lucide-react";

// // // import Navbar from "../components/Navbar.jsx";
// // // import Footer from "../components/Footer.jsx";
// // // import ProfileCard from "../components/ProfileCard.jsx";
// // // import ReportHistoryCard from "../components/ReportHistoryCard.jsx";
// // // import ReportTimeline from "../components/ReportTimeline.jsx";
// // // import DisclaimerBox from "../components/DisclaimerBox.jsx";

// // // import { useAuth } from "../context/AuthContext.jsx";

// // // const Profile = () => {
// // //   const { user, profile, reports, isAuthenticated, fetchReports } = useAuth();
// // //   const navigate = useNavigate();

// // //   // 🔐 Redirect ONLY if auth is confirmed false
// // //   useEffect(() => {
// // //     if (isAuthenticated === false) {
// // //       navigate("/login");
// // //     }
// // //   }, [isAuthenticated, navigate]);

// // //   // 📄 Fetch reports after login
// // //   useEffect(() => {
// // //     if (isAuthenticated) {
// // //       fetchReports();
// // //     }
// // //   }, [isAuthenticated, fetchReports]);

// // //   // ⏳ Wait only for USER (profile can be null initially)
// // //   if (!user) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center">
// // //         Loading user...
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen flex flex-col bg-background">
// // //       <Navbar />

// // //       <main className="flex-1 py-8 px-4">
// // //         <div className="max-w-7xl mx-auto">
// // //           {/* Header */}
// // //           <div className="mb-8">
// // //             <h1 className="text-3xl font-bold">Patient Dashboard</h1>
// // //             <p className="text-muted-foreground">
// // //               Manage your medical reports and view analysis history
// // //             </p>
// // //           </div>

// // //           <div className="grid lg:grid-cols-3 gap-6">
// // //             {/* LEFT */}
// // //             <div className="lg:col-span-1 space-y-6">
// // //               <ProfileCard user={user} profile={profile ?? {}} />

// // //               <Link
// // //                 to="/upload"
// // //                 className="flex items-center justify-center gap-3 w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary/90"
// // //               >
// // //                 <Upload className="w-5 h-5" />
// // //                 Upload New Medical Report
// // //               </Link>

// // //               <ReportTimeline reports={reports} />
// // //             </div>

// // //             {/* RIGHT */}
// // //             <div className="lg:col-span-2">
// // //               <div className="bg-card border rounded-xl p-6">
// // //                 <div className="flex justify-between mb-6">
// // //                   <h2 className="text-lg font-semibold flex gap-2">
// // //                     <FileText className="w-5 h-5 text-primary" />
// // //                     Medical Report History
// // //                   </h2>
// // //                   <span className="text-sm text-muted-foreground">
// // //                     {reports.length} report{reports.length !== 1 ? "s" : ""}
// // //                   </span>
// // //                 </div>

// // //                 {reports.length > 0 ? (
// // //                   <div className="grid gap-4">
// // //                     {reports.map((report) => (
// // //                       <ReportHistoryCard key={report.id} report={report} />
// // //                     ))}
// // //                   </div>
// // //                 ) : (
// // //                   <div className="text-center py-12">
// // //                     <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
// // //                     <p>No reports yet</p>
// // //                     <Link
// // //                       to="/upload"
// // //                       className="inline-flex gap-2 mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg"
// // //                     >
// // //                       <Upload className="w-4 h-4" />
// // //                       Upload Report
// // //                     </Link>
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <div className="mt-6">
// // //                 <DisclaimerBox variant="info" />
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </main>

// // //       <Footer />
// // //     </div>
// // //   );
// // // };

// // // export default Profile;





















// // import { useEffect } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // // import { Upload, FileText, User, Mail, Calendar, Venus, ArrowRight, Clock } from "lucide-react";
// // import { Upload, FileText, User, Mail, Calendar, ArrowRight, Clock } from "lucide-react";

// // import Navbar from "../components/Navbar.jsx";
// // import Footer from "../components/Footer.jsx";
// // import ReportHistoryCard from "../components/ReportHistoryCard.jsx";
// // import DisclaimerBox from "../components/DisclaimerBox.jsx";

// // import { useAuth } from "../context/AuthContext.jsx";

// // const Profile = () => {
// //   const { user, profile, reports, isAuthenticated, fetchReports } = useAuth();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (isAuthenticated === false) navigate("/login");
// //   }, [isAuthenticated, navigate]);

// //   useEffect(() => {
// //     if (isAuthenticated) fetchReports();
// //   }, [isAuthenticated, fetchReports]);

// //   if (!user) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
// //       </div>
// //     );
// //   }

// //   const memberSince = user?.created_at
// //     ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
// //     : "N/A";

// //   const recentReports = reports.slice(0, 3);

// //   return (
// //     <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
// //       <Navbar />

// //       <main className="flex-1 py-10 px-4">
// //         <div className="max-w-5xl mx-auto space-y-8">

// //           {/* Header */}
// //           <div>
// //             <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
// //             <p className="text-muted-foreground mt-1">Manage your account and medical history</p>
// //           </div>

// //           <div className="grid lg:grid-cols-3 gap-6">

// //             {/* LEFT — User Info Card */}
// //             <div className="lg:col-span-1 space-y-5">

// //               {/* Avatar + Name */}
// //               <div className="bg-white rounded-2xl border border-border p-6 shadow-sm text-center">
// //                 <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
// //                   <User className="h-10 w-10 text-primary" />
// //                 </div>
// //                 <h2 className="text-xl font-bold text-foreground">
// //                   {profile?.name || user?.email?.split("@")[0]}
// //                 </h2>
// //                 <p className="text-sm text-muted-foreground mt-1">Patient Account</p>

// //                 <div className="mt-5 space-y-3 text-left">
// //                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
// //                     <Mail className="h-4 w-4 text-primary shrink-0" />
// //                     <span className="text-sm text-foreground truncate">{user?.email}</span>
// //                   </div>

// //                   {profile?.gender && (
// //                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
// //                       <User className="h-4 w-4 text-primary shrink-0" />
// //                       <span className="text-sm text-foreground capitalize">{profile.gender}</span>
// //                     </div>
// //                   )}

// //                   {profile?.age && (
// //                     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
// //                       <User className="h-4 w-4 text-primary shrink-0" />
// //                       <span className="text-sm text-foreground">Age: {profile.age}</span>
// //                     </div>
// //                   )}

// //                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
// //                     <Calendar className="h-4 w-4 text-primary shrink-0" />
// //                     <span className="text-sm text-foreground">Member since {memberSince}</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Stats Card */}
// //               <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
// //                 <h3 className="text-sm font-semibold text-foreground mb-4">Report Summary</h3>
// //                 <div className="grid grid-cols-2 gap-3">
// //                   <div className="bg-primary/5 rounded-xl p-3 text-center">
// //                     <p className="text-2xl font-bold text-primary">{reports.length}</p>
// //                     <p className="text-xs text-muted-foreground mt-1">Total Reports</p>
// //                   </div>
// //                   <div className="bg-green-50 rounded-xl p-3 text-center">
// //                     <p className="text-2xl font-bold text-green-600">
// //                       {reports.filter(r => r.ai_summary).length}
// //                     </p>
// //                     <p className="text-xs text-muted-foreground mt-1">Analyzed</p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Upload Button */}
// //               <Link
// //                 to="/upload"
// //                 className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
// //               >
// //                 <Upload className="w-4 h-4" />
// //                 Upload New Report
// //               </Link>
// //             </div>

// //             {/* RIGHT — Reports */}
// //             <div className="lg:col-span-2 space-y-5">

// //               {/* Recent Reports */}
// //               <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
// //                 <div className="flex justify-between items-center mb-5">
// //                   <h2 className="text-lg font-semibold flex items-center gap-2">
// //                     <Clock className="w-5 h-5 text-primary" />
// //                     Recent Reports
// //                   </h2>
// //                   <Link
// //                     to="/profile/reports"
// //                     className="text-sm text-primary hover:underline flex items-center gap-1"
// //                     onClick={() => navigate("/profile")}
// //                   >
// //                   </Link>
// //                 </div>

// //                 {reports.length > 0 ? (
// //                   <div className="space-y-3">
// //                     {recentReports.map((report) => (
// //                       <ReportHistoryCard key={report.id} report={report} />
// //                     ))}
// //                     {reports.length > 3 && (
// //                       <Link
// //                         to="/profile"
// //                         className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors"
// //                       >
// //                         View all {reports.length} reports
// //                         <ArrowRight className="w-4 h-4" />
// //                       </Link>
// //                     )}
// //                   </div>
// //                 ) : (
// //                   <div className="text-center py-12 bg-slate-50 rounded-xl">
// //                     <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
// //                     <p className="text-muted-foreground font-medium">No reports uploaded yet</p>
// //                     <p className="text-sm text-muted-foreground mt-1">Upload your first medical report to get started</p>
// //                     <Link
// //                       to="/upload"
// //                       className="inline-flex items-center gap-2 mt-4 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
// //                     >
// //                       <Upload className="w-4 h-4" />
// //                       Upload Report
// //                     </Link>
// //                   </div>
// //                 )}
// //               </div>

// //               <DisclaimerBox variant="info" />
// //             </div>
// //           </div>
// //         </div>
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Profile;
















// // import { useEffect } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { Upload, FileText, User, Mail, Calendar, Clock, Activity } from "lucide-react";

// // import Navbar from "../components/Navbar.jsx";
// // import Footer from "../components/Footer.jsx";
// // import ProfileCard from "../components/ProfileCard.jsx";
// // import ReportHistoryCard from "../components/ReportHistoryCard.jsx";
// // import ReportTimeline from "../components/ReportTimeline.jsx";
// // import DisclaimerBox from "../components/DisclaimerBox.jsx";

// // import { useAuth } from "../context/AuthContext.jsx";

// // const Profile = () => {
// //   const { user, profile, reports, isAuthenticated, fetchReports } = useAuth();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (isAuthenticated === false) navigate("/login");
// //   }, [isAuthenticated, navigate]);

// //   useEffect(() => {
// //     if (isAuthenticated) fetchReports();
// //   }, [isAuthenticated, fetchReports]);

// //   if (!user) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-background">
// //         <div className="flex flex-col items-center gap-3">
// //           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
// //           <p className="text-sm text-muted-foreground">Loading your profile...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
// //       <Navbar />

// //       <main className="flex-1 py-8 px-4">
// //         <div className="max-w-7xl mx-auto">

// //           {/* Header */}
// //           <div className="mb-8 flex items-center justify-between">
// //             <div>
// //               <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
// //               <p className="text-muted-foreground mt-1">Manage your medical reports and view analysis history</p>
// //             </div>
// //             <div className="hidden md:flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
// //               <Activity className="h-4 w-4 text-primary" />
// //               <span className="text-sm font-medium text-primary">{reports.length} Reports</span>
// //             </div>
// //           </div>

// //           <div className="grid lg:grid-cols-3 gap-6">

// //             {/* LEFT */}
// //             <div className="lg:col-span-1 space-y-5">

// //               {/* Profile Card */}
// //               <ProfileCard user={user} profile={profile ?? {}} />

// //               {/* Upload Button */}
// //               <Link
// //                 to="/upload"
// //                 className="flex items-center justify-center gap-3 w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
// //               >
// //                 <Upload className="w-5 h-5" />
// //                 Upload New Medical Report
// //               </Link>

// //               {/* Timeline */}
// //               <ReportTimeline reports={reports} />
// //             </div>

// //             {/* RIGHT */}
// //             <div className="lg:col-span-2 space-y-5">

// //               {/* Report History */}
// //               <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
// //                 <div className="flex justify-between items-center mb-6">
// //                   <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
// //                     <div className="p-1.5 bg-primary/10 rounded-lg">
// //                       <FileText className="w-4 h-4 text-primary" />
// //                     </div>
// //                     Medical Report History
// //                   </h2>
// //                   <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
// //                     {reports.length} report{reports.length !== 1 ? "s" : ""}
// //                   </span>
// //                 </div>

// //                 {reports.length > 0 ? (
// //                   <div className="grid gap-4">
// //                     {reports.map((report) => (
// //                       <ReportHistoryCard key={report.id} report={report} />
// //                     ))}
// //                   </div>
// //                 ) : (
// //                   <div className="text-center py-16 bg-slate-50/80 rounded-xl border border-dashed border-border">
// //                     <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
// //                       <FileText className="w-8 h-8 text-muted-foreground/50" />
// //                     </div>
// //                     <p className="text-foreground font-medium">No reports uploaded yet</p>
// //                     <p className="text-sm text-muted-foreground mt-1 mb-5">Upload your first medical report to get AI-assisted insights</p>
// //                     <Link
// //                       to="/upload"
// //                       className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
// //                     >
// //                       <Upload className="w-4 h-4" />
// //                       Upload Report
// //                     </Link>
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Disclaimer */}
// //               <DisclaimerBox variant="info" />
// //             </div>
// //           </div>
// //         </div>
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Profile;
















// import { useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Upload, FileText, Activity } from "lucide-react";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import ProfileCard from "../components/ProfileCard.jsx";
// import ReportHistoryCard from "../components/ReportHistoryCard.jsx";
// import ReportTimeline from "../components/ReportTimeline.jsx";
// import DisclaimerBox from "../components/DisclaimerBox.jsx";
// import { useAuth } from "../context/AuthContext.jsx";

// const Profile = () => {
//   const { user, profile, reports, isAuthenticated, fetchReports } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated === false) navigate("/login");
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     if (isAuthenticated) fetchReports();
//   }, [isAuthenticated, fetchReports]);

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f8faff 100%)"}}>
//         <div className="flex flex-col items-center gap-3">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
//           <p className="text-sm text-slate-500">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f8faff 100%)"}}>
//       <Navbar />
//       <main className="flex-1 py-8 px-4">
//         <div className="max-w-7xl mx-auto">

//           {/* Header */}
//           <div className="mb-7 flex items-center justify-between">
//             <div>
//               <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-primary/20">
//                 <Activity className="h-3 w-3" />
//                 Patient Dashboard
//               </div>
//               <h1 className="text-2xl font-bold text-slate-900">Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!</h1>
//               <p className="text-slate-500 text-sm mt-0.5">Manage your medical reports and view analysis history</p>
//             </div>
//             <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
//               <FileText className="h-4 w-4 text-primary" />
//               <span className="text-sm font-semibold text-slate-700">{reports.length} Report{reports.length !== 1 ? "s" : ""}</span>
//             </div>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-5">

//             {/* LEFT */}
//             <div className="lg:col-span-1 space-y-4">
//               <ProfileCard user={user} profile={profile ?? {}} />

//               <Link
//                 to="/upload"
//                 className="flex items-center justify-center gap-2.5 w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
//               >
//                 <Upload className="w-4 h-4" />
//                 Upload New Report
//               </Link>

//               <ReportTimeline reports={reports} />
//             </div>

//             {/* RIGHT */}
//             <div className="lg:col-span-2 space-y-4">
//               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
//                 <div className="flex justify-between items-center mb-5">
//                   <h2 className="text-base font-semibold flex items-center gap-2 text-slate-800">
//                     <div className="p-1.5 bg-primary/10 rounded-lg">
//                       <FileText className="w-4 h-4 text-primary" />
//                     </div>
//                     Medical Report History
//                   </h2>
//                   <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
//                     {reports.length} report{reports.length !== 1 ? "s" : ""}
//                   </span>
//                 </div>

//                 {reports.length > 0 ? (
//                   <div className="grid gap-3">
//                     {reports.map((report) => (
//                       <ReportHistoryCard key={report.id} report={report} />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-14 rounded-xl border-2 border-dashed border-slate-100">
//                     <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3">
//                       <FileText className="w-7 h-7 text-slate-300" />
//                     </div>
//                     <p className="text-slate-700 font-medium">No reports uploaded yet</p>
//                     <p className="text-sm text-slate-400 mt-1 mb-5">Upload your first medical report to get AI-assisted insights</p>
//                     <Link
//                       to="/upload"
//                       className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
//                     >
//                       <Upload className="w-4 h-4" />
//                       Upload Report
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               <DisclaimerBox variant="info" />
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Profile;









import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, FileText, Activity } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import ReportHistoryCard from "../components/ReportHistoryCard.jsx";
import ReportTimeline from "../components/ReportTimeline.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, profile, reports, isAuthenticated, fetchReports } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) fetchReports();
  }, [isAuthenticated, fetchReports]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-7 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-primary/20">
                <Activity className="h-3 w-3" />
                Patient Dashboard
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!</h1>
              <p className="text-slate-500 text-sm mt-0.5">Manage your medical reports and view analysis history</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-slate-700">{reports.length} Report{reports.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">

            {/* LEFT */}
            <div className="lg:col-span-1 space-y-4">
              <ProfileCard user={user} profile={profile ?? {}} />

              <Link
                to="/upload"
                className="flex items-center justify-center gap-2.5 w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                <Upload className="w-4 h-4" />
                Upload New Report
              </Link>

              <ReportTimeline reports={reports} />
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-slate-800">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    Medical Report History
                  </h2>
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                    {reports.length} report{reports.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {reports.length > 0 ? (
                  <div className="grid gap-3">
                    {reports.map((report) => (
                      <ReportHistoryCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-14 rounded-xl border-2 border-dashed border-slate-100">
                    <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-7 h-7 text-slate-300" />
                    </div>
                    <p className="text-slate-700 font-medium">No reports uploaded yet</p>
                    <p className="text-sm text-slate-400 mt-1 mb-5">Upload your first medical report to get AI-assisted insights</p>
                    <Link
                      to="/upload"
                      className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Report
                    </Link>
                  </div>
                )}
              </div>

              <DisclaimerBox variant="info" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
