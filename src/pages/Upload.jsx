// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import UploadCard from "../components/UploadCard.jsx";
// import DisclaimerBox from "../components/DisclaimerBox.jsx";
// const { user } = useAuth();

// const Upload = () => {
//   const navigate = useNavigate();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [formData, setFormData] = useState({
//     category: "",
//     age: "",
//     gender: "",
//     symptoms: "",
//   });

//   const categories = [
//     { value: "blood-test", label: "Blood Test Report" },
//     { value: "radiology", label: "Radiology Report" },
//     { value: "xray", label: "X-ray Image" },
//     { value: "ecg", label: "ECG Report" },
//   ];

//   const handleFileSelect = (file) => {
//     setSelectedFile(file);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAnalyze = async () => {
//     if (!selectedFile) return;

//     setIsAnalyzing(true);
    
//     // Simulate API call
//     // setTimeout(() => {
//     //   setIsAnalyzing(false);
//     //   navigate("/dashboard");
//     // }, 2500);



    

// await supabase.from("reports").insert({
//   user_id: user.id,
//   category: formData.category,
//   symptoms: formData.symptoms,
// });

//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />

//       <main className="flex-1 py-12 px-4">
//         <div className="max-w-3xl mx-auto">
//           <div className="text-center mb-8">
//             <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
//               Upload Medical Report
//             </h1>
//             <p className="text-muted-foreground">
//               Select your report type and upload the file for analysis
//             </p>
//           </div>

//           <div className="space-y-6">
//             <UploadCard
//               onFileSelect={handleFileSelect}
//               selectedFile={selectedFile}
//               isAnalyzing={isAnalyzing}
//             />

//             {/* Report Category */}
//             <div className="medical-card">
//               <h3 className="text-lg font-semibold text-foreground mb-4">Report Details</h3>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Report Category *
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
//                   >
//                     <option value="">Select category</option>
//                     {categories.map((cat) => (
//                       <option key={cat.value} value={cat.value}>
//                         {cat.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-2">
//                       Patient Age (optional)
//                     </label>
//                     <input
//                       type="number"
//                       name="age"
//                       value={formData.age}
//                       onChange={handleInputChange}
//                       placeholder="e.g., 45"
//                       className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-foreground mb-2">
//                       Gender (optional)
//                     </label>
//                     <select
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleInputChange}
//                       className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
//                     >
//                       <option value="">Select gender</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Symptoms (optional)
//                   </label>
//                   <textarea
//                     name="symptoms"
//                     value={formData.symptoms}
//                     onChange={handleInputChange}
//                     rows={3}
//                     placeholder="Describe any symptoms or relevant medical history..."
//                     className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <DisclaimerBox />

//             <button
//               onClick={handleAnalyze}
//               disabled={!selectedFile || isAnalyzing}
//               className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isAnalyzing ? "Analyzing Report..." : "Analyze Report"}
//             </button>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Upload;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import UploadCard from "../components/UploadCard.jsx";
import DisclaimerBox from "../components/DisclaimerBox.jsx";

const Upload = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // ✅ hook TOP level

  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    age: "",
    gender: "",
    symptoms: "",
  });

  const categories = [
    { value: "blood-test", label: "Blood Test Report" },
    { value: "radiology", label: "Radiology Report" },
    { value: "xray", label: "X-ray Image" },
    { value: "ecg", label: "ECG Report" },
  ];

  // 🔐 Auth guard
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    if (!formData.category) {
      alert("Please select report category");
      return;
    }

    if (!user) {
      alert("User not found. Please login again.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // ✅ REAL DB INSERT
      const { data, error } = await supabase.from("reports").insert({
        user_id: user.id,
        category: formData.category,
        symptoms: formData.symptoms,
        age: formData.age || null,
        gender: formData.gender || null,
      }).select().single();

      if (error) throw error;

      // ✅ success
      navigate("/profile");

    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Upload Medical Report
            </h1>
            <p className="text-muted-foreground">
              Select your report type and upload the file for analysis
            </p>
          </div>

          <div className="space-y-6">
            <UploadCard
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              isAnalyzing={isAnalyzing}
            />

            {/* Report Details */}
            <div className="medical-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Report Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Report Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="age"
                    placeholder="Age (optional)"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border"
                  />

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border"
                  >
                    <option value="">Gender (optional)</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <textarea
                  name="symptoms"
                  rows={3}
                  placeholder="Symptoms (optional)"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border resize-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <DisclaimerBox />

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing Report..." : "Analyze Report"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
