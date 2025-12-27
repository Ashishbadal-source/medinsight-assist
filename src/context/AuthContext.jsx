// // import { createContext, useContext, useEffect, useState } from "react";
// // import { supabase } from "../lib/supabase";

// // const AuthContext = createContext(null);

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [reports, setReports] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);

// //   // 🔹 Check session on refresh
// //   useEffect(() => {
// //     const getSession = async () => {
// //       const { data } = await supabase.auth.getSession();
// //       setUser(data?.session?.user || null);
// //       setIsLoading(false);
// //     };

// //     getSession();
// //   }, []);

// //   // 🔹 LOGIN
// //   const login = async (email, password) => {
// //     const { data, error } = await supabase.auth.signInWithPassword({
// //       email,
// //       password,
// //     });

// //     if (error) return { success: false, error };
// //     setUser(data.user);
// //     return { success: true };
// //   };

// //   // 🔹 SIGNUP
// //   const signup = async ({ email, password, name, age, gender }) => {
// //     const { data, error } = await supabase.auth.signUp({
// //       email,
// //       password,
// //     });

// //     if (error) return { success: false, error };

// //     // 👇 profile insert
// //     await supabase.from("profiles").insert({
// //       id: data.user.id,
// //       name,
// //       age,
// //       gender,
// //     });

// //     setUser(data.user);
// //     return { success: true };
// //   };

// //   // 🔹 LOGOUT
// //   const logout = async () => {
// //     await supabase.auth.signOut();
// //     setUser(null);
// //   };

// //   // 🔹 FETCH REPORTS
// //   const fetchReports = async () => {
// //     const { data } = await supabase
// //       .from("reports")
// //       .select("*")
// //       .order("created_at", { ascending: false });

// //     setReports(data || []);
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         reports,
// //         isLoading,
// //         login,
// //         signup,
// //         logout,
// //         fetchReports,
// //         isAuthenticated: !!user,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => useContext(AuthContext);







// // import { createContext, useContext, useEffect, useState } from "react";
// // import { supabase } from "../lib/supabase";

// // const AuthContext = createContext(null);

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [reports, setReports] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);

// //   // session check
// //   useEffect(() => {
// //     const getSession = async () => {
// //       const { data } = await supabase.auth.getSession();
// //       setUser(data?.session?.user || null);
// //       setIsLoading(false);
// //     };
// //     getSession();
// //   }, []);

// //   const login = async (email, password) => {
// //     const { data, error } = await supabase.auth.signInWithPassword({
// //       email,
// //       password,
// //     });
// //     if (error) return { success: false, error };
// //     setUser(data.user);
// //     return { success: true };
// //   };

// //   const signup = async ({ email, password, name, age, gender }) => {
// //     const { data, error } = await supabase.auth.signUp({
// //       email,
// //       password,
// //     });
// //     if (error) return { success: false, error };

// //     const { error: profileError } = await supabase.from("profiles").insert({
// //       id: data.user.id,
// //       name,
// //       age,
// //       gender,
// //     });


// //     if (profileError) {
// //     console.error("Profile insert error:", profileError);
// //     return { success: false, error: profileError };
// //   }



// //     setUser(data.user);
// //     return { success: true };
// //   };

// //   const logout = async () => {
// //     await supabase.auth.signOut();
// //     setUser(null);
// //   };

// //   const fetchReports = async () => {
// //     const { data } = await supabase
// //       .from("reports")
// //       .select("*")
// //       .order("created_at", { ascending: false });
// //     setReports(data || []);
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         reports,
// //         isLoading,
// //         login,
// //         signup,
// //         logout,
// //         fetchReports,
// //         isAuthenticated: !!user,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => useContext(AuthContext);





















// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

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

//   // 🔥 SIGNUP FUNCTION
//   const signup = async (form) => {
//     const { email, password, name, age, gender } = form;

//     // 1️⃣ Create auth user
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     if (error) return { success: false, error };

//     const user = data.user;

//     // 2️⃣ Insert profile data
//     const { error: profileError } = await supabase
//       .from("profiles")
//       .insert({
//         id: user.id,
//         name,
//         age: age ? Number(age) : null,
//         gender,
//       });

//     if (profileError) {
//       return { success: false, error: profileError };
//     }

//     return { success: true };
//   };

//   return (
//     <AuthContext.Provider value={{ user, signup }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
















// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       setSession(data.session);
//       setUser(data.session?.user ?? null);
//       setLoading(false);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setSession(session);
//         setUser(session?.user ?? null);
//       }
//     );

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   // ✅ LOGIN
//   const login = async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     if (error) return { success: false, error };
//     return { success: true };
//   };

//   // ✅ SIGNUP (ONLY AUTH)
// const signup = async ({ email, password }) => {
//   const { data ,error } = await supabase.auth.signUp({
//     email: String(email).trim(),
//     password: String(password),
//   });

//   if (error) return { success: false, error };


//   // 🔥 auto-login session
//   if (data.session) {
//     setUser(data.user);
//   }



//   return { success: true };
// };


//   // ✅ LOGOUT
//   const logout = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         session,
//         login,
//         signup,
//         logout,
//         isAuthenticated: !!user,
//       }}
//     >
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);









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
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//   });

//   if (error) return { success: false, error };

//   // 🔹 profile insert
//   const { error: profileError } = await supabase.from("profiles").insert({
//     id: data.user.id,
//     name,
//     age: age ? Number(age) : null,
//     gender,
//   });

//   if (profileError) {
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

  // 🔹 session check
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



  useEffect(() => {
  if (user) {
    fetchProfile(user.id);
    fetchReports();
  } else {
    setProfile(null);
    setReports([]);
  }
}, [user]);




  // const signup = async ({ email, password }) => {
  //   const { error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //   });

  //   if (error) return { success: false, error };
  //   return { success: true };
  // };




  const signup = async ({ email, password, name, age, gender }) => {
  // 1️⃣ Create user
  const { data: signUpData, error: signUpError } =
    await supabase.auth.signUp({ email, password });

  if (signUpError) return { success: false, error: signUpError };

  // 2️⃣ LOGIN immediately (THIS IS THE KEY 🔑)
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (loginError) return { success: false, error: loginError };

  setUser(loginData.user);

  // 3️⃣ Insert profile (NOW auth.uid() EXISTS)
  const { error: profileError } = await supabase.from("profiles").insert({
    id: loginData.user.id,
    name,
    age: age ? Number(age) : null,
    gender,
  });

  if (profileError) {
    console.error("PROFILE INSERT ERROR:", profileError);
    return { success: false, error: profileError };
  }

  return { success: true };
};







  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, error };

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

  if (!error) {
    setProfile(data);
  }
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
