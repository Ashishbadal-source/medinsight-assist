
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
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      navigate("/profile");
    } else {
      setReport(data);
    }
    setLoading(false);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      await html2pdf()
        .set({
          filename: `ECG_Report_${id}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { format: "a4", orientation: "portrait" },
        })
        .from(reportRef.current)
        .save();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-8 h-8 text-primary" />
    </div>
  );

  if (!report) return null;

  const analysis = report.analysis_json;
  const llm = analysis?.llm_output;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">

          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{report.report_type} Report</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(report.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user?.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {isExporting
                ? <Loader2 className="animate-spin w-4 h-4" />
                : <Download className="w-4 h-4" />}
              Export PDF
            </button>
          </div>

          <div ref={reportRef} className="space-y-4">

            {/* ── Basic Info ── */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Report Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Report Type</p>
                  <p className="font-medium">{report.report_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded On</p>
                  <p className="font-medium">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
                {report.age && (
                  <div>
                    <p className="text-muted-foreground">Patient Age</p>
                    <p className="font-medium">{report.age} years</p>
                  </div>
                )}
                {report.gender && (
                  <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-medium">{report.gender}</p>
                  </div>
                )}
              </div>
              {report.symptoms && (
                <div className="mt-4">
                  <p className="text-muted-foreground text-sm mb-1">Symptoms / Notes</p>
                  <p className="text-sm bg-secondary rounded-lg p-3">{report.symptoms}</p>
                </div>
              )}
            </div>

            {/* ── ECG Analysis ── */}
            {analysis ? (
              <>
                {/* ── Primary Diagnosis ── */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Primary Diagnosis
                  </h2>

                  <div className="flex items-center justify-between bg-primary/10 rounded-lg p-4">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {llm?.Diagnosis ?? "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {llm?.LLM_Interpretation
                          ? llm.LLM_Interpretation.slice(0, 120) + "..."
                          : "No interpretation available"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">
                        {analysis.confidence
                          ? Math.round(analysis.confidence * 100) + "%"
                          : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                </div>

                {/* ── Clinical Interpretation ── */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-semibold text-lg mb-4">Clinical Interpretation</h2>
                  <div className="grid grid-cols-1 gap-3 text-sm">

                    {llm?.HeartRate && (
                      <div className="flex gap-3 p-3 bg-secondary rounded-lg">
                        <span className="text-muted-foreground w-28 shrink-0">Heart Rate</span>
                        <span className="font-medium">{llm.HeartRate}</span>
                      </div>
                    )}

                    {llm?.Rhythm && (
                      <div className="flex gap-3 p-3 bg-secondary rounded-lg">
                        <span className="text-muted-foreground w-28 shrink-0">Rhythm</span>
                        <span className="font-medium">{llm.Rhythm}</span>
                      </div>
                    )}

                    {llm?.ST_Elevation && (
                      <div className="flex gap-3 p-3 bg-secondary rounded-lg">
                        <span className="text-muted-foreground w-28 shrink-0">ST Elevation</span>
                        <span className="font-medium">{llm.ST_Elevation}</span>
                      </div>
                    )}

                    {llm?.LLM_Interpretation && (
                      <div className="flex gap-3 p-3 bg-secondary rounded-lg">
                        <span className="text-muted-foreground w-28 shrink-0">AI Analysis</span>
                        <span className="font-medium">{llm.LLM_Interpretation}</span>
                      </div>
                    )}

                  </div>
                </div>
              </>
            ) : (
              <div className="bg-secondary/50 border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
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