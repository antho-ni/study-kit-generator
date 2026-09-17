# backend/app/routers/generate.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.extraction import extract_text, ExtractionError
from app.services.chunking import needs_chunking, chunk_text
from app.services.ai_generator import generate_study_kit, summarize_chunk
from app.models.schemas import StudyKit

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

MAX_FILE_SIZE = 15 * 1024 * 1024  # 15MB

def _friendly_ai_error(e: Exception) -> str:
    msg = str(e)
    if "503" in msg or "UNAVAILABLE" in msg or "overloaded" in msg.lower():
        return "The AI service is busy right now. Please try again in a minute."
    if "429" in msg or "rate limit" in msg.lower():
        return "Too many requests right now — please wait a moment and try again."
    if "404" in msg or "model_not_found" in msg.lower():
        return "There's a configuration issue on our end. Please let your instructor or the app owner know."
    return "Something went wrong while generating your study kit. Please try again."

@router.post("/api/generate", response_model=StudyKit)
@limiter.limit("5/minute")
async def generate(request: Request, file: UploadFile = File(...)):
    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(413, "This file is too large. Please upload something under 15MB.")

    try:
        text = extract_text(file.filename, file_bytes)
    except ExtractionError as e:
        msg = str(e)
        if "scanned" in msg.lower() or "image-based" in msg.lower():
            raise HTTPException(422, "This PDF appears to be a scanned image rather than text. Try a text-based PDF, or a DOCX/TXT file instead.")
        if "doesn't match" in msg.lower():
            raise HTTPException(422, "This file doesn't look like a valid document of that type. Please check the file and try again.")
        raise HTTPException(422, "We couldn't read this file. Please check it's a valid PDF, DOCX, PPTX, or TXT file.")

    if not text.strip():
        raise HTTPException(422, "This document appears to be empty. Please upload a file with readable text.")

    try:
        if needs_chunking(text):
            chunks = chunk_text(text)
            condensed = []
            for i, chunk in enumerate(chunks, start=1):
                summary = summarize_chunk(chunk, i, len(chunks))
                condensed.append(summary)
            text = "\n\n".join(condensed)

        study_kit = generate_study_kit(text)
    except Exception as e:
        raise HTTPException(500, _friendly_ai_error(e))

    return study_kit