import { useState, useEffect } from "react";
import UploadZone from "./UploadZone";
import NotesView from "./tabs/NotesView";
import FlashcardsView from "./tabs/FlashcardsView";
import QuizView from "./tabs/QuizView";
import { generateStudyKit } from "./api/client";
import { getHistory, saveToHistory, deleteFromHistory, formatRelativeTime } from "../utils/history";

const TABS = ["Notes", "Flashcards", "Quiz"];

export default function StudyKitContainer() {
  const [studyKit, setStudyKit] = useState(null);
  const [currentFilename, setCurrentFilename] = useState(null);
  const [activeTab, setActiveTab] = useState("Notes");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleFile = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateStudyKit(file);
      setStudyKit(result);
      setCurrentFilename(file.name);
      setActiveTab("Notes");
      saveToHistory(file.name, result);
      setHistory(getHistory());
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (entry) => {
    setStudyKit(entry.studyKit);
    setCurrentFilename(entry.filename);
    setActiveTab("Notes");
    setError(null);
  };

  const removeFromHistory = (id, e) => {
    e.stopPropagation();
    deleteFromHistory(id);
    setHistory(getHistory());
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

      {history.length > 0 && !studyKit && (
        <div className="max-w-3xl mx-auto px-6 mt-8">
          <h2 className="text-sm font-medium text-text-muted mb-3">Recent study kits</h2>
          <div className="space-y-2">
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => loadFromHistory(entry)}
                className="w-full flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3 text-left hover:border-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <div>
                  <p className="text-sm font-medium text-text truncate max-w-xs">{entry.filename}</p>
                  <p className="text-xs text-text-muted">{formatRelativeTime(entry.timestamp)}</p>
                </div>
                <span
                  onClick={(e) => removeFromHistory(entry.id, e)}
                  className="text-text-muted hover:text-danger text-xs px-2 py-1"
                >
                  Remove
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {studyKit && (
        <div className="max-w-3xl mx-auto px-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
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
            <button
              onClick={() => { setStudyKit(null); setCurrentFilename(null); }}
              className="text-sm text-text-muted hover:text-primary"
            >
              ← Back to library
            </button>
          </div>

          {currentFilename && (
            <p className="text-xs text-text-muted mb-3">{currentFilename}</p>
          )}

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