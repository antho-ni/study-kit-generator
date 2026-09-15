# backend/app/services/ai_generator.py
import time
from groq import Groq, APIStatusError
from app.models.schemas import StudyKit
from app.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 5

def _enforce_strict_schema(schema: dict) -> dict:
    """Recursively add additionalProperties: false to every object
    in the schema, including nested definitions — required by
    Groq/OpenAI-style strict JSON schema mode."""
    if schema.get("type") == "object":
        schema["additionalProperties"] = False
        if "properties" in schema:
            for prop_schema in schema["properties"].values():
                _enforce_strict_schema(prop_schema)

    if schema.get("type") == "array" and "items" in schema:
        _enforce_strict_schema(schema["items"])

    if "$defs" in schema:
        for def_schema in schema["$defs"].values():
            _enforce_strict_schema(def_schema)

    return schema

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

    schema = _enforce_strict_schema(StudyKit.model_json_schema())

    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[{"role": "user", "content": prompt}],
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "study_kit",
                        "schema": schema,
                        "strict": True,
                    },
                },
            )
            raw_json = response.choices[0].message.content
            return StudyKit.model_validate_json(raw_json)

        except APIStatusError as e:
            last_error = e
            if e.status_code in (503, 429) and attempt < MAX_RETRIES:
                wait_time = RETRY_DELAY_SECONDS * attempt
                print(f"Groq overloaded (attempt {attempt}/{MAX_RETRIES}), retrying in {wait_time}s...")
                time.sleep(wait_time)
                continue
            raise

    raise last_error