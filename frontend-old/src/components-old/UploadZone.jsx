// frontend/src/components/UploadZone.jsx
import { useState, useCallback } from "react";

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
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center transition-colors
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
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
        <p className="text-lg font-medium text-gray-700">
          {isLoading ? "Generating your study kit..." : "Drop a document here, or click to browse"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supports PDF, DOCX, PPTX, TXT — max 15MB
        </p>
      </label>
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </div>
  );
}