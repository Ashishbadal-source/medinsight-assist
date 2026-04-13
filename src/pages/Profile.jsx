import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, FileText, Activity } from "lucide-react";
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

  useEffect(() => {
    if (isAuthenticated === false) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) fetchReports();
  }, [isAuthenticated, fetchReports]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-7 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-primary/20">
                <Activity className="h-3 w-3" />
                Patient Dashboard
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!</h1>
              <p className="text-slate-500 text-sm mt-0.5">Manage your medical reports and view analysis history</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-slate-700">{reports.length} Report{reports.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">

            {/* LEFT */}
            <div className="lg:col-span-1 space-y-4">
              <ProfileCard user={user} profile={profile ?? {}} />

              <Link
                to="/upload"
                className="flex items-center justify-center gap-2.5 w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                <Upload className="w-4 h-4" />
                Upload New Report
              </Link>

              <ReportTimeline reports={reports} />
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-base font-semibold flex items-center gap-2 text-slate-800">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    Medical Report History
                  </h2>
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                    {reports.length} report{reports.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {reports.length > 0 ? (
                  <div className="grid gap-3">
                    {reports.map((report) => (
                      <ReportHistoryCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-14 rounded-xl border-2 border-dashed border-slate-100">
                    <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-7 h-7 text-slate-300" />
                    </div>
                    <p className="text-slate-700 font-medium">No reports uploaded yet</p>
                    <p className="text-sm text-slate-400 mt-1 mb-5">Upload your first medical report to get AI-assisted insights</p>
                    <Link
                      to="/upload"
                      className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Report
                    </Link>
                  </div>
                )}
              </div>

              <DisclaimerBox variant="info" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
