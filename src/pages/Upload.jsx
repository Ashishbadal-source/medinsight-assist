import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText, Zap, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const ERROR_MESSAGES = {
  "No blood test values found in report": "❌ Could not detect blood test values. Please upload a clear CBC/blood report image or PDF.",
  "Could not extract text from report": "❌ Could not read the file. Please upload a clearer image or a valid PDF.",
  "No waveform detected": "❌ No ECG waveform found. Please upload a valid ECG report image.",
  "Image is blank": "❌ The uploaded image appears to be blank. Please try again with a valid report.",
  "Quality check failed": "❌ Image quality is too low. Please upload a clearer scan of your report.",
  "Only image files allowed": "❌ Please upload an image file (JPG, PNG) for ECG analysis.",
  "Only image or PDF files allowed": "❌ Please upload an image (JPG, PNG) or PDF file.",
  "Analysis failed": "❌ Analysis failed. Please make sure you uploaded the correct report type.",
};

const getFriendlyError = (message) => {
  for (const [key, friendly] of Object.entries(ERROR_MESSAGES)) {
    if (message?.toLowerCase().includes(key.toLowerCase())) {
      return friendly;
    }
  }
  return `❌ Something went wrong. Please try again with a valid ${message?.includes("blood") ? "blood test" : "ECG"} report.`;
};

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setError(""); }
  };

  const handleAnalyze = async () => {
    setError("");
    if (!user) { setError("❌ You are not logged in. Please login and try again."); return; }
    if (!reportType) { setError("❌ Please select a report category before uploading."); return; }
    if (!file) { setError("❌ Please upload a report file to continue."); return; }

    setLoading(true);
    try {
      setStatusMsg("Uploading file...");
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("medical-reports").upload(fileName, file);
      if (uploadError) throw new Error(uploadError.message);

      let analysisResult = null;

      if (reportType === "ECG") {
        setStatusMsg("Analyzing ECG...");
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${BACKEND_URL}/analyze/ecg`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || data.error || "Analysis failed");
        if (!data.success) throw new Error(data.error || "Analysis failed");
        analysisResult = data;
      }

      if (reportType === "Blood Test") {
        setStatusMsg("Analyzing Blood Report...");
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${BACKEND_URL}/analyze/blood`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || data.error || "Analysis failed");
        if (!data.success) throw new Error(data.error || "Analysis failed");
        analysisResult = data;
      }

      if (reportType === "X-Ray") {
        setStatusMsg("Analyzing X-Ray...");
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${BACKEND_URL}/analyze/xray`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || data.error || "Analysis failed");
        if (!data.success) throw new Error(data.error || "Analysis failed");
        analysisResult = data;
      }

      setStatusMsg("Saving report...");
      const { data: insertedReport, error: dbError } = await supabase.from("reports").insert({
        user_id: user.id,
        report_type: reportType,
        file_path: fileName,
        age: age ? Number(age) : null,
        gender: gender || null,
        symptoms: symptoms || null,
        summary: analysisResult
          ? (reportType === "ECG"
              ? analysisResult.subclass_prediction?.label
              : analysisResult.summary)
          : null,
        confidence_score: analysisResult
          ? (reportType === "ECG"
              ? Math.round(analysisResult.subclass_prediction?.confidence * 100)
              : null)
          : null,
        analysis_json: analysisResult || null,
      }).select().single();

      if (dbError) throw new Error(dbError.message);
      navigate(`/report/${insertedReport.id}`);

    } catch (err) {
      console.error(err);
      setError(getFriendlyError(err.message));
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  const reportTypes = [
    { value: "Blood Test", label: "Blood Test", emoji: "🩸" },
    { value: "X-Ray", label: "X-Ray", emoji: "🩻" },
    { value: "ECG", label: "ECG", emoji: "❤️" },
    { value: "Ultrasound", label: "Ultrasound", emoji: "🔊" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Header */}
          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-primary/20">
              <Zap className="h-3 w-3" />
              AI-Powered Analysis
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Upload Medical Report</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Select your report type and upload the file for AI analysis</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 animate-pulse-once">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">{error}</p>
                <p className="text-xs text-red-400 mt-1">Please check your file and try again.</p>
              </div>
              <button onClick={() => setError("")} className="ml-auto text-red-300 hover:text-red-500 transition-colors">✕</button>
            </div>
          )}

          {/* Upload Area */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <UploadIcon className="w-4 h-4 text-primary" />
              </div>
              Upload File
            </h2>
            <label
              htmlFor="reportFile"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-all block ${
                dragOver ? "border-primary bg-primary/5" : file ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-primary hover:bg-primary/5"
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  <p className="font-semibold text-slate-800">{file.name}</p>
                  <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB • Click to change</p>
                </div>
              ) : (
                <>
                  <UploadIcon className="mx-auto mb-3 w-10 h-10 text-slate-300" />
                  <p className="font-semibold text-slate-700">Drag and drop your file here</p>
                  <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                  <p className="text-xs text-slate-300 mt-3">PDF, JPG, PNG supported</p>
                </>
              )}
              <input id="reportFile" type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => { setFile(e.target.files[0]); setError(""); }} />
            </label>
            <div className="mt-4 flex justify-center gap-6 text-sm text-slate-400">
              <span>📄 PDF Reports</span>
              <span>🩻 X-ray Images</span>
              <span>❤️ ECG Reports</span>
            </div>
          </div>

          {/* Report Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-violet-50 rounded-lg">
                <FileText className="w-4 h-4 text-violet-600" />
              </div>
              Report Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Report Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {reportTypes.map((rt) => (
                  <button
                    key={rt.value}
                    type="button"
                    onClick={() => { setReportType(rt.value); setError(""); }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      reportType === rt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-100 text-slate-600 hover:border-primary/40 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xl">{rt.emoji}</span>
                    {rt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Patient Age <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="number"
                  min="0"
                  value={age}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) >= 0) setAge(val);
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="e.g. 45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender <span className="text-slate-400 font-normal">(optional)</span></label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Symptoms <span className="text-slate-400 font-normal">(optional)</span></label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="Describe any symptoms or relevant medical history..."
              />
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-700">
              This output is generated by an AI-assisted system and should not be considered a medical diagnosis. Always consult a qualified healthcare professional.
            </p>
          </div>

          {statusMsg && (
            <div className="text-center text-sm text-primary font-medium flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              {statusMsg}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-base hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
            ) : (
              <><Zap className="w-5 h-5" />Analyze Report</>
            )}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;