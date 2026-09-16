import { useState } from "react";

export default function FlashcardsView({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards?.length) return <p className="text-text-muted">No flashcards generated.</p>;
  const card = cards[index];

  const next = () => { setFlipped(false); setIndex((i) => (i + 1) % cards.length); };
  const prev = () => { setFlipped(false); setIndex((i) => (i - 1 + cards.length) % cards.length); };

  return (
    <div className="flex flex-col items-center py-2">
      <div
        onClick={() => setFlipped((f) => !f)}
        className={`
          w-full max-w-md h-52 rounded-2xl cursor-pointer
          flex items-center justify-center p-8 text-center transition-colors
          ${flipped ? "bg-primary/5 border border-primary/20" : "bg-bg border border-border"}
        `}
      >
        <p className={`text-lg ${flipped ? "text-primary font-medium" : "text-text font-semibold"}`}>
          {flipped ? card.back : card.front}
        </p>
      </div>
      <p className="text-xs text-text-muted mt-3">Click card to flip</p>
      <div className="flex items-center gap-5 mt-5 text-sm">
        <button onClick={prev} className="text-primary font-medium hover:text-primary-hover">← Prev</button>
        <span className="text-text-muted">{index + 1} / {cards.length}</span>
        <button onClick={next} className="text-primary font-medium hover:text-primary-hover">Next →</button>
      </div>
    </div>
  );
}