import { Link } from "react-router-dom";
import { FileText, Activity, Image, Heart, ChevronRight } from "lucide-react";

const getReportIcon = (type) => {
  switch (type.toLowerCase()) {
    case "blood test":
      return <Activity className="w-4 h-4" />;
    case "x-ray":
      return <Image className="w-4 h-4" />;
    case "ecg":
      return <Heart className="w-4 h-4" />;
    case "radiology":
      return <FileText className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const ReportTimeline = ({ reports }) => {
  // Group reports by month
  const groupedReports = reports.reduce((acc, report) => {
    const date = new Date(report.date);
    const monthYear = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(report);
    return acc;
  }, {});

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Medical History Timeline
      </h3>

      <div className="space-y-6">
        {Object.entries(groupedReports).map(([monthYear, monthReports]) => (
          <div key={monthYear}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              {monthYear}
            </h4>
            <div className="relative pl-6 border-l-2 border-border space-y-4">
              {monthReports.map((report, index) => (
                <div key={report.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[25px] w-4 h-4 bg-primary rounded-full border-2 border-background" />
                  
                  {/* Timeline content */}
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-primary">
                          {getReportIcon(report.type)}
                        </span>
                        <span className="font-medium text-foreground text-sm">
                          {report.type}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {report.summary}
                    </p>
                    <Link
                      to={`/report/${report.id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                    >
                      View details
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No medical reports yet. Upload your first report to get started.
        </p>
      )}
    </div>
  );
};

export default ReportTimeline;
