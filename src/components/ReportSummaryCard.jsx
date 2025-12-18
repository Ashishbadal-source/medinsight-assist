import { FileText, Calendar, TrendingUp } from "lucide-react";

const ReportSummaryCard = ({ reportData }) => {
  const getConfidenceColor = (score) => {
    if (score >= 80) return "text-status-normal";
    if (score >= 60) return "text-status-warning";
    return "text-status-critical";
  };

  return (
    <div className="medical-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Report Summary</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Report Type</p>
            <p className="font-medium text-foreground">{reportData.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date Uploaded</p>
            <p className="font-medium text-foreground">{reportData.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">AI Confidence Score</p>
            <p className={`font-medium ${getConfidenceColor(reportData.confidence)}`}>
              {reportData.confidence}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryCard;
