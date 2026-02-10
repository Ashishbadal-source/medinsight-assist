import { Link } from "react-router-dom";
import { FileText, Activity, Image, Heart, Eye } from "lucide-react";
import DownloadButton from "./DownloadButton.jsx";

/* ---------------- SAFE HELPERS ---------------- */

const getReportIcon = (type = "") => {
  switch (type.toLowerCase()) {
    case "blood test":
      return <Activity className="w-5 h-5" />;
    case "x-ray":
      return <Image className="w-5 h-5" />;
    case "ecg":
      return <Heart className="w-5 h-5" />;
    case "radiology":
      return <FileText className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const getTypeColor = (type = "") => {
  switch (type.toLowerCase()) {
    case "blood test":
      return "bg-red-100 text-red-700";
    case "x-ray":
      return "bg-blue-100 text-blue-700";
    case "ecg":
      return "bg-pink-100 text-pink-700";
    case "radiology":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/* ---------------- COMPONENT ---------------- */

const ReportHistoryCard = ({ report }) => {
  const type = report.report_type || "Unknown";
  const summary = report.summary || "No AI summary available yet";
  const confidence = report.confidence_score || 0;

  const createdAt = report.created_at
    ? new Date(report.created_at)
    : null;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${getTypeColor(type)}`}>
            {getReportIcon(type)}
          </div>

          <div>
            <h3 className="font-semibold text-foreground">{type}</h3>
            <p className="text-sm text-muted-foreground">
              {createdAt
                ? createdAt.toLocaleDateString() +
                  " at " +
                  createdAt.toLocaleTimeString()
                : "Date unavailable"}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-medical-success/10 text-medical-success text-xs font-medium rounded-full">
          Uploaded
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {summary}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">AI Confidence:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground">
              {confidence}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/report/${report.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>

          <DownloadButton reportId={report.id} size="small" />
        </div>
      </div>
    </div>
  );
};

export default ReportHistoryCard;
