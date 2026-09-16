import StudyKitContainer from './components/StudyKitContainer';

function App() {
  return (
    <div className="min-h-screen">
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-4">
        <h1 className="text-2xl font-semibold text-text">Study Kit</h1>
        <p className="text-sm text-text-muted mt-1">Turn any document into notes, flashcards, and a quiz.</p>
      </header>
      <StudyKitContainer />
    </div>
  );
}

export default App;