const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="medical-card hover:shadow-md transition-shadow">
      <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
