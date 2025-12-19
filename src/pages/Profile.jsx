import { useNavigate, Link } from "react-router-dom";
import { Upload, FileText } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import ReportHistoryCard from "../components/ReportHistoryCard.jsx";
import ReportTimeline from "../components/ReportTimeline.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";

const Profile = () => {
  const { user, reports, isAuthenticated, fetchReports } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  // if (!isAuthenticated) {
  //   navigate("/login");
  //   return null;
  // }


  useEffect(() => {
  if (!isAuthenticated) {
    navigate("/login");
  }
}, [isAuthenticated]);


useEffect(() => {
  if (isAuthenticated) {
    fetchReports();
  }
}, [isAuthenticated]);




  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Patient Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your medical reports and view analysis history
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Patient Info */}
              <ProfileCard user={user} />

              {/* Upload Button */}
              <Link
                to="/upload"
                className="flex items-center justify-center gap-3 w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload New Medical Report
              </Link>

              {/* Timeline */}
              <ReportTimeline reports={reports} />
            </div>

            {/* Right Column - Report History */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Medical Report History
                    </h2>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {reports.length} report{reports.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {reports.length > 0 ? (
                  <div className="grid gap-4">
                    {reports.map((report) => (
                      <ReportHistoryCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No Reports Yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Upload your first medical report to get AI-assisted analysis
                    </p>
                    <Link
                      to="/upload"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Report
                    </Link>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="mt-6">
                <DisclaimerBox variant="info" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
