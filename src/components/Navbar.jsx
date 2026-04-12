// // import { Link, useLocation } from "react-router-dom";
// // import { Activity, Menu, X, UserCircle } from "lucide-react";
// // import { useState } from "react";
// // import { useAuth } from "../context/AuthContext.jsx";
// // import LogoutButton from "./LogoutButton.jsx";

// // const Navbar = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const location = useLocation();
// //   const { isAuthenticated, user } = useAuth();

// //   const publicLinks = [
// //     { path: "/", label: "Home" },
// //     { path: "/login", label: "Login" },
// //     { path: "/signup", label: "Signup" },
// //     { path: "/disclaimer", label: "Disclaimer" },
// //   ];

// //   const authenticatedLinks = [
// //     { path: "/profile", label: "Profile" },
// //     { path: "/upload", label: "Upload Report" },
// //     { path: "/how-it-works", label: "How It Works" },
// //   ];

// //   const navLinks = isAuthenticated ? authenticatedLinks : publicLinks;

// //   const isActive = (path) => location.pathname === path;

// //   return (
// //     <nav className="bg-card border-b border-border sticky top-0 z-50">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex justify-between h-16">
// //           <div className="flex items-center">
// //             <Link to="/" className="flex items-center gap-2">
// //               <Activity className="h-8 w-8 text-primary" />
// //               <span className="text-xl font-semibold text-foreground">
// //                 MedInsight AI
// //               </span>
// //             </Link>
// //           </div>

// //           {/* Desktop Navigation */}
// //           <div className="hidden md:flex items-center space-x-1">
// //             {navLinks.map((link) => (
// //               <Link
// //                 key={link.path}
// //                 to={link.path}
// //                 className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// //                   isActive(link.path)
// //                     ? "bg-primary text-primary-foreground"
// //                     : "text-muted-foreground hover:text-foreground hover:bg-secondary"
// //                 }`}
// //               >
// //                 {link.label}
// //               </Link>
// //             ))}
            
// //             {isAuthenticated && (
// //               <>
// //                 <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
// //                   <UserCircle className="h-5 w-5 text-muted-foreground" />
// //                   <span className="text-sm font-medium text-foreground">
// //                     {user?.name?.split(" ")[0]}
// //                   </span>
// //                 </div>
// //                 <LogoutButton />
// //               </>
// //             )}
// //           </div>

// //           {/* Mobile menu button */}
// //           <div className="md:hidden flex items-center">
// //             <button
// //               onClick={() => setIsOpen(!isOpen)}
// //               className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
// //             >
// //               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Mobile Navigation */}
// //         {isOpen && (
// //           <div className="md:hidden pb-4">
// //             {isAuthenticated && (
// //               <div className="flex items-center gap-2 px-4 py-3 mb-2 border-b border-border">
// //                 <UserCircle className="h-5 w-5 text-muted-foreground" />
// //                 <span className="text-sm font-medium text-foreground">
// //                   {user?.name}
// //                 </span>
// //               </div>
// //             )}
            
// //             {navLinks.map((link) => (
// //               <Link
// //                 key={link.path}
// //                 to={link.path}
// //                 onClick={() => setIsOpen(false)}
// //                 className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// //                   isActive(link.path)
// //                     ? "bg-primary text-primary-foreground"
// //                     : "text-muted-foreground hover:text-foreground hover:bg-secondary"
// //                 }`}
// //               >
// //                 {link.label}
// //               </Link>
// //             ))}
            
// //             {isAuthenticated && (
// //               <div className="mt-2 px-4">
// //                 <LogoutButton />
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;


























// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import { Activity, Menu, X, UserCircle } from "lucide-react";
// // import { useState } from "react";
// // import { useAuth } from "../context/AuthContext.jsx";
// // import LogoutButton from "./LogoutButton.jsx";

// // const Navbar = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const { isAuthenticated, user } = useAuth();

// //   const publicLinks = [
// //     { path: "/", label: "Home" },
// //     { path: "/login", label: "Login" },
// //     { path: "/signup", label: "Signup" },
// //     { path: "/disclaimer", label: "Disclaimer" },
// //   ];

// //   const authenticatedLinks = [
// //     { path: "/profile", label: "Profile" },
// //     { path: "/upload", label: "Upload Report" },
// //     { path: "/how-it-works", label: "How It Works" },
// //   ];

// //   const navLinks = isAuthenticated ? authenticatedLinks : publicLinks;

// //   const isActive = (path) => location.pathname === path;

// //   return (
// //     <nav className="bg-card border-b border-border sticky top-0 z-50">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex justify-between h-16">
// //           <div className="flex items-center">
// //             <Link to="/" className="flex items-center gap-2">
// //               <Activity className="h-8 w-8 text-primary" />
// //               <span className="text-xl font-semibold text-foreground">
// //                 MedInsight AI
// //               </span>
// //             </Link>
// //           </div>

// //           {/* Desktop Navigation */}
// //           <div className="hidden md:flex items-center space-x-1">
// //             {navLinks.map((link) => (
// //               <Link
// //                 key={link.path}
// //                 to={link.path}
// //                 className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// //                   isActive(link.path)
// //                     ? "bg-primary text-primary-foreground"
// //                     : "text-muted-foreground hover:text-foreground hover:bg-secondary"
// //                 }`}
// //               >
// //                 {link.label}
// //               </Link>
// //             ))}

// //             {isAuthenticated && (
// //               <>
// //                 <div
// //                   className="flex items-center gap-2 ml-4 pl-4 border-l border-border cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
// //                   onClick={() => navigate("/profile")}
// //                 >
// //                   <UserCircle className="h-5 w-5" />
// //                   <span className="text-sm font-medium text-foreground">
// //                     {user?.name?.split(" ")[0]}
// //                   </span>
// //                 </div>
// //                 <LogoutButton />
// //               </>
// //             )}
// //           </div>

// //           {/* Mobile menu button */}
// //           <div className="md:hidden flex items-center">
// //             <button
// //               onClick={() => setIsOpen(!isOpen)}
// //               className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
// //             >
// //               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Mobile Navigation */}
// //         {isOpen && (
// //           <div className="md:hidden pb-4">
// //             {isAuthenticated && (
// //               <div
// //                 className="flex items-center gap-2 px-4 py-3 mb-2 border-b border-border cursor-pointer hover:bg-secondary"
// //                 onClick={() => { navigate("/profile"); setIsOpen(false); }}
// //               >
// //                 <UserCircle className="h-5 w-5 text-muted-foreground" />
// //                 <span className="text-sm font-medium text-foreground">
// //                   {user?.name}
// //                 </span>
// //               </div>
// //             )}

// //             {navLinks.map((link) => (
// //               <Link
// //                 key={link.path}
// //                 to={link.path}
// //                 onClick={() => setIsOpen(false)}
// //                 className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
// //                   isActive(link.path)
// //                     ? "bg-primary text-primary-foreground"
// //                     : "text-muted-foreground hover:text-foreground hover:bg-secondary"
// //                 }`}
// //               >
// //                 {link.label}
// //               </Link>
// //             ))}

// //             {isAuthenticated && (
// //               <div className="mt-2 px-4">
// //                 <LogoutButton />
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;



























// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Activity, Menu, X, UserCircle, Home } from "lucide-react";
// import { useState } from "react";
// import { useAuth } from "../context/AuthContext.jsx";
// import LogoutButton from "./LogoutButton.jsx";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isAuthenticated, user } = useAuth();

//   const publicLinks = [
//     { path: "/", label: "Home" },
//     { path: "/login", label: "Login" },
//     { path: "/signup", label: "Signup" },
//     { path: "/disclaimer", label: "Disclaimer" },
//   ];

//   const authenticatedLinks = [
//     { path: "/", label: "Home" },
//     { path: "/profile", label: "Profile" },
//     { path: "/upload", label: "Upload Report" },
//     { path: "/how-it-works", label: "How It Works" },
//   ];

//   const navLinks = isAuthenticated ? authenticatedLinks : publicLinks;

//   const isActive = (path) => location.pathname === path;

//   return (
//     <nav className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center gap-2 group">
//               <div className="p-1.5 bg-primary rounded-lg group-hover:bg-primary/90 transition-colors">
//                 <Activity className="h-5 w-5 text-white" />
//               </div>
//               <span className="text-xl font-semibold text-foreground">
//                 MedInsight <span className="text-primary">AI</span>
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                   isActive(link.path)
//                     ? "bg-primary text-primary-foreground shadow-sm"
//                     : "text-muted-foreground hover:text-foreground hover:bg-secondary"
//                 }`}
//               >
//                 {link.path === "/" && isAuthenticated ? (
//                   <span className="flex items-center gap-1.5">
//                     <Home className="h-4 w-4" />
//                     Home
//                   </span>
//                 ) : link.label}
//               </Link>
//             ))}

//             {isAuthenticated && (
//               <>
//                 <div className="w-px h-6 bg-border mx-2" />
//                 <div
//                   className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
//                   onClick={() => navigate("/profile")}
//                 >
//                   <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
//                     <UserCircle className="h-5 w-5 text-primary" />
//                   </div>
//                   <span className="text-sm font-medium text-foreground">
//                     {user?.email?.split("@")[0]}
//                   </span>
//                 </div>
//                 <LogoutButton />
//               </>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
//             >
//               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isOpen && (
//           <div className="md:hidden pb-4 border-t border-border pt-3">
//             {isAuthenticated && (
//               <div
//                 className="flex items-center gap-3 px-4 py-3 mb-2 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
//                 onClick={() => { navigate("/profile"); setIsOpen(false); }}
//               >
//                 <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                   <UserCircle className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-foreground">{user?.email?.split("@")[0]}</p>
//                   <p className="text-xs text-muted-foreground">{user?.email}</p>
//                 </div>
//               </div>
//             )}

//             <div className="space-y-1">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={() => setIsOpen(false)}
//                   className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
//                     isActive(link.path)
//                       ? "bg-primary text-primary-foreground"
//                       : "text-muted-foreground hover:text-foreground hover:bg-secondary"
//                   }`}
//                 >
//                   {link.path === "/" && <Home className="h-4 w-4" />}
//                   {link.label}
//                 </Link>
//               ))}
//             </div>

//             {isAuthenticated && (
//               <div className="mt-3 px-4">
//                 <LogoutButton />
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




import { Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, Menu, X, UserCircle, Home, Info, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import LogoutButton from "./LogoutButton.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Handle scroll effect for a more premium feel
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const publicLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/disclaimer", label: "Disclaimer", icon: ShieldCheck },
    { path: "/login", label: "Login" },
    { path: "/signup", label: "Get Started" },
  ];

  const authenticatedLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/upload", label: "Analyze Report" },
    { path: "/how-it-works", label: "Workflow" },
    { path: "/about", label: "Meet the Team", icon: Info },
  ];

  const navLinks = isAuthenticated ? authenticatedLinks : publicLinks;
  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled 
          ? "bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-blue-600 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tighter">
                MedInsight<span className="text-blue-600">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive(link.path)
                    ? "bg-white text-blue-600 shadow-md scale-105"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <button
                  onClick={() => navigate("/profile")}
                  className="group flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                    <UserCircle size={20} />
                  </div>
                  <span className="text-xs font-bold text-gray-700 max-w-[100px] truncate">
                    {user?.email?.split('@')[0]}
                  </span>
                </button>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex gap-2">
                 {/* Login buttons logic if needed, otherwise handled by navLinks */}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-3xl border border-gray-100 shadow-2xl p-6 animate-in slide-in-from-top-5 duration-300">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                    isActive(link.path)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {link.icon && <link.icon size={20} />}
                  {link.label}
                </Link>
              ))}
              
              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-2">
                     <UserCircle className="text-blue-600" size={32} />
                     <div>
                        <p className="text-sm font-black text-gray-900">{user?.email?.split('@')[0]}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                     </div>
                  </div>
                  <LogoutButton />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;