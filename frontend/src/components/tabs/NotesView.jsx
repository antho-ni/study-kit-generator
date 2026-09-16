// frontend/src/components/tabs/NotesView.jsx
import ReactMarkdown from "react-markdown";

export default function NotesView({ notes }) {
  if (!notes) return <p className="text-text-muted">No notes generated.</p>;

  return (
    <div className="text-[15px] leading-7 text-text">
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => <h2 className="text-lg font-semibold mb-2 text-text" {...props} />,
          h2: ({ ...props }) => <h3 className="text-base font-semibold mt-5 mb-1 text-text" {...props} />,
          h3: ({ ...props }) => <h4 className="text-sm font-semibold mt-4 mb-1 text-text" {...props} />,
          p: ({ ...props }) => <p className="mb-2 text-text-muted" {...props} />,
          strong: ({ ...props }) => <strong className="font-semibold text-text" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-text-muted" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-text-muted" {...props} />,
          li: ({ ...props }) => <li {...props} />,
          table: ({ ...props }) => (
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse" {...props} />
            </div>
          ),
          thead: ({ ...props }) => <thead className="bg-bg" {...props} />,
          th: ({ ...props }) => <th className="border border-border px-3 py-2 text-left font-medium text-text" {...props} />,
          td: ({ ...props }) => <td className="border border-border px-3 py-2 text-text-muted" {...props} />,
        }}
      >
        {notes}
      </ReactMarkdown>
    </div>
  );
}