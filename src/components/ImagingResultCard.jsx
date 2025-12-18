import { ZoomIn, Info } from "lucide-react";

const ImagingResultCard = ({ imagingData }) => {
  return (
    <div className="medical-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Imaging Analysis</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Display */}
        <div className="relative">
          <div className="aspect-square bg-secondary rounded-lg overflow-hidden border border-border">
            {imagingData.imageUrl ? (
              <img
                src={imagingData.imageUrl}
                alt="Medical imaging"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <ZoomIn className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Image Preview</p>
                </div>
              </div>
            )}
            
            {/* Heatmap Overlay Placeholder */}
            {imagingData.hasHeatmap && (
              <div className="absolute inset-0 bg-status-critical/20 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 w-16 h-16 rounded-full border-2 border-status-critical border-dashed animate-pulse" />
              </div>
            )}
          </div>
          
          <button className="absolute bottom-2 right-2 p-2 bg-card/90 rounded-lg border border-border hover:bg-card transition-colors">
            <ZoomIn className="h-4 w-4 text-foreground" />
          </button>
        </div>

        {/* Analysis Details */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Analysis Result</h4>
            <p className="text-sm text-muted-foreground">
              {imagingData.analysis || "No abnormalities detected in the analyzed regions."}
            </p>
          </div>

          {imagingData.highlightedRegions && imagingData.highlightedRegions.length > 0 && (
            <div className="p-3 bg-status-warning/10 rounded-lg border border-status-warning/30">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-status-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  Highlighted region indicates abnormal pattern requiring clinical review.
                </p>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium text-foreground mb-2">Technical Details</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Image Type: {imagingData.type || "X-ray"}</li>
              <li>• Region: {imagingData.region || "Chest"}</li>
              <li>• Quality Score: {imagingData.qualityScore || "Good"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagingResultCard;
