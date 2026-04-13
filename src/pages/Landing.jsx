import { Link } from "react-router-dom";
import { FileText, Image, Heart, Brain, ArrowRight, Upload, Search, ClipboardList, CheckCircle, Shield, Zap, Lock, Activity } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";

const Landing = () => {
  const features = [
    { icon: FileText, title: "Lab Report Interpretation", description: "Detailed analysis of blood tests with reference ranges, flagged values, and clinical explanations.", color: "text-blue-600", bg: "bg-blue-50", accent: "border-l-blue-500" },
    { icon: Image, title: "X-ray & Imaging Analysis", description: "AI-powered radiological image analysis with highlighted regions of clinical interest.", color: "text-violet-600", bg: "bg-violet-50", accent: "border-l-violet-500" },
    { icon: Heart, title: "ECG Summary", description: "Rhythm analysis, interval measurements, and clinical insights from electrocardiograms.", color: "text-rose-600", bg: "bg-rose-50", accent: "border-l-rose-500" },
    { icon: Brain, title: "Explainable AI Results", description: "Every finding includes confidence scores, reasoning, and clear clinical context.", color: "text-emerald-600", bg: "bg-emerald-50", accent: "border-l-emerald-500" },
  ];

  const steps = [
    { icon: Upload, title: "Upload Report", description: "Securely upload any medical report — PDF, image, or scan", step: "01", color: "bg-blue-500" },
    { icon: Search, title: "AI Analysis", description: "Our engine processes and extracts clinical data in seconds", step: "02", color: "bg-violet-500" },
    { icon: ClipboardList, title: "Review Findings", description: "Read structured, easy-to-understand medical summaries", step: "03", color: "bg-rose-500" },
    { icon: CheckCircle, title: "Take Action", description: "Get recommended next steps and clinical guidance", step: "04", color: "bg-emerald-500" },
  ];

  const trustItems = [
    { icon: Shield, label: "HIPAA Compliant" },
    { icon: Lock, label: "256-bit Encryption" },
    { icon: Zap, label: "AI Verified" },
    { icon: Activity, label: "Clinical Grade" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero + Stats as one full-screen section ── */}
      <section className="relative flex flex-col overflow-hidden" style={{minHeight: "calc(100vh - 64px)"}}>
        {/* Blue gradient background for hero */}
        <div className="absolute inset-0 -z-10" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}} />
        <div className="absolute inset-0 opacity-[0.04] -z-10"
          style={{ backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Hero content */}
        <div className="flex-1 flex items-center px-4 py-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 bg-white/80 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4 border border-primary/20 shadow-sm backdrop-blur-sm">
                  <Zap className="h-3.5 w-3.5 fill-primary" />
                  AI-Powered Medical Report Analysis
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
                  Understand Medical Reports with{" "}
                  <span className="text-primary relative inline-block mb-2">
                    AI-Assisted
                    <svg className="absolute left-0 w-full" style={{bottom: "-6px"}} viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                      <path d="M0 6 Q50 1 100 4 Q150 7 200 3" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
                    </svg>
                  </span>{" "}
                  Clinical Insights
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Upload blood tests, X-rays, and ECGs to receive structured, explainable summaries designed for healthcare professionals.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Link to="/upload"
                    className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/30 hover:-translate-y-0.5">
                    Upload Medical Report <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/how-it-works"
                    className="inline-flex items-center gap-2 bg-white/80 text-slate-700 px-7 py-3 rounded-xl font-semibold border border-slate-200 hover:bg-white transition-all backdrop-blur-sm">
                    How It Works
                  </Link>
                </div>
                <div className="flex flex-wrap gap-5">
                  {trustItems.map((t) => (
                    <div key={t.label} className="flex items-center gap-1.5 text-sm text-slate-500">
                      <t.icon className="h-3.5 w-3.5 text-primary" />
                      {t.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — AI preview card */}
              <div className="hidden lg:block relative">
                <div className="bg-white rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/50 p-6 space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">AI Analysis Complete</p>
                      <p className="text-xs text-slate-400">Blood Test Report • Just now</p>
                    </div>
                    <span className="ml-auto text-xs bg-emerald-50 text-emerald-600 font-medium px-2 py-1 rounded-full border border-emerald-100">✓ 94% Confidence</span>
                  </div>
                  {[
                    { label: "Hemoglobin", value: "11.2 g/dL", status: "Low", color: "text-amber-600 bg-amber-50 border-amber-100" },
                    { label: "WBC Count", value: "8,400 /μL", status: "Normal", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                    { label: "Platelets", value: "1,42,000 /μL", status: "Low", color: "text-amber-600 bg-amber-50 border-amber-100" },
                    { label: "Blood Glucose", value: "98 mg/dL", status: "Normal", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">{item.value}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${item.color}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs text-blue-700 font-medium mb-1">AI Recommendation</p>
                    <p className="text-xs text-blue-600">Low hemoglobin detected. Consider iron deficiency anemia workup and dietary assessment.</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl border border-blue-100 shadow-lg px-4 py-2.5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-slate-600">Analysis ready in seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar pinned to bottom of hero section */}
        <div className="w-full py-5 px-4" style={{background: "linear-gradient(90deg, #1e40af 0%, #2563eb 50%, #1d4ed8 100%)"}}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: "4+", label: "Report Types" },
              { value: "< 30s", label: "Analysis Time" },
              { value: "100%", label: "Explainable" },
              { value: "Secure", label: "End-to-End" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Features</p>
            <h2 className="text-2xl font-bold text-slate-900">Comprehensive Report Analysis</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">Get detailed clinical insights from every type of medical report.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${f.accent} p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2 text-sm">Get your report analyzed in 4 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-full h-0.5 bg-gradient-to-r from-slate-200 to-transparent z-0" />
                )}
                <div className="relative z-10 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-center">
                  <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 tracking-widest">{step.step}</span>
                  <h3 className="font-semibold text-slate-800 mt-1 mb-1 text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/upload"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-6 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <DisclaimerBox variant="warning" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
