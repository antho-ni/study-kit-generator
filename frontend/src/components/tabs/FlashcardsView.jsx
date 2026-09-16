import { useState, useEffect, useCallback, useMemo } from "react";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const DIFFICULTY_STYLES = {
  easy: "bg-success/10 text-success",
  medium: "bg-primary/10 text-primary",
  hard: "bg-danger/10 text-danger",
};

export default function FlashcardsView({ cards }) {
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filteredIndices = useMemo(() => {
    return order.filter((i) => difficultyFilter === "all" || cards[i].difficulty === difficultyFilter);
  }, [order, difficultyFilter, cards]);

  const shuffledCards = useMemo(() => filteredIndices.map((i) => cards[i]), [filteredIndices, cards]);

  const next = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i + 1) % shuffledCards.length);
  }, [shuffledCards.length]);

  const prev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (i - 1 + shuffledCards.length) % shuffledCards.length);
  }, [shuffledCards.length]);

  const goTo = (i) => { setFlipped(false); setIndex(i); };

  const shuffle = () => {
    setOrder(shuffleArray(cards.map((_, i) => i)));
    setIndex(0);
    setFlipped(false);
  };

  const setFilter = (f) => {
    setDifficultyFilter(f);
    setIndex(0);
    setFlipped(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.code === "ArrowRight") {
        next();
      } else if (e.code === "ArrowLeft") {
        prev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  if (!cards?.length) return <p className="text-text-muted">No flashcards generated.</p>;

  if (shuffledCards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted mb-3">No {difficultyFilter} cards in this set.</p>
        <button onClick={() => setFilter("all")} className="text-primary text-sm font-medium">Show all cards</button>
      </div>
    );
  }

  const card = shuffledCards[index];

  return (
    <div className="flex flex-col items-center py-2">
      <div className="w-full max-w-md flex items-center justify-between mb-3">
        <div className="flex gap-1.5">
          {["all", "easy", "medium", "hard"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                text-xs font-medium px-2.5 py-1 rounded-full capitalize transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${difficultyFilter === f ? "bg-primary text-white" : "bg-bg text-text-muted hover:text-text"}
              `}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={shuffle}
          className="text-xs font-medium text-text-muted hover:text-primary flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M4 4l5 5" />
          </svg>
          Shuffle
        </button>
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        tabIndex={0}
        className={`
          w-full max-w-md h-52 rounded-2xl cursor-pointer relative
          flex items-center justify-center p-8 text-center transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${flipped ? "bg-primary/5 border border-primary/20" : "bg-bg border border-border"}
        `}
      >
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_STYLES[card.difficulty]}`}>
            {card.difficulty}
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-border/60 text-text-muted">
            {card.topic}
          </span>
        </div>
        <p className={`text-lg ${flipped ? "text-primary font-medium" : "text-text font-semibold"}`}>
          {flipped ? card.back : card.front}
        </p>
      </div>
      <p className="text-xs text-text-muted mt-3">
        Click, or press <span className="font-medium">space</span> to flip · <span className="font-medium">← →</span> to navigate
      </p>

      <div className="flex items-center gap-1.5 mt-4 flex-wrap justify-center max-w-md">
        {shuffledCards.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to card ${i + 1}`}
            className={`
              w-2 h-2 rounded-full transition-colors
              ${i === index ? "bg-primary w-4" : "bg-border hover:bg-primary/40"}
            `}
          />
        ))}
      </div>

      <div className="flex items-center gap-5 mt-4 text-sm">
        <button onClick={prev} className="text-primary font-medium hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">← Prev</button>
        <span className="text-text-muted">{index + 1} / {shuffledCards.length}</span>
        <button onClick={next} className="text-primary font-medium hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Next →</button>
      </div>
    </div>
  );
}