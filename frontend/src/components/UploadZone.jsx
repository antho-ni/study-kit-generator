import { useState, useCallback, useEffect } from "react";

const ACCEPTED_TYPES = [".pdf", ".docx", ".pptx", ".txt"];

export default function UploadZone({ onFileSelected, isLoading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const validateAndSelect = (file) => {
    if (!file) return;
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setError(`Unsupported file type: ${ext}. Use PDF, DOCX, PPTX, or TXT.`);
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("File too large (max 15MB).");
      return;
    }
    setError(null);
    onFileSelected(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSelect(e.dataTransfer.files[0]);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div
  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
  onDragLeave={() => setIsDragging(false)}
  onDrop={handleDrop}
  className={`
    rounded-2xl border-2 border-dashed p-12 text-center transition-all
    ${isDragging ? "border-primary bg-primary/5" : "border-border bg-surface"}
    ${isLoading ? "opacity-50 pointer-events-none" : ""}
  `}
>
        <input
          type="file"
          id="file-input"
          className="hidden"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={(e) => validateAndSelect(e.target.files[0])}
        />
        
        <label htmlFor="file-input" className="cursor-pointer">
  {isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <p className="text-base font-medium text-text">
        Drop a document here, or click to browse
      </p>
      <p className="text-sm text-text-muted mt-1">
        PDF, DOCX, PPTX, or TXT — max 15MB
      </p>
    </>
  )}
  
</label>
      </div>
      {error && <p className="text-danger text-sm mt-3">{error}</p>}
    </div>
    
  );
}



function LoadingIndicator() {
  const [stage, setStage] = useState(0);
  const stages = ["Reading your document…", "Analyzing content…", "Generating your study kit…"];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((s) => Math.min(s + 1, stages.length - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-base font-medium text-text">{stages[stage]}</p>
      <p className="text-sm text-text-muted mt-1">This can take up to 30 seconds</p>
    </div>
  );
}