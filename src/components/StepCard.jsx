const StepCard = ({ number, title, description, icon: Icon }) => {
  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold">{number}</span>
          </div>
        </div>
        <div className="pt-1">
          <div className="flex items-center gap-2 mb-2">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
