const FindingsTable = ({ findings }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      Normal: "status-badge status-normal",
      High: "status-badge status-critical",
      Low: "status-badge status-warning",
      Borderline: "status-badge status-borderline",
    };
    return statusClasses[status] || "status-badge";
  };

  return (
    <div className="medical-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Key Findings</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Test Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Value
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Normal Range
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {findings.map((finding, index) => (
              <tr
                key={index}
                className="border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-foreground font-medium">
                  {finding.testName}
                </td>
                <td className="py-3 px-4 text-sm text-foreground">
                  {finding.value} {finding.unit}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {finding.normalRange}
                </td>
                <td className="py-3 px-4">
                  <span className={getStatusBadge(finding.status)}>
                    {finding.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FindingsTable;
