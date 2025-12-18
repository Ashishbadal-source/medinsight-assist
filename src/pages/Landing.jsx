import { Link } from "react-router-dom";
import { FileText, Image, Heart, Brain, ArrowRight, Upload, Search, ClipboardList, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FeatureCard from "../components/FeatureCard.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: "Lab Report Interpretation",
      description: "Upload blood tests and lab reports for detailed analysis with reference ranges and explanations.",
    },
    {
      icon: Image,
      title: "X-ray & Imaging Analysis",
      description: "AI-powered analysis of radiological images with highlighted areas of interest.",
    },
    {
      icon: Heart,
      title: "ECG Summary",
      description: "Electrocardiogram interpretation with rhythm analysis and clinical insights.",
    },
    {
      icon: Brain,
      title: "Explainable AI Results",
      description: "Every finding comes with clear explanations, confidence scores, and clinical context.",
    },
  ];

  const steps = [
    { icon: Upload, title: "Upload", description: "Upload your medical reports" },
    { icon: Search, title: "Analyze", description: "AI processes the data" },
    { icon: ClipboardList, title: "Review", description: "View detailed findings" },
    { icon: CheckCircle, title: "Next Steps", description: "Get recommendations" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Understand Medical Reports with
            <span className="text-primary block mt-2">AI-Assisted Clinical Insights</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Upload medical reports like blood tests, X-rays, ECGs and receive structured, 
            explainable summaries designed for healthcare professionals.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Upload Medical Report
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Comprehensive Report Analysis
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-2">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <DisclaimerBox variant="warning" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
