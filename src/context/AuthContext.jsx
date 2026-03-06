// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔹 session check
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data?.user ?? null);
//       setLoading(false);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user ?? null);
//       }
//     );

//     return () => listener.subscription.unsubscribe();
//   }, []);



//   useEffect(() => {
//   if (user) {
//     fetchProfile(user.id);
//     fetchReports();
//   } else {
//     setProfile(null);
//     setReports([]);
//   }
// }, [user]);




//   // const signup = async ({ email, password }) => {
//   //   const { error } = await supabase.auth.signUp({
//   //     email,
//   //     password,
//   //   });

//   //   if (error) return { success: false, error };
//   //   return { success: true };
//   // };




//   const signup = async ({ email, password, name, age, gender }) => {
//   // 1️⃣ Create user
//   const { data: signUpData, error: signUpError } =
//     await supabase.auth.signUp({ email, password });

//   if (signUpError) return { success: false, error: signUpError };

//   // 2️⃣ LOGIN immediately (THIS IS THE KEY 🔑)
//   const { data: loginData, error: loginError } =
//     await supabase.auth.signInWithPassword({ email, password });

//   if (loginError) return { success: false, error: loginError };

//   setUser(loginData.user);

//   // 3️⃣ Insert profile (NOW auth.uid() EXISTS)
//   const { error: profileError } = await supabase.from("profiles").insert({
//     id: loginData.user.id,
//     name,
//     age: age ? Number(age) : null,
//     gender,
//   });

//   if (profileError) {
//     console.error("PROFILE INSERT ERROR:", profileError);
//     return { success: false, error: profileError };
//   }

//   return { success: true };
// };







//   const login = async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) return { success: false, error };

//     setUser(data.user);
//     return { success: true };
//   };

//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };



//   const fetchProfile = async (userId) => {
//   const { data, error } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("id", userId)
//     .single();

//   if (!error) {
//     setProfile(data);
//   }
// };





//   const fetchReports = async () => {
//     if (!user) return;

//     const { data } = await supabase
//       .from("reports")
//       .select("*")
//       .eq("user_id", user.id)
//       .order("created_at", { ascending: false });

//     setReports(data || []);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//   user,
//   profile,
//   reports,
//   signup,
//   login,
//   logout,
//   fetchReports,
//   isAuthenticated: !!user,
// }}

//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);





























import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (_event === "PASSWORD_RECOVERY") {
          return;
        }
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
      fetchReports();
    } else {
      setProfile(null);
      setReports([]);
    }
  }, [user]);

  const signup = async ({ email, password, name, age, gender }) => {
    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({ email, password });

    if (signUpError) return { success: false, error: signUpError.message };

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (loginError) return { success: false, error: loginError.message };

    setUser(loginData.user);

    const { error: profileError } = await supabase.from("profiles").insert({
      id: loginData.user.id,
      name,
      age: age ? Number(age) : null,
      gender,
    });

    if (profileError) {
      console.error("PROFILE INSERT ERROR:", profileError);
      return { success: false, error: profileError.message };
    }

    return { success: true };
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let message = "Invalid email or password. Please try again.";
      if (error.message?.toLowerCase().includes("invalid login")) {
        message = "Invalid email or password. Please try again.";
      } else if (error.message?.toLowerCase().includes("email not confirmed")) {
        message = "Please verify your email before logging in.";
      } else if (error.message?.toLowerCase().includes("too many requests")) {
        message = "Too many attempts. Please wait a moment and try again.";
      } else if (error.message) {
        message = error.message;
      }
      return { success: false, error: message };
    }

    setUser(data.user);
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error) setProfile(data);
  };

  const fetchReports = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setReports(data || []);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        reports,
        signup,
        login,
        logout,
        fetchReports,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
