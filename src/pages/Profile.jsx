import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, FileText } from "lucide-react";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import ReportHistoryCard from "../components/ReportHistoryCard.jsx";
import ReportTimeline from "../components/ReportTimeline.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";

import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, profile, reports, isAuthenticated, fetchReports } = useAuth();
  const navigate = useNavigate();

  // 🔐 Redirect ONLY if auth is confirmed false
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // 📄 Fetch reports after login
  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated, fetchReports]);

  // ⏳ Wait only for USER (profile can be null initially)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading user...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your medical reports and view analysis history
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard user={user} profile={profile ?? {}} />

              <Link
                to="/upload"
                className="flex items-center justify-center gap-3 w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary/90"
              >
                <Upload className="w-5 h-5" />
                Upload New Medical Report
              </Link>

              <ReportTimeline reports={reports} />
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2">
              <div className="bg-card border rounded-xl p-6">
                <div className="flex justify-between mb-6">
                  <h2 className="text-lg font-semibold flex gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Medical Report History
                  </h2>
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
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No reports yet</p>
                    <Link
                      to="/upload"
                      className="inline-flex gap-2 mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Report
                    </Link>
                  </div>
                )}
              </div>

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
