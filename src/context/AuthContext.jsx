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







// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // session check
//   useEffect(() => {
//     const getSession = async () => {
//       const { data } = await supabase.auth.getSession();
//       setUser(data?.session?.user || null);
//       setIsLoading(false);
//     };
//     getSession();
//   }, []);

//   const login = async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     if (error) return { success: false, error };
//     setUser(data.user);
//     return { success: true };
//   };

//   const signup = async ({ email, password, name, age, gender }) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });
//     if (error) return { success: false, error };

//     const { error: profileError } = await supabase.from("profiles").insert({
//       id: data.user.id,
//       name,
//       age,
//       gender,
//     });


//     if (profileError) {
//     console.error("Profile insert error:", profileError);
//     return { success: false, error: profileError };
//   }



//     setUser(data.user);
//     return { success: true };
//   };

//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };

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

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔥 SIGNUP FUNCTION
  const signup = async (form) => {
    const { email, password, name, age, gender } = form;

    // 1️⃣ Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { success: false, error };

    const user = data.user;

    // 2️⃣ Insert profile data
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name,
        age: age ? Number(age) : null,
        gender,
      });

    if (profileError) {
      return { success: false, error: profileError };
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, signup }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
