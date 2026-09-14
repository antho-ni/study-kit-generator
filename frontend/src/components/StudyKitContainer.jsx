// frontend/src/components/StudyKitContainer.jsx
import { useState } from "react";
import UploadZone from "./UploadZone";
import NotesView from "./tabs/NotesView";
import FlashcardsView from "./tabs/FlashcardsView";
import QuizView from "./tabs/QuizView";
import { generateStudyKit } from "../api/client";

const TABS = ["Notes", "Flashcards", "Quiz"];

export default function StudyKitContainer() {
  const [studyKit, setStudyKit] = useState(null);
  const [activeTab, setActiveTab] = useState("Notes");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateStudyKit(file);
      setStudyKit(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <UploadZone onFileSelected={handleFile} isLoading={isLoading} />

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {studyKit && (
        <div className="mt-8">
          <div className="flex gap-2 border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === "Notes" && <NotesView notes={studyKit.notes} />}
            {activeTab === "Flashcards" && <FlashcardsView cards={studyKit.flashcards} />}
            {activeTab === "Quiz" && <QuizView questions={studyKit.quiz} />}
          </div>
        </div>
      )}
    </div>
  );
}