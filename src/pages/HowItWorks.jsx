// // import { Upload, Cpu, FileSearch, ClipboardCheck, Shield, Brain } from "lucide-react";
// // import Navbar from "../components/Navbar.jsx";
// // import Footer from "../components/Footer.jsx";
// // import StepCard from "../components/StepCard.jsx";

// // const HowItWorks = () => {
// //   const steps = [
// //     {
// //       number: 1,
// //       icon: Upload,
// //       title: "Upload Your Medical Reports",
// //       description: "Simply drag and drop or select your medical documents. We accept PDF lab reports, X-ray images (JPG/PNG), and ECG reports. Your data is processed securely.",
// //     },
// //     {
// //       number: 2,
// //       icon: FileSearch,
// //       title: "AI Extracts Clinical Data",
// //       description: "Our system uses advanced optical character recognition (OCR) and image processing to accurately extract all relevant medical values, measurements, and findings from your reports.",
// //     },
// //     {
// //       number: 3,
// //       icon: Cpu,
// //       title: "Specialized Models Analyze Reports",
// //       description: "Different AI models trained on medical data analyze specific report types. Lab reports are compared against reference ranges, while imaging studies are analyzed for patterns.",
// //     },
// //     {
// //       number: 4,
// //       icon: Brain,
// //       title: "Results Reviewed Using Medical Guidelines",
// //       description: "All findings are cross-referenced with established medical guidelines and clinical standards to provide context and identify potential areas of concern.",
// //     },
// //     {
// //       number: 5,
// //       icon: ClipboardCheck,
// //       title: "Structured Results Delivered",
// //       description: "You receive a comprehensive dashboard with findings organized by importance, confidence scores for each analysis, and recommended next steps for clinical follow-up.",
// //     },
// //   ];

// //   const features = [
// //     {
// //       icon: Shield,
// //       title: "Privacy First",
// //       description: "Your medical data is processed securely and never stored permanently on our servers.",
// //     },
// //     {
// //       icon: Brain,
// //       title: "Explainable AI",
// //       description: "Every finding includes a clear explanation of why it was flagged and what it might mean.",
// //     },
// //     {
// //       icon: ClipboardCheck,
// //       title: "Clinical Standards",
// //       description: "Analysis follows established medical guidelines and reference ranges.",
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen flex flex-col bg-background">
// //       <Navbar />

// //       <main className="flex-1 py-12 px-4">
// //         <div className="max-w-4xl mx-auto">
// //           <div className="text-center mb-12">
// //             <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
// //               How MedInsight AI Works
// //             </h1>
// //             <p className="text-muted-foreground max-w-2xl mx-auto">
// //               Understanding the process behind our AI-assisted medical report analysis system
// //             </p>
// //           </div>

// //           {/* Steps */}
// //           <div className="space-y-8 mb-16">
// //             {steps.map((step, index) => (
// //               <div key={index} className="medical-card">
// //                 <StepCard {...step} />
// //               </div>
// //             ))}
// //           </div>

// //           {/* Key Features */}
// //           <div className="mb-12">
// //             <h2 className="text-xl font-bold text-foreground text-center mb-8">
// //               Key Principles
// //             </h2>
// //             <div className="grid md:grid-cols-3 gap-6">
// //               {features.map((feature, index) => (
// //                 <div key={index} className="medical-card text-center">
// //                   <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
// //                     <feature.icon className="h-6 w-6 text-primary" />
// //                   </div>
// //                   <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
// //                   <p className="text-sm text-muted-foreground">{feature.description}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Important Note */}
// //           <div className="medical-card bg-secondary/50">
// //             <h3 className="font-semibold text-foreground mb-2">Important to Understand</h3>
// //             <p className="text-sm text-muted-foreground">
// //               MedInsight AI is designed to assist healthcare professionals and patients in understanding 
// //               medical reports. It does not replace professional medical advice, diagnosis, or treatment. 
// //               Always consult with qualified healthcare providers for medical decisions.
// //             </p>
// //           </div>
// //         </div>
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default HowItWorks;











// import { Upload, Cpu, FileSearch, ClipboardCheck, Shield, Brain, ArrowRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import StepCard from "../components/StepCard.jsx";

// const HowItWorks = () => {
//   const steps = [
//     { number: 1, icon: Upload, title: "Upload Your Medical Reports", description: "Simply drag and drop or select your medical documents. We accept PDF lab reports, X-ray images (JPG/PNG), and ECG reports. Your data is processed securely.", color: "bg-blue-500", light: "bg-blue-50 text-blue-600" },
//     { number: 2, icon: FileSearch, title: "AI Extracts Clinical Data", description: "Our system uses advanced OCR and image processing to accurately extract all relevant medical values, measurements, and findings from your reports.", color: "bg-violet-500", light: "bg-violet-50 text-violet-600" },
//     { number: 3, icon: Cpu, title: "Specialized Models Analyze Reports", description: "Different AI models trained on medical data analyze specific report types. Lab reports are compared against reference ranges, while imaging studies are analyzed for patterns.", color: "bg-rose-500", light: "bg-rose-50 text-rose-600" },
//     { number: 4, icon: Brain, title: "Results Reviewed Using Medical Guidelines", description: "All findings are cross-referenced with established medical guidelines and clinical standards to provide context and identify potential areas of concern.", color: "bg-amber-500", light: "bg-amber-50 text-amber-600" },
//     { number: 5, icon: ClipboardCheck, title: "Structured Results Delivered", description: "You receive a comprehensive dashboard with findings organized by importance, confidence scores for each analysis, and recommended next steps for clinical follow-up.", color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-600" },
//   ];

//   const features = [
//     { icon: Shield, title: "Privacy First", description: "Your medical data is processed securely and never stored permanently on our servers.", color: "bg-blue-50", iconColor: "text-blue-600" },
//     { icon: Brain, title: "Explainable AI", description: "Every finding includes a clear explanation of why it was flagged and what it might mean.", color: "bg-violet-50", iconColor: "text-violet-600" },
//     { icon: ClipboardCheck, title: "Clinical Standards", description: "Analysis follows established medical guidelines and reference ranges.", color: "bg-emerald-50", iconColor: "text-emerald-600" },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #f8faff 100%)"}}>
//       <Navbar />
//       <main className="flex-1 py-12 px-4">
//         <div className="max-w-4xl mx-auto">

//           {/* Header */}
//           <div className="text-center mb-10">
//             <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-primary/20">
//               Process
//             </div>
//             <h1 className="text-3xl font-bold text-slate-900 mb-3">How MedInsight AI Works</h1>
//             <p className="text-slate-500 max-w-2xl mx-auto text-sm">Understanding the process behind our AI-assisted medical report analysis system</p>
//           </div>

//           {/* Steps */}
//           <div className="space-y-3 mb-10">
//             {steps.map((step, index) => (
//               <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-all">
//                 <div className="shrink-0 flex flex-col items-center gap-1">
//                   <div className={`w-11 h-11 ${step.color} rounded-xl flex items-center justify-center shadow-sm`}>
//                     <step.icon className="h-5 w-5 text-white" />
//                   </div>
//                   {index < steps.length - 1 && <div className="w-0.5 bg-slate-100 flex-1 my-1" style={{minHeight:"16px"}} />}
//                 </div>
//                 <div className="flex-1 pt-0.5">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${step.light}`}>0{step.number}</span>
//                     <h3 className="font-semibold text-slate-800 text-sm">{step.title}</h3>
//                   </div>
//                   <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Key Features */}
//           <h2 className="text-xl font-bold text-slate-900 text-center mb-5">Key Principles</h2>
//           <div className="grid md:grid-cols-3 gap-4 mb-8">
//             {features.map((f, i) => (
//               <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
//                 <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
//                   <f.icon className={`h-5 w-5 ${f.iconColor}`} />
//                 </div>
//                 <h3 className="font-semibold text-slate-800 mb-1.5 text-sm">{f.title}</h3>
//                 <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
//               </div>
//             ))}
//           </div>

//           {/* Important Note */}
//           <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 mb-8">
//             <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2 text-sm">
//               <span>⚠️</span> Important to Understand
//             </h3>
//             <p className="text-sm text-slate-500 leading-relaxed">
//               MedInsight AI is designed to assist healthcare professionals and patients in understanding medical reports. It does not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.
//             </p>
//           </div>

//           <div className="text-center">
//             <Link to="/upload"
//               className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm">
//               Try It Now <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default HowItWorks;



















import { Upload, Cpu, FileSearch, ClipboardCheck, Shield, Brain, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import StepCard from "../components/StepCard.jsx";

const HowItWorks = () => {
  const steps = [
    { number: 1, icon: Upload, title: "Upload Your Medical Reports", description: "Simply drag and drop or select your medical documents. We accept PDF lab reports, X-ray images (JPG/PNG), and ECG reports. Your data is processed securely.", color: "bg-blue-500", light: "bg-blue-50 text-blue-600" },
    { number: 2, icon: FileSearch, title: "AI Extracts Clinical Data", description: "Our system uses advanced OCR and image processing to accurately extract all relevant medical values, measurements, and findings from your reports.", color: "bg-violet-500", light: "bg-violet-50 text-violet-600" },
    { number: 3, icon: Cpu, title: "Specialized Models Analyze Reports", description: "Different AI models trained on medical data analyze specific report types. Lab reports are compared against reference ranges, while imaging studies are analyzed for patterns.", color: "bg-rose-500", light: "bg-rose-50 text-rose-600" },
    { number: 4, icon: Brain, title: "Results Reviewed Using Medical Guidelines", description: "All findings are cross-referenced with established medical guidelines and clinical standards to provide context and identify potential areas of concern.", color: "bg-amber-500", light: "bg-amber-50 text-amber-600" },
    { number: 5, icon: ClipboardCheck, title: "Structured Results Delivered", description: "You receive a comprehensive dashboard with findings organized by importance, confidence scores for each analysis, and recommended next steps for clinical follow-up.", color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-600" },
  ];

  const features = [
    { icon: Shield, title: "Privacy First", description: "Your medical data is processed securely and never stored permanently on our servers.", color: "bg-blue-50", iconColor: "text-blue-600" },
    { icon: Brain, title: "Explainable AI", description: "Every finding includes a clear explanation of why it was flagged and what it might mean.", color: "bg-violet-50", iconColor: "text-violet-600" },
    { icon: ClipboardCheck, title: "Clinical Standards", description: "Analysis follows established medical guidelines and reference ranges.", color: "bg-emerald-50", iconColor: "text-emerald-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-primary/20">
              Process
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">How MedInsight AI Works</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm">Understanding the process behind our AI-assisted medical report analysis system</p>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-10">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4 hover:shadow-md transition-all">
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className={`w-11 h-11 ${step.color} rounded-xl flex items-center justify-center shadow-sm`}>
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  {index < steps.length - 1 && <div className="w-0.5 bg-slate-100 flex-1 my-1" style={{minHeight:"16px"}} />}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${step.light}`}>0{step.number}</span>
                    <h3 className="font-semibold text-slate-800 text-sm">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Features */}
          <h2 className="text-xl font-bold text-slate-900 text-center mb-5">Key Principles</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
                <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5 text-sm">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Important Note */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 mb-8">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2 text-sm">
              <span>⚠️</span> Important to Understand
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              MedInsight AI is designed to assist healthcare professionals and patients in understanding medical reports. It does not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.
            </p>
          </div>

          <div className="text-center">
            <Link to="/upload"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm">
              Try It Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
