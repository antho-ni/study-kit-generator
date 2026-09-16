export default function NotesView({ notes }) {
  if (!notes) return <p className="text-text-muted">No notes generated.</p>;

  return (
    <div className="text-[15px] leading-7 text-text">
      {notes.split("\n").map((line, i) => {
        if (line.startsWith("## ")) {
          return <h3 key={i} className="text-base font-semibold mt-5 mb-1 text-text">{line.replace("## ", "")}</h3>;
        }
        if (line.startsWith("# ")) {
          return <h2 key={i} className="text-lg font-semibold mb-2 text-text">{line.replace("# ", "")}</h2>;
        }
        if (line.trim() === "") return null;
        return <p key={i} className="mb-1 text-text-muted">{line.replace(/\*\*/g, "")}</p>;
      })}
    </div>
  );
}