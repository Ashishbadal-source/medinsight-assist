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
