import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on refresh
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchReports(data.user.id);
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const signup = async ({ name, email, password, age, gender }) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }

    // Insert profile
    await supabase.from("users").insert({
      id: data.user.id,
      name,
      age,
      gender,
    });

    setUser(data.user);
    setIsLoading(false);
    return { success: true };
  };

  const login = async (email, password) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }

    setUser(data.user);
    fetchReports(data.user.id);
    setIsLoading(false);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setReports([]);
  };

  const fetchReports = async (userId) => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setReports(data || []);
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
        signup,
        login,
        logout,
        getReportById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
