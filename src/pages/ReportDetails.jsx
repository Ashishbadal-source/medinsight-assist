// import { useParams, useNavigate, Link } from "react-router-dom";
// import { useRef, useState } from "react";
// import html2pdf from "html2pdf.js";
// import { Download, Loader2, ArrowLeft, Calendar, User } from "lucide-react";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import ReportSummaryCard from "../components/ReportSummaryCard.jsx";
// import FindingsTable from "../components/FindingsTable.jsx";
// import ConditionCard from "../components/ConditionCard.jsx";
// import RecommendationList from "../components/RecommendationList.jsx";
// import ImagingResultCard from "../components/ImagingResultCard.jsx";
// import DisclaimerBox from "../components/DisclaimerBox.jsx";
// import { useAuth } from "../context/AuthContext.jsx";

// // Dummy detailed report data
// const getReportData = (reportId) => ({
//   report: {
//     type: "Complete Blood Count (CBC)",
//     date: "December 18, 2024",
//     confidence: 87,
//   },
//   findings: [
//     { testName: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "12.0-16.0", status: "Normal" },
//     { testName: "White Blood Cells", value: "11.5", unit: "K/uL", normalRange: "4.5-11.0", status: "High" },
//     { testName: "Platelet Count", value: "245", unit: "K/uL", normalRange: "150-400", status: "Normal" },
//     { testName: "Red Blood Cells", value: "4.8", unit: "M/uL", normalRange: "4.5-5.5", status: "Normal" },
//     { testName: "Cholesterol", value: "215", unit: "mg/dL", normalRange: "< 200", status: "Borderline" },
//     { testName: "Blood Pressure", value: "145/92", unit: "mmHg", normalRange: "< 120/80", status: "High" },
//   ],
//   conditions: [
//     {
//       name: "Possible Hypertension",
//       probability: 72,
//       reason: "Elevated blood pressure readings (145/92 mmHg) and borderline cholesterol levels suggest cardiovascular risk.",
//     },
//     {
//       name: "Mild Infection or Inflammation",
//       probability: 58,
//       reason: "White blood cell count slightly elevated (11.5 K/uL) which may indicate an ongoing immune response.",
//     },
//     {
//       name: "Hyperlipidemia Risk",
//       probability: 45,
//       reason: "Borderline cholesterol levels (215 mg/dL) warrant lifestyle modifications and monitoring.",
//     },
//   ],
//   recommendations: [
//     { type: "specialist", text: "Consult a cardiologist for blood pressure evaluation", priority: "high" },
//     { type: "retest", text: "Repeat lipid panel in 4-6 weeks after dietary changes", priority: "normal" },
//     { type: "lifestyle", text: "Reduce sodium intake and increase physical activity", priority: "normal" },
//     { type: "retest", text: "Follow-up CBC to monitor white blood cell levels", priority: "normal" },
//   ],
//   imaging: {
//     imageUrl: null,
//     hasHeatmap: true,
//     analysis: "Chest X-ray shows clear lung fields with no significant abnormalities. Heart size within normal limits.",
//     type: "X-ray",
//     region: "Chest PA View",
//     qualityScore: "Good",
//     highlightedRegions: [],
//   },
// });

// const ReportDetails = () => {
//   const { id } = useParams();
//   const { user, getReportById, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const reportRef = useRef(null);
//   const [isExporting, setIsExporting] = useState(false);

//   // Redirect if not logged in
//   if (!isAuthenticated) {
//     navigate("/login");
//     return null;
//   }

//   const reportMeta = getReportById(id);
//   const reportData = getReportData(id);

//   if (!reportMeta) {
//     return (
//       <div className="min-h-screen flex flex-col bg-background">
//         <Navbar />
//         <main className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-foreground mb-4">Report Not Found</h1>
//             <Link to="/profile" className="text-primary hover:underline">
//               Return to Dashboard
//             </Link>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   const handleExportPDF = async () => {
//     if (!reportRef.current) return;

//     setIsExporting(true);

//     const options = {
//       margin: [10, 10, 10, 10],
//       filename: `MedInsight_Report_${id}_${new Date().toISOString().split("T")[0]}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true, logging: false },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       pagebreak: { mode: ["avoid-all", "css", "legacy"] },
//     };

//     try {
//       await html2pdf().set(options).from(reportRef.current).save();
//     } catch (error) {
//       console.error("PDF export failed:", error);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />

//       <main className="flex-1 py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <Link
//               to="/profile"
//               className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Dashboard
//             </Link>

//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
//                   {reportMeta.type} Analysis
//                 </h1>
//                 <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-1.5">
//                     <Calendar className="w-4 h-4" />
//                     <span>{reportMeta.date} at {reportMeta.time}</span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <User className="w-4 h-4" />
//                     <span>{user?.name}</span>
//                   </div>
//                   <span className="px-2 py-0.5 bg-muted rounded text-xs font-mono">
//                     ID: {id}
//                   </span>
//                 </div>
//               </div>
//               <button
//                 onClick={handleExportPDF}
//                 disabled={isExporting}
//                 className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isExporting ? (
//                   <>
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                     Exporting...
//                   </>
//                 ) : (
//                   <>
//                     <Download className="h-5 w-5" />
//                     Download PDF
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Report Content */}
//           <div ref={reportRef}>
//             {/* PDF Header */}
//             <div className="hidden print:block mb-6 pb-4 border-b border-border">
//               <h1 className="text-xl font-bold text-foreground">MedInsight AI - Medical Report Analysis</h1>
//               <p className="text-sm text-muted-foreground">
//                 Patient: {user?.name} | Report ID: {id} | Generated on {new Date().toLocaleDateString()}
//               </p>
//             </div>

//             <div className="grid lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-1 space-y-6">
//                 <ReportSummaryCard reportData={reportData.report} />
//                 <RecommendationList recommendations={reportData.recommendations} />
//               </div>

//               <div className="lg:col-span-2 space-y-6">
//                 <FindingsTable findings={reportData.findings} />
//                 <ConditionCard conditions={reportData.conditions} />
//                 <ImagingResultCard imagingData={reportData.imaging} />
//               </div>
//             </div>

//             <div className="mt-8">
//               <DisclaimerBox variant="warning" />
//             </div>
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
import { Download, Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ReportSummaryCard from "../components/ReportSummaryCard.jsx";
import FindingsTable from "../components/FindingsTable.jsx";
import ConditionCard from "../components/ConditionCard.jsx";
import RecommendationList from "../components/RecommendationList.jsx";
import ImagingResultCard from "../components/ImagingResultCard.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// ✅ Dummy report (until backend AI is ready)
const getReportData = () => ({
  report: {
    type: "Complete Blood Count (CBC)",
    date: "December 19, 2064",
    confidence: 87,
  },
  findings: [
    { testName: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "12.0-16.0", status: "Normal" },
    { testName: "White Blood Cells", value: "11.5", unit: "K/uL", normalRange: "4.5-11.0", status: "High" },
    { testName: "Platelet Count", value: "245", unit: "K/uL", normalRange: "150-400", status: "Normal" },
  ],
  conditions: [
    {
      name: "Possible Hypertension",
      probability: 72,
      reason: "Elevated BP readings suggest cardiovascular risk.",
    },
  ],
  recommendations: [
    { type: "specialist", text: "Consult a cardiologist", priority: "high" },
    { type: "lifestyle", text: "Reduce sodium intake", priority: "normal" },
  ],
  imaging: {
    imageUrl: null,
    hasHeatmap: true,
    analysis: "No major abnormalities detected.",
    type: "X-ray",
    region: "Chest",
    qualityScore: "Good",
    highlightedRegions: [],
  },
});

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  // ✅ Correct redirect logic
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return null;

  const reportData = getReportData();

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);

    try {
      await html2pdf()
        .set({
          filename: `Medical_Report_${id}.pdf`,
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{reportData.report.type} Analysis</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {reportData.report.date}
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
              {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
              Export PDF
            </button>
          </div>

          <div ref={reportRef} className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <ReportSummaryCard reportData={reportData.report} />
              <RecommendationList recommendations={reportData.recommendations} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <FindingsTable findings={reportData.findings} />
              <ConditionCard conditions={reportData.conditions} />
              <ImagingResultCard imagingData={reportData.imaging} />
            </div>
          </div>

          <div className="mt-8">
            <DisclaimerBox variant="warning" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportDetails;
