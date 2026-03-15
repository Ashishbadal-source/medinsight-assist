// // import { useParams, useNavigate, Link } from "react-router-dom";
// // import { useRef, useState, useEffect } from "react";
// // import html2pdf from "html2pdf.js";
// // import { Download, Loader2, ArrowLeft, Calendar, User } from "lucide-react";
// // import Navbar from "../components/Navbar.jsx";
// // import Footer from "../components/Footer.jsx";
// // import ReportSummaryCard from "../components/ReportSummaryCard.jsx";
// // import FindingsTable from "../components/FindingsTable.jsx";
// // import ConditionCard from "../components/ConditionCard.jsx";
// // import RecommendationList from "../components/RecommendationList.jsx";
// // import ImagingResultCard from "../components/ImagingResultCard.jsx";
// // import DisclaimerBox from "../components/DisclaimerBox.jsx";
// // import { useAuth } from "../context/AuthContext.jsx";

// // // ✅ Dummy report (until backend AI is ready)
// // const getReportData = () => ({
// //   report: {
// //     type: "Complete Blood Count (CBC)",
// //     date: "December 19, 2064",
// //     confidence: 87,
// //   },
// //   findings: [
// //     { testName: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "12.0-16.0", status: "Normal" },
// //     { testName: "White Blood Cells", value: "11.5", unit: "K/uL", normalRange: "4.5-11.0", status: "High" },
// //     { testName: "Platelet Count", value: "245", unit: "K/uL", normalRange: "150-400", status: "Normal" },
// //   ],
// //   conditions: [
// //     {
// //       name: "Possible Hypertension",
// //       probability: 72,
// //       reason: "Elevated BP readings suggest cardiovascular risk.",
// //     },
// //   ],
// //   recommendations: [
// //     { type: "specialist", text: "Consult a cardiologist", priority: "high" },
// //     { type: "lifestyle", text: "Reduce sodium intake", priority: "normal" },
// //   ],
// //   imaging: {
// //     imageUrl: null,
// //     hasHeatmap: true,
// //     analysis: "No major abnormalities detected.",
// //     type: "X-ray",
// //     region: "Chest",
// //     qualityScore: "Good",
// //     highlightedRegions: [],
// //   },
// // });

// // const ReportDetails = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const reportRef = useRef(null);
// //   const { user, isAuthenticated, isLoading } = useAuth();
// //   const [isExporting, setIsExporting] = useState(false);

// //   // ✅ Correct redirect logic
// //   useEffect(() => {
// //     if (!isLoading && !isAuthenticated) {
// //       navigate("/login");
// //     }
// //   }, [isAuthenticated, isLoading, navigate]);

// //   if (isLoading) return null;

// //   const reportData = getReportData();

// //   const handleExportPDF = async () => {
// //     if (!reportRef.current) return;

// //     setIsExporting(true);

// //     try {
// //       await html2pdf()
// //         .set({
// //           filename: `Medical_Report_${id}.pdf`,
// //           html2canvas: { scale: 2 },
// //           jsPDF: { format: "a4", orientation: "portrait" },
// //         })
// //         .from(reportRef.current)
// //         .save();
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setIsExporting(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col bg-background">
// //       <Navbar />

// //       <main className="flex-1 py-8 px-4">
// //         <div className="max-w-7xl mx-auto">
// //           <Link
// //             to="/profile"
// //             className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
// //           >
// //             <ArrowLeft className="w-4 h-4" />
// //             Back to Dashboard
// //           </Link>

// //           <div className="flex justify-between items-center mb-6">
// //             <div>
// //               <h1 className="text-2xl font-bold">{reportData.report.type} Analysis</h1>
// //               <div className="flex items-center gap-4 text-sm text-muted-foreground">
// //                 <span className="flex items-center gap-1">
// //                   <Calendar className="w-4 h-4" />
// //                   {reportData.report.date}
// //                 </span>
// //                 <span className="flex items-center gap-1">
// //                   <User className="w-4 h-4" />
// //                   {user?.email}
// //                 </span>
// //               </div>
// //             </div>

// //             <button
// //               onClick={handleExportPDF}
// //               disabled={isExporting}
// //               className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
// //             >
// //               {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
// //               Export PDF
// //             </button>
// //           </div>

// //           <div ref={reportRef} className="grid lg:grid-cols-3 gap-6">
// //             <div className="space-y-6">
// //               <ReportSummaryCard reportData={reportData.report} />
// //               <RecommendationList recommendations={reportData.recommendations} />
// //             </div>

// //             <div className="lg:col-span-2 space-y-6">
// //               <FindingsTable findings={reportData.findings} />
// //               <ConditionCard conditions={reportData.conditions} />
// //               <ImagingResultCard imagingData={reportData.imaging} />
// //             </div>
// //           </div>

// //           <div className="mt-8">
// //             <DisclaimerBox variant="warning" />
// //           </div>
// //         </div>
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default ReportDetails;















// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useRef, useState, useEffect } from "react";
// import html2pdf from "html2pdf.js";
// import { Download, Loader2, ArrowLeft, Calendar, User, Activity } from "lucide-react";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import DisclaimerBox from "../components/DisclaimerBox.jsx";
// import { useAuth } from "../context/AuthContext.jsx";
// import { supabase } from "../lib/supabase.js";

// const ReportDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const reportRef = useRef(null);
//   const { user, isAuthenticated } = useAuth();
//   const [isExporting, setIsExporting] = useState(false);
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isAuthenticated) { navigate("/login"); return; }
//     fetchReport();
//   }, [id, isAuthenticated]);

//   const fetchReport = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("reports")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error || !data) {
//       navigate("/profile");
//     } else {
//       setReport(data);
//     }
//     setLoading(false);
//   };

//   const handleExportPDF = async () => {
//     if (!reportRef.current) return;
//     setIsExporting(true);
//     try {
//       await html2pdf()
//         .set({
//           filename: `ECG_Report_${id}.pdf`,
//           html2canvas: { scale: 2 },
//           jsPDF: { format: "a4", orientation: "portrait" },
//         })
//         .from(reportRef.current)
//         .save();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <Loader2 className="animate-spin w-8 h-8 text-primary" />
//     </div>
//   );

//   if (!report) return null;

//   const analysis = report.analysis_json;

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />

//       <main className="flex-1 py-8 px-4">
//         <div className="max-w-4xl mx-auto">

//           <Link
//             to="/profile"
//             className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Profile
//           </Link>

//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h1 className="text-2xl font-bold">{report.report_type} Report</h1>
//               <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
//                 <span className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4" />
//                   {new Date(report.created_at).toLocaleDateString("en-US", {
//                     year: "numeric", month: "long", day: "numeric"
//                   })}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <User className="w-4 h-4" />
//                   {user?.email}
//                 </span>
//               </div>
//             </div>

//             <button
//               onClick={handleExportPDF}
//               disabled={isExporting}
//               className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
//             >
//               {isExporting
//                 ? <Loader2 className="animate-spin w-4 h-4" />
//                 : <Download className="w-4 h-4" />}
//               Export PDF
//             </button>
//           </div>

//           <div ref={reportRef} className="space-y-4">

//             {/* ── Basic Info ── */}
//             <div className="bg-card border border-border rounded-xl p-6">
//               <h2 className="font-semibold text-lg mb-4">Report Details</h2>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="text-muted-foreground">Report Type</p>
//                   <p className="font-medium">{report.report_type}</p>
//                 </div>
//                 <div>
//                   <p className="text-muted-foreground">Uploaded On</p>
//                   <p className="font-medium">
//                     {new Date(report.created_at).toLocaleDateString()}
//                   </p>
//                 </div>
//                 {report.age && (
//                   <div>
//                     <p className="text-muted-foreground">Patient Age</p>
//                     <p className="font-medium">{report.age} years</p>
//                   </div>
//                 )}
//                 {report.gender && (
//                   <div>
//                     <p className="text-muted-foreground">Gender</p>
//                     <p className="font-medium">{report.gender}</p>
//                   </div>
//                 )}
//               </div>
//               {report.symptoms && (
//                 <div className="mt-4">
//                   <p className="text-muted-foreground text-sm mb-1">Symptoms / Notes</p>
//                   <p className="text-sm bg-secondary rounded-lg p-3">{report.symptoms}</p>
//                 </div>
//               )}
//             </div>

//             {/* ── ECG Analysis ── */}
//             {analysis ? (
//               <>
//                 {/* Main Diagnosis */}
//                 <div className="bg-card border border-border rounded-xl p-6">
//                   <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
//                     <Activity className="w-5 h-5 text-primary" />
//                     Primary Diagnosis
//                   </h2>

//                   <div className="flex items-center justify-between bg-primary/10 rounded-lg p-4">
//                     <div>
//                       <p className="text-2xl font-bold text-primary">
//                         {analysis.subclass_prediction?.label}
//                       </p>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         {analysis.interpretation?.final_diagnosis}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-3xl font-bold text-primary">
//                         {Math.round(analysis.subclass_prediction?.confidence * 100)}%
//                       </p>
//                       <p className="text-xs text-muted-foreground">Confidence</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Interpretation */}
//                 <div className="bg-card border border-border rounded-xl p-6">
//                   <h2 className="font-semibold text-lg mb-4">Clinical Interpretation</h2>
//                   <div className="grid grid-cols-1 gap-3 text-sm">
//                     {analysis.interpretation?.rhythm && (
//                       <div className="flex gap-3 p-3 bg-secondary rounded-lg">
//                         <span className="text-muted-foreground w-28 shrink-0">Rhythm</span>
//                         <span className="font-medium">{analysis.interpretation.rhythm}</span>
//                       </div>
//                     )}
//                     {analysis.interpretation?.conduction && (
//                       <div className="flex gap-3 p-3 bg-secondary rounded-lg">
//                         <span className="text-muted-foreground w-28 shrink-0">Conduction</span>
//                         <span className="font-medium">{analysis.interpretation.conduction}</span>
//                       </div>
//                     )}
//                     {analysis.interpretation?.ischemia && (
//                       <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
//                         <span className="text-muted-foreground w-28 shrink-0">Ischemia</span>
//                         <span className="font-medium text-red-700">{analysis.interpretation.ischemia}</span>
//                       </div>
//                     )}
//                     {analysis.interpretation?.hypertrophy && (
//                       <div className="flex gap-3 p-3 bg-secondary rounded-lg">
//                         <span className="text-muted-foreground w-28 shrink-0">Hypertrophy</span>
//                         <span className="font-medium">{analysis.interpretation.hypertrophy}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* SCP Findings */}
//                 {analysis.scp_findings?.length > 0 && (
//                   <div className="bg-card border border-border rounded-xl p-6">
//                     <h2 className="font-semibold text-lg mb-4">Detailed ECG Findings</h2>
//                     <div className="space-y-2">
//                       {analysis.scp_findings.map((finding, i) => (
//                         <div
//                           key={i}
//                           className="flex items-center justify-between p-3 bg-secondary rounded-lg text-sm"
//                         >
//                           <div>
//                             <span className="font-medium">{finding.code}</span>
//                             <span className="text-muted-foreground ml-2">
//                               — {finding.interpretation}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
//                               <div
//                                 className="h-full bg-primary rounded-full"
//                                 style={{ width: `${Math.round(finding.confidence * 100)}%` }}
//                               />
//                             </div>
//                             <span className="text-xs font-medium w-10 text-right">
//                               {Math.round(finding.confidence * 100)}%
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </>
//             ) : (
//               // Non-ECG ya analysis pending
//               <div className="bg-secondary/50 border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
//                 🤖 AI Analysis will appear here once the model is integrated for this report type
//               </div>
//             )}

//             <DisclaimerBox variant="warning" />
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default ReportDetails;

































// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useRef, useState, useEffect } from "react";
// import html2pdf from "html2pdf.js";
// import { Download, Loader2, ArrowLeft, Calendar, User, Activity } from "lucide-react";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import DisclaimerBox from "../components/DisclaimerBox.jsx";
// import { useAuth } from "../context/AuthContext.jsx";
// import { supabase } from "../lib/supabase.js";

// const ReportDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const reportRef = useRef(null);
//   const { user, isAuthenticated } = useAuth();
//   const [isExporting, setIsExporting] = useState(false);
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isAuthenticated) { navigate("/login"); return; }
//     fetchReport();
//   }, [id, isAuthenticated]);

//   const fetchReport = async () => {
//     setLoading(true);
//     const { data, error } = await supabase.from("reports").select("*").eq("id", id).single();
//     if (error || !data) { navigate("/profile"); } else { setReport(data); }
//     setLoading(false);
//   };

//   const handleExportPDF = async () => {
//     if (!reportRef.current) return;
//     setIsExporting(true);
//     try {
//       await html2pdf().set({
//         filename: `ECG_Report_${id}.pdf`,
//         html2canvas: { scale: 2 },
//         jsPDF: { format: "a4", orientation: "portrait" },
//       }).from(reportRef.current).save();
//     } catch (err) { console.error(err); } finally { setIsExporting(false); }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
//       <div className="flex flex-col items-center gap-3">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
//         <p className="text-sm text-slate-500">Loading report...</p>
//       </div>
//     </div>
//   );

//   if (!report) return null;
//   const analysis = report.analysis_json;

//   return (
//     <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
//       <Navbar />
//       <main className="flex-1 py-8 px-4">
//         <div className="max-w-4xl mx-auto">

//           <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
//             <ArrowLeft className="w-4 h-4" />
//             Back to Profile
//           </Link>

//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-primary/20">
//                 <Activity className="h-3 w-3" />
//                 {report.report_type}
//               </div>
//               <h1 className="text-2xl font-bold text-slate-900">{report.report_type} Report</h1>
//               <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
//                 <span className="flex items-center gap-1.5">
//                   <Calendar className="w-3.5 h-3.5" />
//                   {new Date(report.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <User className="w-3.5 h-3.5" />
//                   {user?.email}
//                 </span>
//               </div>
//             </div>
//             <button onClick={handleExportPDF} disabled={isExporting}
//               className="bg-primary text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50">
//               {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
//               Export PDF
//             </button>
//           </div>

//           <div ref={reportRef} className="space-y-4">

//             {/* Basic Info */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//               <h2 className="font-semibold text-slate-800 mb-4">Report Details</h2>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div className="p-3 bg-slate-50 rounded-xl">
//                   <p className="text-slate-400 text-xs mb-1">Report Type</p>
//                   <p className="font-semibold text-slate-800">{report.report_type}</p>
//                 </div>
//                 <div className="p-3 bg-slate-50 rounded-xl">
//                   <p className="text-slate-400 text-xs mb-1">Uploaded On</p>
//                   <p className="font-semibold text-slate-800">{new Date(report.created_at).toLocaleDateString()}</p>
//                 </div>
//                 {report.age && (
//                   <div className="p-3 bg-slate-50 rounded-xl">
//                     <p className="text-slate-400 text-xs mb-1">Patient Age</p>
//                     <p className="font-semibold text-slate-800">{report.age} years</p>
//                   </div>
//                 )}
//                 {report.gender && (
//                   <div className="p-3 bg-slate-50 rounded-xl">
//                     <p className="text-slate-400 text-xs mb-1">Gender</p>
//                     <p className="font-semibold text-slate-800">{report.gender}</p>
//                   </div>
//                 )}
//               </div>
//               {report.symptoms && (
//                 <div className="mt-4">
//                   <p className="text-slate-400 text-xs mb-2">Symptoms / Notes</p>
//                   <p className="text-sm bg-slate-50 rounded-xl p-3 text-slate-700">{report.symptoms}</p>
//                 </div>
//               )}
//             </div>

//             {/* ECG Analysis */}
//             {analysis ? (
//               <>
//                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//                   <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                     <div className="p-1.5 bg-primary/10 rounded-lg">
//                       <Activity className="w-4 h-4 text-primary" />
//                     </div>
//                     Primary Diagnosis
//                   </h2>
//                   <div className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-xl p-5">
//                     <div>
//                       <p className="text-2xl font-bold text-primary">{analysis.subclass_prediction?.label}</p>
//                       <p className="text-sm text-slate-500 mt-1">{analysis.interpretation?.final_diagnosis}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-3xl font-bold text-primary">{Math.round(analysis.subclass_prediction?.confidence * 100)}%</p>
//                       <p className="text-xs text-slate-400">Confidence</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//                   <h2 className="font-semibold text-slate-800 mb-4">Clinical Interpretation</h2>
//                   <div className="grid grid-cols-1 gap-2 text-sm">
//                     {[
//                       { label: "Rhythm", value: analysis.interpretation?.rhythm, warning: false },
//                       { label: "Conduction", value: analysis.interpretation?.conduction, warning: false },
//                       { label: "Ischemia", value: analysis.interpretation?.ischemia, warning: true },
//                       { label: "Hypertrophy", value: analysis.interpretation?.hypertrophy, warning: false },
//                     ].filter(i => i.value).map((item, i) => (
//                       <div key={i} className={`flex gap-3 p-3 rounded-xl ${item.warning ? "bg-red-50 border border-red-100" : "bg-slate-50"}`}>
//                         <span className={`text-xs font-medium w-24 shrink-0 pt-0.5 ${item.warning ? "text-red-400" : "text-slate-400"}`}>{item.label}</span>
//                         <span className={`text-sm font-medium ${item.warning ? "text-red-700" : "text-slate-700"}`}>{item.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {analysis.scp_findings?.length > 0 && (
//                   <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//                     <h2 className="font-semibold text-slate-800 mb-4">Detailed ECG Findings</h2>
//                     <div className="space-y-2">
//                       {analysis.scp_findings.map((finding, i) => (
//                         <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm">
//                           <div>
//                             <span className="font-medium text-slate-800">{finding.code}</span>
//                             <span className="text-slate-400 ml-2">— {finding.interpretation}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
//                               <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(finding.confidence * 100)}%` }} />
//                             </div>
//                             <span className="text-xs font-semibold text-slate-600 w-10 text-right">{Math.round(finding.confidence * 100)}%</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
//                 🤖 AI Analysis will appear here once the model is integrated for this report type
//               </div>
//             )}

//             <DisclaimerBox variant="warning" />
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ReportDetails;





















// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useRef, useState, useEffect } from "react";
// import html2pdf from "html2pdf.js";
// import { Download, Loader2, ArrowLeft, Calendar, User, Activity } from "lucide-react";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import DisclaimerBox from "../components/DisclaimerBox.jsx";
// import { useAuth } from "../context/AuthContext.jsx";
// import { supabase } from "../lib/supabase.js";

// const ReportDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const reportRef = useRef(null);
//   const { user, isAuthenticated } = useAuth();
//   const [isExporting, setIsExporting] = useState(false);
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isAuthenticated) { navigate("/login"); return; }
//     fetchReport();
//   }, [id, isAuthenticated]);

//   const fetchReport = async () => {
//     setLoading(true);
//     const { data, error } = await supabase.from("reports").select("*").eq("id", id).single();
//     if (error || !data) { navigate("/profile"); } else { setReport(data); }
//     setLoading(false);
//   };

//   const handleExportPDF = async () => {
//     if (!reportRef.current) return;
//     setIsExporting(true);
//     try {
//       await html2pdf().set({
//         filename: `Report_${id}.pdf`,
//         html2canvas: { scale: 2 },
//         jsPDF: { format: "a4", orientation: "portrait" },
//       }).from(reportRef.current).save();
//     } catch (err) { console.error(err); } finally { setIsExporting(false); }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
//       <div className="flex flex-col items-center gap-3">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
//         <p className="text-sm text-slate-500">Loading report...</p>
//       </div>
//     </div>
//   );

//   if (!report) return null;
//   const analysis = report.analysis_json;

//   const statusColor = (status) => {
//     if (status === "HIGH") return "bg-red-50 border border-red-100 text-red-700";
//     if (status === "LOW") return "bg-amber-50 border border-amber-100 text-amber-700";
//     return "bg-emerald-50 border border-emerald-100 text-emerald-700";
//   };

//   const statusBadge = (status) => {
//     if (status === "HIGH") return "bg-red-100 text-red-600";
//     if (status === "LOW") return "bg-amber-100 text-amber-600";
//     return "bg-emerald-100 text-emerald-600";
//   };

//   const severityColor = (severity) => {
//     if (severity === "high") return "text-red-600 bg-red-50 border-red-100";
//     if (severity === "mild") return "text-amber-600 bg-amber-50 border-amber-100";
//     return "text-emerald-600 bg-emerald-50 border-emerald-100";
//   };

//   return (
//     <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
//       <Navbar />
//       <main className="flex-1 py-8 px-4">
//         <div className="max-w-4xl mx-auto">

//           <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
//             <ArrowLeft className="w-4 h-4" />
//             Back to Profile
//           </Link>

//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-primary/20">
//                 <Activity className="h-3 w-3" />
//                 {report.report_type}
//               </div>
//               <h1 className="text-2xl font-bold text-slate-900">{report.report_type} Report</h1>
//               <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
//                 <span className="flex items-center gap-1.5">
//                   <Calendar className="w-3.5 h-3.5" />
//                   {new Date(report.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <User className="w-3.5 h-3.5" />
//                   {user?.email}
//                 </span>
//               </div>
//             </div>
//             <button onClick={handleExportPDF} disabled={isExporting}
//               className="bg-primary text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50">
//               {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
//               Export PDF
//             </button>
//           </div>

//           <div ref={reportRef} className="space-y-4">

//             {/* Basic Info */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//               <h2 className="font-semibold text-slate-800 mb-4">Report Details</h2>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div className="p-3 bg-slate-50 rounded-xl">
//                   <p className="text-slate-400 text-xs mb-1">Report Type</p>
//                   <p className="font-semibold text-slate-800">{report.report_type}</p>
//                 </div>
//                 <div className="p-3 bg-slate-50 rounded-xl">
//                   <p className="text-slate-400 text-xs mb-1">Uploaded On</p>
//                   <p className="font-semibold text-slate-800">{new Date(report.created_at).toLocaleDateString()}</p>
//                 </div>
//                 {report.age && (
//                   <div className="p-3 bg-slate-50 rounded-xl">
//                     <p className="text-slate-400 text-xs mb-1">Patient Age</p>
//                     <p className="font-semibold text-slate-800">{report.age} years</p>
//                   </div>
//                 )}
//                 {report.gender && (
//                   <div className="p-3 bg-slate-50 rounded-xl">
//                     <p className="text-slate-400 text-xs mb-1">Gender</p>
//                     <p className="font-semibold text-slate-800">{report.gender}</p>
//                   </div>
//                 )}
//               </div>
//               {report.symptoms && (
//                 <div className="mt-4">
//                   <p className="text-slate-400 text-xs mb-2">Symptoms / Notes</p>
//                   <p className="text-sm bg-slate-50 rounded-xl p-3 text-slate-700">{report.symptoms}</p>
//                 </div>
//               )}
//             </div>

//             {/* Blood Test Analysis */}
//             {report.report_type === "Blood Test" && analysis ? (
//               <>
//                 {/* Summary */}
//                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//                   <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                     <div className="p-1.5 bg-primary/10 rounded-lg">
//                       <Activity className="w-4 h-4 text-primary" />
//                     </div>
//                     Overall Summary
//                   </h2>
//                   <div className={`flex items-center justify-between rounded-xl p-5 border ${severityColor(analysis.severity)}`}>
//                     <div>
//                       <p className="text-lg font-bold">{analysis.summary}</p>
//                       <p className="text-sm mt-1 opacity-70">{analysis.total_count} parameters analyzed</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-3xl font-bold">{analysis.abnormal_count}</p>
//                       <p className="text-xs opacity-70">Abnormal</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Findings Table */}
//                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//                   <h2 className="font-semibold text-slate-800 mb-4">CBC Findings</h2>
//                   <div className="space-y-2">
//                     {analysis.findings?.map((f, i) => (
//                       <div key={i} className={`flex items-center justify-between p-3 rounded-xl text-sm ${statusColor(f.status)}`}>
//                         <div className="flex items-center gap-3">
//                           <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge(f.status)}`}>
//                             {f.status}
//                           </span>
//                           <span className="font-medium">{f.name}</span>
//                         </div>
//                         <div className="text-right">
//                           <span className="font-bold">{f.value} {f.unit}</span>
//                           <p className="text-xs opacity-60">Normal: {f.normal_range}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>

//             ) : report.report_type === "ECG" && analysis ? (
//               <>
//                 {/* ECG Analysis */}
//                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//                   <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                     <div className="p-1.5 bg-primary/10 rounded-lg">
//                       <Activity className="w-4 h-4 text-primary" />
//                     </div>
//                     Primary Diagnosis
//                   </h2>
//                   <div className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-xl p-5">
//                     <div>
//                       <p className="text-2xl font-bold text-primary">{analysis.subclass_prediction?.label}</p>
//                       <p className="text-sm text-slate-500 mt-1">{analysis.interpretation?.final_diagnosis}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-3xl font-bold text-primary">{Math.round(analysis.subclass_prediction?.confidence * 100)}%</p>
//                       <p className="text-xs text-slate-400">Confidence</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//                   <h2 className="font-semibold text-slate-800 mb-4">Clinical Interpretation</h2>
//                   <div className="grid grid-cols-1 gap-2 text-sm">
//                     {[
//                       { label: "Rhythm", value: analysis.interpretation?.rhythm, warning: false },
//                       { label: "Conduction", value: analysis.interpretation?.conduction, warning: false },
//                       { label: "Ischemia", value: analysis.interpretation?.ischemia, warning: true },
//                       { label: "Hypertrophy", value: analysis.interpretation?.hypertrophy, warning: false },
//                     ].filter(i => i.value).map((item, i) => (
//                       <div key={i} className={`flex gap-3 p-3 rounded-xl ${item.warning ? "bg-red-50 border border-red-100" : "bg-slate-50"}`}>
//                         <span className={`text-xs font-medium w-24 shrink-0 pt-0.5 ${item.warning ? "text-red-400" : "text-slate-400"}`}>{item.label}</span>
//                         <span className={`text-sm font-medium ${item.warning ? "text-red-700" : "text-slate-700"}`}>{item.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {analysis.scp_findings?.length > 0 && (
//                   <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
//                     <h2 className="font-semibold text-slate-800 mb-4">Detailed ECG Findings</h2>
//                     <div className="space-y-2">
//                       {analysis.scp_findings.map((finding, i) => (
//                         <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm">
//                           <div>
//                             <span className="font-medium text-slate-800">{finding.code}</span>
//                             <span className="text-slate-400 ml-2">— {finding.interpretation}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
//                               <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(finding.confidence * 100)}%` }} />
//                             </div>
//                             <span className="text-xs font-semibold text-slate-600 w-10 text-right">{Math.round(finding.confidence * 100)}%</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
//                 🤖 AI Analysis will appear here once the model is integrated for this report type
//               </div>
//             )}

//             <DisclaimerBox variant="warning" />
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default ReportDetails;


















import { useParams, useNavigate, Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { Download, Loader2, ArrowLeft, Calendar, User, Activity } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    fetchReport();
  }, [id, isAuthenticated]);

  const fetchReport = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("reports").select("*").eq("id", id).single();
    if (error || !data) { navigate("/profile"); } else { setReport(data); }
    setLoading(false);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      await html2pdf().set({
        filename: `Report_${id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4", orientation: "portrait" },
      }).from(reportRef.current).save();
    } catch (err) { console.error(err); } finally { setIsExporting(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        <p className="text-sm text-slate-500">Loading report...</p>
      </div>
    </div>
  );

  if (!report) return null;
  const analysis = report.analysis_json;

  const statusColor = (status) => {
    if (status === "HIGH") return "bg-red-50 border border-red-100 text-red-700";
    if (status === "LOW") return "bg-amber-50 border border-amber-100 text-amber-700";
    return "bg-emerald-50 border border-emerald-100 text-emerald-700";
  };

  const statusBadge = (status) => {
    if (status === "HIGH") return "bg-red-100 text-red-600";
    if (status === "LOW") return "bg-amber-100 text-amber-600";
    return "bg-emerald-100 text-emerald-600";
  };

  const severityColor = (severity) => {
    if (severity === "high") return "text-red-600 bg-red-50 border-red-100";
    if (severity === "mild") return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  };

  const xrayBarColor = (prob) => {
    if (prob >= 70) return "bg-red-500";
    if (prob >= 40) return "bg-amber-400";
    return "bg-emerald-400";
  };

  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>

          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-primary/20">
                <Activity className="h-3 w-3" />
                {report.report_type}
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{report.report_type} Report</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(report.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {user?.email}
                </span>
              </div>
            </div>
            <button onClick={handleExportPDF} disabled={isExporting}
              className="bg-primary text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50">
              {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
              Export PDF
            </button>
          </div>

          <div ref={reportRef} className="space-y-4">

            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Report Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400 text-xs mb-1">Report Type</p>
                  <p className="font-semibold text-slate-800">{report.report_type}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400 text-xs mb-1">Uploaded On</p>
                  <p className="font-semibold text-slate-800">{new Date(report.created_at).toLocaleDateString()}</p>
                </div>
                {report.age && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-xs mb-1">Patient Age</p>
                    <p className="font-semibold text-slate-800">{report.age} years</p>
                  </div>
                )}
                {report.gender && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-slate-400 text-xs mb-1">Gender</p>
                    <p className="font-semibold text-slate-800">{report.gender}</p>
                  </div>
                )}
              </div>
              {report.symptoms && (
                <div className="mt-4">
                  <p className="text-slate-400 text-xs mb-2">Symptoms / Notes</p>
                  <p className="text-sm bg-slate-50 rounded-xl p-3 text-slate-700">{report.symptoms}</p>
                </div>
              )}
            </div>

            {/* Blood Test */}
            {report.report_type === "Blood Test" && analysis ? (
              <>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg"><Activity className="w-4 h-4 text-primary" /></div>
                    Overall Summary
                  </h2>
                  <div className={`flex items-center justify-between rounded-xl p-5 border ${severityColor(analysis.severity)}`}>
                    <div>
                      <p className="text-lg font-bold">{analysis.summary}</p>
                      <p className="text-sm mt-1 opacity-70">{analysis.total_count} parameters analyzed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{analysis.abnormal_count}</p>
                      <p className="text-xs opacity-70">Abnormal</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 mb-4">CBC Findings</h2>
                  <div className="space-y-2">
                    {analysis.findings?.map((f, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl text-sm ${statusColor(f.status)}`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge(f.status)}`}>{f.status}</span>
                          <span className="font-medium">{f.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{f.value} {f.unit}</span>
                          <p className="text-xs opacity-60">Normal: {f.normal_range}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>

            ) : report.report_type === "ECG" && analysis ? (
              <>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg"><Activity className="w-4 h-4 text-primary" /></div>
                    Primary Diagnosis
                  </h2>
                  <div className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-xl p-5">
                    <div>
                      <p className="text-2xl font-bold text-primary">{analysis.subclass_prediction?.label}</p>
                      <p className="text-sm text-slate-500 mt-1">{analysis.interpretation?.final_diagnosis}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">{Math.round(analysis.subclass_prediction?.confidence * 100)}%</p>
                      <p className="text-xs text-slate-400">Confidence</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 mb-4">Clinical Interpretation</h2>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {[
                      { label: "Rhythm", value: analysis.interpretation?.rhythm, warning: false },
                      { label: "Conduction", value: analysis.interpretation?.conduction, warning: false },
                      { label: "Ischemia", value: analysis.interpretation?.ischemia, warning: true },
                      { label: "Hypertrophy", value: analysis.interpretation?.hypertrophy, warning: false },
                    ].filter(i => i.value).map((item, i) => (
                      <div key={i} className={`flex gap-3 p-3 rounded-xl ${item.warning ? "bg-red-50 border border-red-100" : "bg-slate-50"}`}>
                        <span className={`text-xs font-medium w-24 shrink-0 pt-0.5 ${item.warning ? "text-red-400" : "text-slate-400"}`}>{item.label}</span>
                        <span className={`text-sm font-medium ${item.warning ? "text-red-700" : "text-slate-700"}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {analysis.scp_findings?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-800 mb-4">Detailed ECG Findings</h2>
                    <div className="space-y-2">
                      {analysis.scp_findings.map((finding, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm">
                          <div>
                            <span className="font-medium text-slate-800">{finding.code}</span>
                            <span className="text-slate-400 ml-2">— {finding.interpretation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(finding.confidence * 100)}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-slate-600 w-10 text-right">{Math.round(finding.confidence * 100)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>

            ) : report.report_type === "X-Ray" && analysis ? (
              <>
                {/* X-Ray Summary */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg"><Activity className="w-4 h-4 text-primary" /></div>
                    Overall Summary
                  </h2>
                  <div className={`flex items-center justify-between rounded-xl p-5 border ${severityColor(analysis.severity)}`}>
                    <div>
                      <p className="text-lg font-bold">{analysis.summary}</p>
                      <p className="text-sm mt-1 opacity-70">{analysis.total_conditions} conditions screened</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{analysis.detected_count}</p>
                      <p className="text-xs opacity-70">Detected</p>
                    </div>
                  </div>
                </div>

                {/* Detected Conditions */}
                {analysis.detected_conditions?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-800 mb-4">⚠️ Detected Conditions</h2>
                    <div className="space-y-3">
                      {analysis.detected_conditions.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl text-sm">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">DETECTED</span>
                            <span className="font-medium text-red-800">{c.condition}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-red-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${xrayBarColor(c.probability)}`} style={{ width: `${c.probability}%` }} />
                            </div>
                            <span className="text-xs font-bold text-red-700 w-10 text-right">{c.probability}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Conditions */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 mb-4">All Screened Conditions</h2>
                  <div className="space-y-2">
                    {analysis.findings?.map((c, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl text-sm ${c.detected ? "bg-red-50 border border-red-100" : "bg-slate-50"}`}>
                        <span className={`font-medium ${c.detected ? "text-red-800" : "text-slate-600"}`}>{c.condition}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${xrayBarColor(c.probability)}`} style={{ width: `${c.probability}%` }} />
                          </div>
                          <span className={`text-xs font-semibold w-10 text-right ${c.detected ? "text-red-600" : "text-slate-400"}`}>{c.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>

            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
                🤖 AI Analysis will appear here once the model is integrated for this report type
              </div>
            )}

            <DisclaimerBox variant="warning" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportDetails;