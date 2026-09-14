# backend/app/services/ai_generator.py
from google import genai
from app.models.schemas import StudyKit
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_study_kit(content: str, num_flashcards: int = 10, num_quiz: int = 8) -> StudyKit:
    prompt = f"""Analyze the following document content and generate study materials.

Requirements:
- Notes: structured markdown summary covering the key concepts, organized with headers
- Flashcards: {num_flashcards} cards testing recall of key facts/terms/concepts
- Quiz: {num_quiz} multiple-choice questions (4 options each) testing understanding, not just recall
- correct_index must be the 0-based index into the options array

Document content:
{content}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": StudyKit.model_json_schema(),
        },
    )

    return StudyKit.model_validate_json(response.text)