// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // 🔹 Check session on refresh
//   useEffect(() => {
//     const getSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       setUser(data?.session?.user || null);
//       setIsLoading(false);
//     };

//     getSession();
//   }, []);

//   // 🔹 LOGIN
//   const login = async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) return { success: false, error };
//     setUser(data.user);
//     return { success: true };
//   };

//   // 🔹 SIGNUP
//   const signup = async ({ email, password, name, age, gender }) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     if (error) return { success: false, error };

//     // 👇 profile insert
//     await supabase.from("profiles").insert({
//       id: data.user.id,
//       name,
//       age,
//       gender,
//     });

//     setUser(data.user);
//     return { success: true };
//   };

//   // 🔹 LOGOUT
//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };

//   // 🔹 FETCH REPORTS
//   const fetchReports = async () => {
//     const { data } = await supabase
//       .from("reports")
//       .select("*")
//       .order("created_at", { ascending: false });

//     setReports(data || []);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         reports,
//         isLoading,
//         login,
//         signup,
//         logout,
//         fetchReports,
//         isAuthenticated: !!user,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);







import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // session check
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      setIsLoading(false);
    };
    getSession();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { success: false, error };
    setUser(data.user);
    return { success: true };
  };

  const signup = async ({ email, password, name, age, gender }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) return { success: false, error };

    await supabase.from("profiles").insert({
      id: data.user.id,
      name,
      age,
      gender,
    });

    setUser(data.user);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const fetchReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    setReports(data || []);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        reports,
        isLoading,
        login,
        signup,
        logout,
        fetchReports,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
