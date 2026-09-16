import { useState, useMemo } from "react";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizView({ questions }) {
  const [order, setOrder] = useState(() => questions.map((_, i) => i));
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const shuffledQuestions = useMemo(() => order.map((i) => questions[i]), [order, questions]);

  if (!questions?.length) return <p className="text-text-muted">No quiz generated.</p>;

  const score = shuffledQuestions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct_index ? 1 : 0), 0
  );

  const allAnswered = shuffledQuestions.every((_, i) => answers[i] !== undefined);

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const shuffle = () => {
    setOrder(shuffleArray(questions.map((_, i) => i)));
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-7">
      <div className="flex justify-end">
        <button
          onClick={shuffle}
          className="text-xs font-medium text-text-muted hover:text-primary flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M4 4l5 5" />
          </svg>
          Shuffle questions
        </button>
      </div>

      {shuffledQuestions.map((q, i) => (
        <div key={i}>
          <p className="font-medium text-text mb-3">{i + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[i] === oi;
              const isCorrect = submitted && oi === q.correct_index;
              const isWrong = submitted && isSelected && oi !== q.correct_index;
              return (
                <label
                  key={oi}
                  className={`
  flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors
  focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
  ${isCorrect ? "bg-success/10 border-success/30" : ""}
  ${isWrong ? "bg-danger/10 border-danger/30" : ""}
  ${!submitted && isSelected ? "border-primary bg-primary/5" : ""}
  ${!submitted && !isSelected ? "border-border hover:bg-bg" : ""}
`}
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    disabled={submitted}
                    checked={isSelected || false}
                    onChange={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                    className="accent-primary"
                  />
                  <span className={
                    isCorrect ? "text-success font-medium" :
                    isWrong ? "text-danger" : "text-text"
                  }>
                    {opt}
                  </span>
                </label>
              );
            })}
          </div>
          {submitted && (
            <p className="text-xs text-text-muted mt-2">{q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"        >
          Submit Quiz
        </button>
      ) : (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <p className="font-semibold text-primary">Score: {score} / {shuffledQuestions.length}</p>
          <button
            onClick={retry}
className="text-sm font-medium text-primary hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}