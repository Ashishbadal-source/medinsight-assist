import { AlertCircle, ChevronRight } from "lucide-react";

const ConditionCard = ({ conditions }) => {
  const getProbabilityColor = (probability) => {
    if (probability >= 70) return "bg-status-critical";
    if (probability >= 40) return "bg-status-warning";
    return "bg-status-normal";
  };

  return (
    <div className="medical-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Probable Conditions</h3>
      
      <div className="space-y-4">
        {conditions.map((condition, index) => (
          <div
            key={index}
            className="p-4 bg-secondary/50 rounded-lg border border-border"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-status-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">{condition.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {condition.reason}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">
                    {condition.probability}%
                  </span>
                  <div className="w-20 h-2 bg-secondary rounded-full mt-1">
                    <div
                      className={`h-full rounded-full ${getProbabilityColor(condition.probability)}`}
                      style={{ width: `${condition.probability}%` }}
                    />
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        These are potential conditions based on the analyzed data. Consult a healthcare professional for accurate diagnosis.
      </p>
    </div>
  );
};

export default ConditionCard;
