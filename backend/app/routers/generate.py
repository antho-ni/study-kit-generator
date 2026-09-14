# backend/app/routers/generate.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.extraction import extract_text, ExtractionError
from app.services.chunking import needs_chunking, chunk_text
from app.services.ai_generator import generate_study_kit
from app.models.schemas import StudyKit

router = APIRouter()

MAX_FILE_SIZE = 15 * 1024 * 1024  # 15MB

@router.post("/api/generate", response_model=StudyKit)
async def generate(file: UploadFile = File(...)):
    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large (max 15MB)")

    try:
        text = extract_text(file.filename, file_bytes)
    except ExtractionError as e:
        raise HTTPException(422, str(e))

    if not text.strip():
        raise HTTPException(422, "No readable text found in document")

    if needs_chunking(text):
        # Map step: condense each chunk, then generate from combined condensed text
        chunks = chunk_text(text)
        condensed = []
        for chunk in chunks:
            # lightweight condensing call per chunk (implement summarize_chunk similarly)
            condensed.append(chunk[:2000])  # placeholder — replace with real summarization call
        text = "\n\n".join(condensed)

    try:
        study_kit = generate_study_kit(text)
    except Exception as e:
        raise HTTPException(500, f"AI generation failed: {str(e)}")

    return study_kit