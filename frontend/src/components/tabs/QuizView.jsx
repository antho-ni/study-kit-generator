import { useState } from "react";

export default function QuizView({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!questions?.length) return <p className="text-text-muted">No quiz generated.</p>;

  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct_index ? 1 : 0), 0
  );

  return (
    <div className="space-y-7">
      {questions.map((q, i) => (
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
          className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary-hover"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
          <p className="font-semibold text-primary">Score: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
}