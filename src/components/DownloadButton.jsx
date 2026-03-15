import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

const DownloadButton = ({ reportId, size = "default" }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const link = document.createElement("a");
    link.href = "#";
    link.download = `MedInsight_Report_${reportId}.pdf`;
    
    setIsDownloading(false);
    
    alert("Download started. In production, this would download the PDF report.");
  };

  const sizeClasses = {
    small: "px-2.5 py-1.5 text-xs gap-1",
    default: "px-4 py-2 text-sm gap-2",
    large: "px-5 py-2.5 text-base gap-2",
  };

  const iconSizes = {
    small: "w-3.5 h-3.5",
    default: "w-4 h-4",
    large: "w-5 h-5",
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`inline-flex items-center font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]}`}
    >
      {isDownloading ? (
        <>
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
          <span className="hidden sm:inline">Downloading...</span>
        </>
      ) : (
        <>
          <Download className={iconSizes[size]} />
          <span className="hidden sm:inline">Download</span>
        </>
      )}
    </button>
  );
};

export default DownloadButton;
