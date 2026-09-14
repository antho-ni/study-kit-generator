// frontend/src/api/client.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function generateStudyKit(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || "Generation failed");
  }

  return res.json(); // { notes, flashcards, quiz }
}