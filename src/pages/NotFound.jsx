// import { Link } from "react-router-dom";
// import { Home, ArrowLeft } from "lucide-react";

// const NotFound = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <div className="text-center">
//         <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
//         <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
//         <p className="text-muted-foreground mb-8">
//           The page you're looking for doesn't exist or has been moved.
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Link
//             to="/"
//             className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
//           >
//             <Home className="h-5 w-5" />
//             Go Home
//           </Link>
//           <button
//             onClick={() => window.history.back()}
//             className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
//           >
//             <ArrowLeft className="h-5 w-5" />
//             Go Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotFound;












import { Link } from "react-router-dom";
import { Home, ArrowLeft, FileSearch } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 80%, #f0f9ff 100%)"}}>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="text-center relative z-10">

        {/* Icon */}
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
          <FileSearch className="h-10 w-10 text-primary" />
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-bold text-primary mb-2 leading-none">404</h1>

        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-primary/20">
          Page Not Found
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops! Wrong turn</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm border border-slate-200 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
