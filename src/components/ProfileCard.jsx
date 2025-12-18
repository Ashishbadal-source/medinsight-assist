import { User, Mail, Calendar, UserCircle } from "lucide-react";

const ProfileCard = ({ user }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <UserCircle className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted-foreground">Patient Profile</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Email:</span>
          <span className="text-foreground">{user.email}</span>
        </div>

        {user.age && (
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Age:</span>
            <span className="text-foreground">{user.age} years</span>
          </div>
        )}

        {user.gender && (
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Gender:</span>
            <span className="text-foreground">{user.gender}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Member since:</span>
          <span className="text-foreground">{formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
