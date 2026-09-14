# backend/app/models/schemas.py
from pydantic import BaseModel, Field
from typing import List

class QuizQuestion(BaseModel):
    question: str
    options: List[str] = Field(min_length=2, max_length=4)
    correct_index: int
    explanation: str

class Flashcard(BaseModel):
    front: str
    back: str

class StudyKit(BaseModel):
    notes: str  # markdown-formatted summary
    flashcards: List[Flashcard]
    quiz: List[QuizQuestion]