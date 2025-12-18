import { CheckCircle, UserCheck, RefreshCw, Heart } from "lucide-react";

const RecommendationList = ({ recommendations }) => {
  const iconMap = {
    specialist: UserCheck,
    retest: RefreshCw,
    lifestyle: Heart,
    default: CheckCircle,
  };

  return (
    <div className="medical-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recommended Next Steps</h3>
      
      <ul className="space-y-3">
        {recommendations.map((rec, index) => {
          const Icon = iconMap[rec.type] || iconMap.default;
          return (
            <li key={index} className="flex items-start gap-3">
              <div className="p-1.5 bg-primary/10 rounded-full">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">{rec.text}</p>
                {rec.priority && (
                  <span className={`text-xs ${
                    rec.priority === "high" ? "text-status-critical" : "text-muted-foreground"
                  }`}>
                    {rec.priority === "high" ? "High priority" : "Recommended"}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecommendationList;
