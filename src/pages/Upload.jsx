// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { supabase } from "../lib/supabase";
// // import { useAuth } from "../context/AuthContext";
// // import Navbar from "../components/Navbar.jsx";
// // import Footer from "../components/Footer.jsx";
// // import UploadCard from "../components/UploadCard.jsx";
// // import DisclaimerBox from "../components/DisclaimerBox.jsx";
// // const { user } = useAuth();

// // const Upload = () => {
// //   const navigate = useNavigate();
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// //   const [formData, setFormData] = useState({
// //     category: "",
// //     age: "",
// //     gender: "",
// //     symptoms: "",
// //   });

// //   const categories = [
// //     { value: "blood-test", label: "Blood Test Report" },
// //     { value: "radiology", label: "Radiology Report" },
// //     { value: "xray", label: "X-ray Image" },
// //     { value: "ecg", label: "ECG Report" },
// //   ];

// //   const handleFileSelect = (file) => {
// //     setSelectedFile(file);
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleAnalyze = async () => {
// //     if (!selectedFile) return;

// //     setIsAnalyzing(true);
    
// //     // Simulate API call
// //     // setTimeout(() => {
// //     //   setIsAnalyzing(false);
// //     //   navigate("/dashboard");
// //     // }, 2500);



    

// // await supabase.from("reports").insert({
// //   user_id: user.id,
// //   category: formData.category,
// //   symptoms: formData.symptoms,
// // });

// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col bg-background">
// //       <Navbar />

// //       <main className="flex-1 py-12 px-4">
// //         <div className="max-w-3xl mx-auto">
// //           <div className="text-center mb-8">
// //             <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
// //               Upload Medical Report
// //             </h1>
// //             <p className="text-muted-foreground">
// //               Select your report type and upload the file for analysis
// //             </p>
// //           </div>

// //           <div className="space-y-6">
// //             <UploadCard
// //               onFileSelect={handleFileSelect}
// //               selectedFile={selectedFile}
// //               isAnalyzing={isAnalyzing}
// //             />

// //             {/* Report Category */}
// //             <div className="medical-card">
// //               <h3 className="text-lg font-semibold text-foreground mb-4">Report Details</h3>
              
// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-foreground mb-2">
// //                     Report Category *
// //                   </label>
// //                   <select
// //                     name="category"
// //                     value={formData.category}
// //                     onChange={handleInputChange}
// //                     className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
// //                   >
// //                     <option value="">Select category</option>
// //                     {categories.map((cat) => (
// //                       <option key={cat.value} value={cat.value}>
// //                         {cat.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 <div className="grid md:grid-cols-2 gap-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-foreground mb-2">
// //                       Patient Age (optional)
// //                     </label>
// //                     <input
// //                       type="number"
// //                       name="age"
// //                       value={formData.age}
// //                       onChange={handleInputChange}
// //                       placeholder="e.g., 45"
// //                       className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-foreground mb-2">
// //                       Gender (optional)
// //                     </label>
// //                     <select
// //                       name="gender"
// //                       value={formData.gender}
// //                       onChange={handleInputChange}
// //                       className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
// //                     >
// //                       <option value="">Select gender</option>
// //                       <option value="male">Male</option>
// //                       <option value="female">Female</option>
// //                       <option value="other">Other</option>
// //                     </select>
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-foreground mb-2">
// //                     Symptoms (optional)
// //                   </label>
// //                   <textarea
// //                     name="symptoms"
// //                     value={formData.symptoms}
// //                     onChange={handleInputChange}
// //                     rows={3}
// //                     placeholder="Describe any symptoms or relevant medical history..."
// //                     className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             <DisclaimerBox />

// //             <button
// //               onClick={handleAnalyze}
// //               disabled={!selectedFile || isAnalyzing}
// //               className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               {isAnalyzing ? "Analyzing Report..." : "Analyze Report"}
// //             </button>
// //           </div>
// //         </div>
// //       </main>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Upload;









// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const Upload = () => {
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const [type, setType] = useState("");
//   const [summary, setSummary] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!isAuthenticated) navigate("/login");
//   }, [isAuthenticated]);

//   const handleSubmit = async () => {
//     setIsLoading(true);

//     const { error } = await supabase.from("reports").insert({
//       user_id: user.id,
//       type,
//       summary,
//       confidence: 80,
//     });

//     setIsLoading(false);

//     if (!error) navigate("/profile");
//     else console.error(error);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />

//       <main className="flex-1 max-w-xl mx-auto p-6">
//         <input
//           placeholder="Report Type"
//           className="w-full border p-3 mb-4"
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//         />

//         <textarea
//           placeholder="Summary"
//           className="w-full border p-3 mb-4"
//           value={summary}
//           onChange={(e) => setSummary(e.target.value)}
//         />

//         <button
//           onClick={handleSubmit}
//           disabled={isLoading}
//           className="w-full bg-primary text-white p-3 rounded"
//         >
//           {isLoading ? "Saving..." : "Save Report"}
//         </button>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Upload;











// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";

// const Upload = () => {
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const [symptoms, setSymptoms] = useState("");
//   const [category, setCategory] = useState("");

//   if (!isAuthenticated) {
//     navigate("/login");
//     return null;
//   }

//   // const handleUpload = async () => {
//   //   const { error } = await supabase.from("reports").insert({
//   //     user_id: user.id,
//   //     category,
//   //     symptoms,
//   //   });

//   //   if (!error) navigate("/profile");
//   //   else alert(error.message);
//   // };



//   const handleUpload = async () => {
//   alert("Upload will be connected to backend next step");
// };





//   return (
//     <>
//       <input placeholder="Category" onChange={e=>setCategory(e.target.value)} />
//       <textarea placeholder="Symptoms" onChange={e=>setSymptoms(e.target.value)} />
//       <button onClick={handleUpload}>Upload</button>
//     </>
//   );
// };

// export default Upload;












// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar.jsx";
// import Footer from "../components/Footer.jsx";
// import { useAuth } from "../context/AuthContext.jsx";

// const Upload = () => {
//   const { user, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const [category, setCategory] = useState("");
//   const [symptoms, setSymptoms] = useState("");

//   if (!isAuthenticated) {
//     navigate("/login");
//     return null;
//   }

//   const handleUpload = () => {
//     alert("Next step: Upload will be connected to backend AI pipeline");
//     navigate("/profile");
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />

//       <main className="flex-1 py-12 px-4">
//         <div className="max-w-xl mx-auto bg-card border border-border rounded-xl p-6 space-y-4">
//           <h1 className="text-xl font-semibold text-foreground">
//             Upload Medical Report
//           </h1>

//           <input
//             className="w-full border p-3 rounded"
//             placeholder="Report Category (Blood Test, X-ray, ECG...)"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           />

//           <textarea
//             className="w-full border p-3 rounded"
//             placeholder="Describe symptoms (optional)"
//             rows={4}
//             value={symptoms}
//             onChange={(e) => setSymptoms(e.target.value)}
//           />

//           <button
//             onClick={handleUpload}
//             className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium"
//           >
//             Upload Report
//           </button>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Upload;


































// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";

// const Upload = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [category, setCategory] = useState("");
//   const [symptoms, setSymptoms] = useState("");

//   const handleUpload = async () => {
//     if (!category) {
//       alert("Please select category");
//       return;
//     }

//     const { error } = await supabase.from("reports").insert({
//       user_id: user.id,
//       category,
//       symptoms,
//     });

//     if (error) {
//       alert(error.message);
//     } else {
//       navigate("/profile");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 space-y-4">
//       <input
//         className="w-full border p-3"
//         placeholder="Report Category"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//       />

//       <textarea
//         className="w-full border p-3"
//         placeholder="Symptoms"
//         value={symptoms}
//         onChange={(e) => setSymptoms(e.target.value)}
//       />

//       <button
//         onClick={handleUpload}
//         className="w-full bg-primary text-white py-3 rounded"
//       >
//         Upload Report
//       </button>
//     </div>
//   );
// };

// export default Upload;





















// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Upload as UploadIcon } from "lucide-react";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";

// const Upload = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [reportType, setReportType] = useState("");
//   const [age, setAge] = useState("");
//   const [gender, setGender] = useState("");
//   const [symptoms, setSymptoms] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);


//   const handleAnalyze = async () => {
//     if (!reportType) {
//       alert("Please select report category");
//       return;
//     }

//     setLoading(true);

//     const { error } = await supabase.from("reports").insert({
//       user_id: user.id,
//       report_type: reportType,
//       file_path: "placeholder", // later real upload
//     });

//     setLoading(false);

//     if (error) {
//       alert(error.message);
//     } else {
//       navigate("/profile");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       {/* MAIN */}
//       <main className="flex-1 py-10 px-4">
//         <div className="max-w-3xl mx-auto space-y-8">
//           {/* Heading */}
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-foreground">
//               Upload Medical Report
//             </h1>
//             <p className="text-muted-foreground mt-2">
//               Select your report type and upload the file for analysis
//             </p>
//           </div>

//           <div className="bg-card border border-border rounded-xl p-6">
//   <h2 className="font-semibold mb-4">Upload Medical Report</h2>

//   <label
//     htmlFor="reportFile"
//     className="cursor-pointer border-2 border-dashed rounded-xl p-10 text-center text-muted-foreground hover:border-primary transition block"
//   >
//     <UploadIcon className="mx-auto mb-3 w-8 h-8" />

//     {file ? (
//       <p className="font-medium text-foreground">
//         Selected file: {file.name}
//       </p>
//     ) : (
//       <>
//         <p className="font-medium">Drag and drop your file here</p>
//         <p className="text-sm">or click to browse</p>
//       </>
//     )}

//     <div className="mt-4 text-sm flex justify-center gap-4">
//       <span>📄 PDF Reports</span>
//       <span>🩻 X-ray Images</span>
//       <span>❤️ ECG Reports</span>
//     </div>

//     {/* REAL FILE INPUT */}
//     <input
//       id="reportFile"
//       type="file"
//       accept=".pdf,image/*"
//       className="hidden"
//       onChange={(e) => setFile(e.target.files[0])}
//     />
//   </label>
// </div>


//           {/* Report Details */}
//           <div className="bg-card border border-border rounded-xl p-6 space-y-5">
//             <h2 className="font-semibold">Report Details</h2>

//             {/* Category */}
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Report Category *
//               </label>
//               <select
//                 value={reportType}
//                 onChange={(e) => setReportType(e.target.value)}
//                 className="w-full border border-border rounded-lg px-4 py-2 bg-background"
//               >
//                 <option value="">Select category</option>
//                 <option value="Blood Test">Blood Test</option>
//                 <option value="X-Ray">X-Ray</option>
//                 <option value="ECG">ECG</option>
//                 <option value="Ultrasound">Ultrasound</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Age + Gender */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Patient Age (optional)
//                 </label>
//                 <input
//                   type="number"
//                   value={age}
//                   onChange={(e) => setAge(e.target.value)}
//                   placeholder="e.g., 45"
//                   className="w-full border border-border rounded-lg px-4 py-2 bg-background"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Gender (optional)
//                 </label>
//                 <select
//                   value={gender}
//                   onChange={(e) => setGender(e.target.value)}
//                   className="w-full border border-border rounded-lg px-4 py-2 bg-background"
//                 >
//                   <option value="">Select gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>

//             {/* Symptoms */}
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Symptoms (optional)
//               </label>
//               <textarea
//                 rows={4}
//                 value={symptoms}
//                 onChange={(e) => setSymptoms(e.target.value)}
//                 placeholder="Describe any symptoms or relevant medical history..."
//                 className="w-full border border-border rounded-lg px-4 py-2 bg-background"
//               />
//             </div>
//           </div>

//           {/* Disclaimer */}
//           <div className="bg-muted border border-border rounded-xl p-4 text-sm">
//             ⚠️ This output is generated by an AI-assisted system and should not
//             be considered a medical diagnosis. Always consult a qualified
//             healthcare professional.
//           </div>

//           {/* Button */}
//           <button
//             onClick={handleAnalyze}
//             disabled={loading}
//             className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition disabled:opacity-50"
//           >
//             {loading ? "Analyzing..." : "Analyze Report"}
//           </button>
//         </div>
//       </main>

//       {/* FOOTER */}
//       <footer className="border-t border-border py-8 px-6">
//         <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-sm">
//           <div>
//             <h3 className="font-semibold mb-2">MedInsight AI</h3>
//             <p className="text-muted-foreground">
//               Clinical Decision Support System for Multimodal Medical Report
//               Analysis
//             </p>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-2">Quick Links</h3>
//             <ul className="space-y-1 text-muted-foreground">
//               <li>Upload Reports</li>
//               <li>How It Works</li>
//               <li>Disclaimer</li>
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-2">Important Notice</h3>
//             <p className="text-muted-foreground">
//               This system assists healthcare professionals and does not provide
//               medical diagnoses.
//             </p>
//           </div>
//         </div>

//         <p className="text-center text-xs text-muted-foreground mt-6">
//           © 2025 MedInsight AI. For clinical decision support only.
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default Upload;





















// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Upload as UploadIcon } from "lucide-react";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";

// const Upload = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [reportType, setReportType] = useState("");
//   const [age, setAge] = useState("");
//   const [gender, setGender] = useState("");
//   const [symptoms, setSymptoms] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);




//   console.log("AGE:", age);
// console.log("GENDER:", gender);
// console.log("SYMPTOMS:", symptoms);

//   const handleAnalyze = async () => {
//     if (!user) {
//       alert("User not logged in");
//       return;
//     }

//     if (!reportType) {
//       alert("Please select report category");
//       return;
//     }

//     if (!file) {
//       alert("Please upload a report file");
//       return;
//     }

//     setLoading(true);

//     /* ------------------ 1️⃣ Upload file to storage ------------------ */
//     const fileExt = file.name.split(".").pop();
//     const fileName = `${user.id}/${Date.now()}.${fileExt}`;

//     const { error: uploadError } = await supabase.storage
//       .from("medical-reports")
//       .upload(fileName, file);

//     if (uploadError) {
//       setLoading(false);
//       alert(uploadError.message);
//       return;
//     }

//     /* ------------------ 2️⃣ Insert metadata into DB ------------------ */
//     const { error: dbError } = await supabase.from("reports").insert({
//       user_id: user.id,
//       report_type: reportType,
//       file_path: fileName,
//       age: age ? Number(age) : null,
//       gender: gender || null,
//       symptoms: symptoms || null,
//     });

//     setLoading(false);

//     if (dbError) {
//       alert(dbError.message);
//     } else {
//       navigate("/profile");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <main className="flex-1 py-10 px-4">
//         <div className="max-w-3xl mx-auto space-y-8">

//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-foreground">
//               Upload Medical Report
//             </h1>
//             <p className="text-muted-foreground mt-2">
//               Select your report type and upload the file for analysis
//             </p>
//           </div>

//           {/* Upload Box */}
//           <div className="bg-card border border-border rounded-xl p-6">
//             <h2 className="font-semibold mb-4">Upload Medical Report</h2>

//             <label
//               htmlFor="reportFile"
//               className="cursor-pointer border-2 border-dashed rounded-xl p-10 text-center hover:border-primary transition block"
//             >
//               <UploadIcon className="mx-auto mb-3 w-8 h-8" />

//               {file ? (
//                 <p className="font-medium">{file.name}</p>
//               ) : (
//                 <>
//                   <p className="font-medium">Drag and drop your file here</p>
//                   <p className="text-sm">or click to browse</p>
//                 </>
//               )}

//               <input
//                 id="reportFile"
//                 type="file"
//                 accept=".pdf,image/*"
//                 className="hidden"
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//             </label>
//           </div>

//           {/* Report Details */}
//           <div className="bg-card border border-border rounded-xl p-6 space-y-5">
//             <select
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2"
//             >
//               <option value="">Select category</option>
//               <option value="Blood Test">Blood Test</option>
//               <option value="X-Ray">X-Ray</option>
//               <option value="ECG">ECG</option>
//               <option value="Ultrasound">Ultrasound</option>
//             </select>

//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="number"
//                 placeholder="Age"
//                 value={age}
//                 onChange={(e) => setAge(e.target.value)}
//                 className="border rounded-lg px-4 py-2"
//               />

//               <select
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//                 className="border rounded-lg px-4 py-2"
//               >
//                 <option value="">Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <textarea
//               rows={4}
//               placeholder="Symptoms"
//               value={symptoms}
//               onChange={(e) => setSymptoms(e.target.value)}
//               className="border rounded-lg px-4 py-2 w-full"
//             />
//           </div>

//           <button
//             onClick={handleAnalyze}
//             disabled={loading}
//             className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium"
//           >
//             {loading ? "Analyzing..." : "Analyze Report"}
//           </button>

//         </div>
//       </main>
//     </div>
//   );
// };

// export default Upload;



































import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reportType, setReportType] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    if (!reportType) {
      alert("Please select report category");
      return;
    }

    if (!file) {
      alert("Please upload a report file");
      return;
    }

    setLoading(true);

    /* 1️⃣ Upload file */
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("medical-reports")
      .upload(fileName, file);

    if (uploadError) {
      setLoading(false);
      alert(uploadError.message);
      return;
    }

    /* 2️⃣ Insert DB row */
    const { error: dbError } = await supabase.from("reports").insert({
      user_id: user.id,
      report_type: reportType,
      file_path: fileName,
      age: age ? Number(age) : null,
      gender: gender || null,
      symptoms: symptoms || null,
    });

    setLoading(false);

    if (dbError) {
      alert(dbError.message);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Upload Medical Report
            </h1>
            <p className="text-muted-foreground mt-2">
              Select your report type and upload the file for analysis
            </p>
          </div>

          {/* UPLOAD CARD */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Upload Medical Report</h2>

            <label
              htmlFor="reportFile"
              className="cursor-pointer border-2 border-dashed rounded-xl p-10 text-center hover:border-primary transition block"
            >
              <UploadIcon className="mx-auto mb-3 w-10 h-10 text-muted-foreground" />

              {file ? (
                <p className="font-medium text-foreground">{file.name}</p>
              ) : (
                <>
                  <p className="font-medium">Drag and drop your file here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                </>
              )}

              <input
                id="reportFile"
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <div className="mt-4 text-sm flex justify-center gap-6 text-muted-foreground">
              <span>📄 PDF Reports</span>
              <span>🩻 X-ray Images</span>
              <span>❤️ ECG Reports</span>
            </div>
          </div>

          {/* DETAILS */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold">Report Details</h2>

            <div>
              <label className="block text-sm font-medium mb-1">
                Report Category *
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background"
              >
                <option value="">Select category</option>
                <option value="Blood Test">Blood Test</option>
                <option value="X-Ray">X-Ray</option>
                <option value="ECG">ECG</option>
                <option value="Ultrasound">Ultrasound</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Patient Age (optional)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background"
                  placeholder="e.g. 45"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender (optional)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Symptoms (optional)
              </label>
              <textarea
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2 bg-background"
                placeholder="Describe any symptoms or relevant medical history..."
              />
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="bg-muted border border-border rounded-xl p-4 text-sm">
            ⚠️ This output is generated by an AI-assisted system and should not be
            considered a medical diagnosis. Always consult a qualified
            healthcare professional.
          </div>

          {/* BUTTON */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium text-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Report"}
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Upload;
