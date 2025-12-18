import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ReportSummaryCard from "../components/ReportSummaryCard.jsx";
import FindingsTable from "../components/FindingsTable.jsx";
import ConditionCard from "../components/ConditionCard.jsx";
import RecommendationList from "../components/RecommendationList.jsx";
import ImagingResultCard from "../components/ImagingResultCard.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";

// Dummy data for demonstration
const dummyData = {
  report: {
    type: "Complete Blood Count (CBC)",
    date: "December 18, 2024",
    confidence: 87,
  },
  findings: [
    { testName: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "12.0-16.0", status: "Normal" },
    { testName: "White Blood Cells", value: "11.5", unit: "K/uL", normalRange: "4.5-11.0", status: "High" },
    { testName: "Platelet Count", value: "245", unit: "K/uL", normalRange: "150-400", status: "Normal" },
    { testName: "Red Blood Cells", value: "4.8", unit: "M/uL", normalRange: "4.5-5.5", status: "Normal" },
    { testName: "Cholesterol", value: "215", unit: "mg/dL", normalRange: "< 200", status: "Borderline" },
    { testName: "Blood Pressure", value: "145/92", unit: "mmHg", normalRange: "< 120/80", status: "High" },
  ],
  conditions: [
    {
      name: "Possible Hypertension",
      probability: 72,
      reason: "Elevated blood pressure readings (145/92 mmHg) and borderline cholesterol levels suggest cardiovascular risk.",
    },
    {
      name: "Mild Infection or Inflammation",
      probability: 58,
      reason: "White blood cell count slightly elevated (11.5 K/uL) which may indicate an ongoing immune response.",
    },
    {
      name: "Hyperlipidemia Risk",
      probability: 45,
      reason: "Borderline cholesterol levels (215 mg/dL) warrant lifestyle modifications and monitoring.",
    },
  ],
  recommendations: [
    { type: "specialist", text: "Consult a cardiologist for blood pressure evaluation", priority: "high" },
    { type: "retest", text: "Repeat lipid panel in 4-6 weeks after dietary changes", priority: "normal" },
    { type: "lifestyle", text: "Reduce sodium intake and increase physical activity", priority: "normal" },
    { type: "retest", text: "Follow-up CBC to monitor white blood cell levels", priority: "normal" },
  ],
  imaging: {
    imageUrl: null,
    hasHeatmap: true,
    analysis: "Chest X-ray shows clear lung fields with no significant abnormalities. Heart size within normal limits.",
    type: "X-ray",
    region: "Chest PA View",
    qualityScore: "Good",
    highlightedRegions: [],
  },
};

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Analysis Dashboard
            </h1>
            <p className="text-muted-foreground">
              Review the AI-assisted analysis of your medical report
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              <ReportSummaryCard reportData={dummyData.report} />
              <RecommendationList recommendations={dummyData.recommendations} />
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <FindingsTable findings={dummyData.findings} />
              <ConditionCard conditions={dummyData.conditions} />
              <ImagingResultCard imagingData={dummyData.imaging} />
            </div>
          </div>

          {/* Disclaimer at bottom */}
          <div className="mt-8">
            <DisclaimerBox variant="warning" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
