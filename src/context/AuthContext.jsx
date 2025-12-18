import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Dummy user data
const dummyUser = {
  id: "user-001",
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@clinic.com",
  age: 34,
  gender: "Female",
  createdAt: "2024-06-15",
};

// Dummy reports data
const dummyReports = [
  {
    id: "report-001",
    type: "Blood Test",
    date: "2024-12-18",
    time: "10:30 AM",
    confidence: 87,
    summary: "Complete Blood Count showing elevated WBC and borderline cholesterol",
    status: "Completed",
  },
  {
    id: "report-002",
    type: "X-ray",
    date: "2024-12-10",
    time: "02:15 PM",
    confidence: 92,
    summary: "Chest X-ray analysis with clear lung fields",
    status: "Completed",
  },
  {
    id: "report-003",
    type: "ECG",
    date: "2024-11-28",
    time: "09:00 AM",
    confidence: 78,
    summary: "ECG showing normal sinus rhythm with minor variations",
    status: "Completed",
  },
  {
    id: "report-004",
    type: "Radiology",
    date: "2024-11-15",
    time: "11:45 AM",
    confidence: 85,
    summary: "MRI scan of lower back showing mild disc degeneration",
    status: "Completed",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState(dummyReports);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser(dummyUser);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (userData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUser({
      ...dummyUser,
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    });
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const getReportById = (id) => {
    return reports.find((r) => r.id === id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        reports,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        getReportById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
