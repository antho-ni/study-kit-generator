import { useState } from "react";
import UploadZone from "./UploadZone";
import NotesView from "./tabs/NotesView";
import FlashcardsView from "./tabs/FlashcardsView";
import QuizView from "./tabs/QuizView";
import { generateStudyKit } from "./api/client";

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
    <div className="pb-16">
      <UploadZone onFileSelected={handleFile} isLoading={isLoading} />

      {error && (
        <div className="max-w-3xl mx-auto px-6 mt-4">
          <div className="bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
            <p className="text-danger text-sm">{error}</p>
          </div>
        </div>
      )}

      {studyKit && (
        <div className="max-w-3xl mx-auto px-6 mt-8">
          <div className="flex gap-2 mb-4">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
  px-4 py-2 rounded-full text-sm font-medium transition-colors
  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  ${isActive
    ? "bg-primary text-white"
    : "bg-surface text-text-muted border border-border hover:text-text"}
`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
            {activeTab === "Notes" && <NotesView notes={studyKit.notes} />}
            {activeTab === "Flashcards" && <FlashcardsView cards={studyKit.flashcards} />}
            {activeTab === "Quiz" && <QuizView questions={studyKit.quiz} />}
          </div>
        </div>
      )}
    </div>
  );
}