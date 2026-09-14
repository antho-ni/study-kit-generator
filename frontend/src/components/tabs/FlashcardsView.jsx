// frontend/src/components/tabs/FlashcardsView.jsx
import { useState } from "react";

export default function FlashcardsView({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards?.length) return <p>No flashcards generated.</p>;
  const card = cards[index];

  const next = () => { setFlipped(false); setIndex((i) => (i + 1) % cards.length); };
  const prev = () => { setFlipped(false); setIndex((i) => (i - 1 + cards.length) % cards.length); };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => setFlipped((f) => !f)}
        className="w-full h-56 flex items-center justify-center border rounded-xl p-6 cursor-pointer text-center bg-white shadow-sm"
      >
        <p className="text-lg">{flipped ? card.back : card.front}</p>
      </div>
      <p className="text-xs text-gray-400 mt-2">Click card to flip</p>
      <div className="flex gap-4 mt-4">
        <button onClick={prev} className="px-3 py-1 border rounded-lg">Prev</button>
        <span className="text-sm text-gray-500">{index + 1} / {cards.length}</span>
        <button onClick={next} className="px-3 py-1 border rounded-lg">Next</button>
      </div>
    </div>
  );
}