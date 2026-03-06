// import { Link } from "react-router-dom";
// import { FileText, Image, Heart, Brain, ArrowRight, Upload, Search, ClipboardList, CheckCircle } from "lucide-react";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import FeatureCard from "../components/FeatureCard.jsx";
// import DisclaimerBox from "../components/DisclaimerBox.jsx";

// const Landing = () => {
//   const features = [
//     {
//       icon: FileText,
//       title: "Lab Report Interpretation",
//       description: "Upload blood tests and lab reports for detailed analysis with reference ranges and explanations.",
//     },
//     {
//       icon: Image,
//       title: "X-ray & Imaging Analysis",
//       description: "AI-powered analysis of radiological images with highlighted areas of interest.",
//     },
//     {
//       icon: Heart,
//       title: "ECG Summary",
//       description: "Electrocardiogram interpretation with rhythm analysis and clinical insights.",
//     },
//     {
//       icon: Brain,
//       title: "Explainable AI Results",
//       description: "Every finding comes with clear explanations, confidence scores, and clinical context.",
//     },
//   ];

//   const steps = [
//     { icon: Upload, title: "Upload", description: "Upload your medical reports" },
//     { icon: Search, title: "Analyze", description: "AI processes the data" },
//     { icon: ClipboardList, title: "Review", description: "View detailed findings" },
//     { icon: CheckCircle, title: "Next Steps", description: "Get recommendations" },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />

//       {/* Hero Section */}
//       <section className="py-16 md:py-24 px-4">
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
//             Understand Medical Reports with
//             <span className="text-primary block mt-2">AI-Assisted Clinical Insights</span>
//           </h1>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
//             Upload medical reports like blood tests, X-rays, ECGs and receive structured, 
//             explainable summaries designed for healthcare professionals.
//           </p>
//           <Link
//             to="/upload"
//             className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
//           >
//             Upload Medical Report
//             <ArrowRight className="h-5 w-5" />
//           </Link>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 px-4 bg-secondary/30">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
//             Comprehensive Report Analysis
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {features.map((feature, index) => (
//               <FeatureCard key={index} {...feature} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="py-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
//             How It Works
//           </h2>
//           <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
//             {steps.map((step, index) => (
//               <div key={index} className="flex items-center gap-4">
//                 <div className="flex flex-col items-center">
//                   <div className="p-4 bg-primary/10 rounded-full mb-2">
//                     <step.icon className="h-8 w-8 text-primary" />
//                   </div>
//                   <h3 className="font-semibold text-foreground">{step.title}</h3>
//                   <p className="text-sm text-muted-foreground text-center">{step.description}</p>
//                 </div>
//                 {index < steps.length - 1 && (
//                   <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Disclaimer Banner */}
//       <section className="py-8 px-4">
//         <div className="max-w-3xl mx-auto">
//           <DisclaimerBox variant="warning" />
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Landing;




















import { Link } from "react-router-dom";
import { FileText, Image, Heart, Brain, ArrowRight, Upload, Search, ClipboardList, CheckCircle, Shield, Zap, Star } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: "Lab Report Interpretation",
      description: "Upload blood tests and lab reports for detailed analysis with reference ranges and explanations.",
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      icon: Image,
      title: "X-ray & Imaging Analysis",
      description: "AI-powered analysis of radiological images with highlighted areas of interest.",
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100",
    },
    {
      icon: Heart,
      title: "ECG Summary",
      description: "Electrocardiogram interpretation with rhythm analysis and clinical insights.",
      color: "bg-rose-50 text-rose-600",
      border: "border-rose-100",
    },
    {
      icon: Brain,
      title: "Explainable AI Results",
      description: "Every finding comes with clear explanations, confidence scores, and clinical context.",
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
  ];

  const steps = [
    { icon: Upload, title: "Upload", description: "Upload your medical reports", step: "01" },
    { icon: Search, title: "Analyze", description: "AI processes the data", step: "02" },
    { icon: ClipboardList, title: "Review", description: "View detailed findings", step: "03" },
    { icon: CheckCircle, title: "Next Steps", description: "Get recommendations", step: "04" },
  ];

  const stats = [
    { value: "4+", label: "Report Types" },
    { value: "AI", label: "Powered Analysis" },
    { value: "100%", label: "Explainable" },
    { value: "Secure", label: "& Confidential" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50 -z-10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Medical Report Analysis
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Understand Medical Reports with{" "}
              <span className="text-primary">AI-Assisted Clinical Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload medical reports like blood tests, X-rays, ECGs and receive structured,
              explainable summaries designed for healthcare professionals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Upload Medical Report
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 bg-white text-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-secondary transition-all border border-border shadow-sm"
              >
                How It Works
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              {["HIPAA Compliant", "256-bit Encryption", "AI Verified"].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-border shadow-sm">
              <Star className="h-3.5 w-3.5" />
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Comprehensive Report Analysis
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Get detailed insights from all types of medical reports with our advanced AI engine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`bg-white rounded-2xl border ${feature.border} p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group`}>
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-primary/10">
              <ClipboardList className="h-3.5 w-3.5" />
              Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Get your medical report analyzed in just a few simple steps.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex flex-col items-center text-center w-44 group">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                      <step.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center mx-2">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-primary/40 to-primary/10" />
                    <ArrowRight className="h-5 w-5 text-primary/40 -ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 bg-slate-50/80">
        <div className="max-w-3xl mx-auto">
          <DisclaimerBox variant="warning" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
