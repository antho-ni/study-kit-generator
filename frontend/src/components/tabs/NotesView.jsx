export default function NotesView({ notes }) {
  if (!notes) return <p>No notes generated.</p>;

  return (
    <div className="prose max-w-none whitespace-pre-wrap">
      {notes}
    </div>
  );
}