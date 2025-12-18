import { Upload, Cpu, FileSearch, ClipboardCheck, Shield, Brain } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import StepCard from "../components/StepCard.jsx";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Upload Your Medical Reports",
      description: "Simply drag and drop or select your medical documents. We accept PDF lab reports, X-ray images (JPG/PNG), and ECG reports. Your data is processed securely.",
    },
    {
      number: 2,
      icon: FileSearch,
      title: "AI Extracts Clinical Data",
      description: "Our system uses advanced optical character recognition (OCR) and image processing to accurately extract all relevant medical values, measurements, and findings from your reports.",
    },
    {
      number: 3,
      icon: Cpu,
      title: "Specialized Models Analyze Reports",
      description: "Different AI models trained on medical data analyze specific report types. Lab reports are compared against reference ranges, while imaging studies are analyzed for patterns.",
    },
    {
      number: 4,
      icon: Brain,
      title: "Results Reviewed Using Medical Guidelines",
      description: "All findings are cross-referenced with established medical guidelines and clinical standards to provide context and identify potential areas of concern.",
    },
    {
      number: 5,
      icon: ClipboardCheck,
      title: "Structured Results Delivered",
      description: "You receive a comprehensive dashboard with findings organized by importance, confidence scores for each analysis, and recommended next steps for clinical follow-up.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your medical data is processed securely and never stored permanently on our servers.",
    },
    {
      icon: Brain,
      title: "Explainable AI",
      description: "Every finding includes a clear explanation of why it was flagged and what it might mean.",
    },
    {
      icon: ClipboardCheck,
      title: "Clinical Standards",
      description: "Analysis follows established medical guidelines and reference ranges.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              How MedInsight AI Works
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding the process behind our AI-assisted medical report analysis system
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8 mb-16">
            {steps.map((step, index) => (
              <div key={index} className="medical-card">
                <StepCard {...step} />
              </div>
            ))}
          </div>

          {/* Key Features */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-foreground text-center mb-8">
              Key Principles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="medical-card text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div className="medical-card bg-secondary/50">
            <h3 className="font-semibold text-foreground mb-2">Important to Understand</h3>
            <p className="text-sm text-muted-foreground">
              MedInsight AI is designed to assist healthcare professionals and patients in understanding 
              medical reports. It does not replace professional medical advice, diagnosis, or treatment. 
              Always consult with qualified healthcare providers for medical decisions.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
