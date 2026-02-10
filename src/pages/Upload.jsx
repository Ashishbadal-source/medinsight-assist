import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reportType, setReportType] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    if (!reportType) {
      alert("Please select report category");
      return;
    }

    if (!file) {
      alert("Please upload a report file");
      return;
    }

    setLoading(true);

    /* 1️⃣ Upload file */
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("medical-reports")
      .upload(fileName, file);

    if (uploadError) {
      setLoading(false);
      alert(uploadError.message);
      return;
    }

    /* 2️⃣ Insert DB row */
    const { error: dbError } = await supabase.from("reports").insert({
      user_id: user.id,
      report_type: reportType,
      file_path: fileName,
      age: age ? Number(age) : null,
      gender: gender || null,
      symptoms: symptoms || null,
    });

    setLoading(false);

    if (dbError) {
      alert(dbError.message);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Upload Medical Report
            </h1>
            <p className="text-muted-foreground mt-2">
              Select your report type and upload the file for analysis
            </p>
          </div>

          {/* UPLOAD CARD */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Upload Medical Report</h2>

            <label
              htmlFor="reportFile"
              className="cursor-pointer border-2 border-dashed rounded-xl p-10 text-center hover:border-primary transition block"
            >
              <UploadIcon className="mx-auto mb-3 w-10 h-10 text-muted-foreground" />

              {file ? (
                <p className="font-medium text-foreground">{file.name}</p>
              ) : (
                <>
                  <p className="font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                </>
              )}

              <input
                id="reportFile"
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <div className="mt-4 text-sm flex justify-center gap-6 text-muted-foreground">
              <span>📄 PDF Reports</span>
              <span>🩻 X-ray Images</span>
              <span>❤️ ECG Reports</span>
            </div>
          </div>

          {/* DETAILS */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold">Report Details</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Report Category *
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background"
              >
                <option value="">Select category</option>
                <option value="Blood Test">Blood Test</option>
                <option value="X-Ray">X-Ray</option>
                <option value="ECG">ECG</option>
                <option value="Ultrasound">Ultrasound</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Patient Age (optional)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background"
                  placeholder="e.g. 45"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender (optional)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Symptoms (optional)
              </label>
              <textarea
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background"
                placeholder="Describe any symptoms or relevant medical history..."
              />
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="bg-muted border border-border rounded-xl p-4 text-sm">
            ⚠️ This output is generated by an AI-assisted system and should not be
            considered a medical diagnosis. Always consult a qualified
            healthcare professional.
          </div>

          {/* BUTTON */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium text-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Report"}
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Upload;
