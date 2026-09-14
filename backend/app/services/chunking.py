# backend/app/services/chunking.py

MAX_CHARS_SINGLE_PASS = 60_000  # ~15k tokens, safe margin for most models

def needs_chunking(text: str) -> bool:
    return len(text) > MAX_CHARS_SINGLE_PASS

def chunk_text(text: str, chunk_size: int = 50_000, overlap: int = 500) -> list[str]:
    """Split on paragraph boundaries where possible to avoid mid-sentence cuts."""
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        if end < len(text):
            # try to break at a paragraph boundary near the end
            boundary = text.rfind("\n\n", start, end)
            if boundary > start:
                end = boundary
        chunks.append(text[start:end])
        start = end - overlap  # small overlap for context continuity
    return chunks