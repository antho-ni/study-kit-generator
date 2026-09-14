// frontend/src/components/tabs/QuizView.jsx
import { useState } from "react";

export default function QuizView({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!questions?.length) return <p>No quiz generated.</p>;

  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct_index ? 1 : 0), 0
  );

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="border rounded-lg p-4">
          <p className="font-medium mb-2">{i + 1}. {q.question}</p>
          <div className="space-y-1">
            {q.options.map((opt, oi) => {
              const isSelected = answers[i] === oi;
              const isCorrect = submitted && oi === q.correct_index;
              const isWrong = submitted && isSelected && oi !== q.correct_index;
              return (
                <label
                  key={oi}
                  className={`block px-3 py-2 rounded-lg border cursor-pointer text-sm
                    ${isCorrect ? "bg-green-50 border-green-400" : ""}
                    ${isWrong ? "bg-red-50 border-red-400" : ""}
                    ${isSelected && !submitted ? "border-blue-400" : ""}
                  `}
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    className="mr-2"
                    disabled={submitted}
                    checked={isSelected || false}
                    onChange={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
          {submitted && (
            <p className="text-xs text-gray-500 mt-2 italic">{q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Submit Quiz
        </button>
      ) : (
        <p className="font-semibold">Score: {score} / {questions.length}</p>
      )}
    </div>
  );
}