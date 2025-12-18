import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                MedInsight AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Clinical Decision Support System for Multimodal Medical Report Analysis
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/upload" className="text-sm text-muted-foreground hover:text-primary">
                  Upload Reports
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-primary">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Important Notice</h4>
            <p className="text-sm text-muted-foreground">
              This system is designed to assist healthcare professionals and does not provide medical diagnosis.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MedInsight AI. For clinical decision support only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
