import { Upload, FileText, Image, Heart } from "lucide-react";
import { useState, useRef } from "react";

const UploadCard = ({ onFileSelect, selectedFile, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const acceptedTypes = [
    { icon: FileText, label: "PDF Reports" },
    { icon: Image, label: "X-ray Images" },
    { icon: Heart, label: "ECG Reports" },
  ];

  return (
    <div className="medical-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Upload Medical Report</h3>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        
        {selectedFile ? (
          <div>
            <p className="text-foreground font-medium">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <p className="text-foreground font-medium">
              Drag and drop your file here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Accepted file types:</p>
        <div className="flex flex-wrap gap-3">
          {acceptedTypes.map((type, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <type.icon className="h-4 w-4" />
              <span>{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      {isAnalyzing && (
        <div className="mt-4">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse w-2/3" />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Analyzing report, please wait...
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
