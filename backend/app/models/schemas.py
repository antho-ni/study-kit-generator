# backend/app/models/schemas.py
from pydantic import BaseModel, Field
from typing import List, Literal

class QuizQuestion(BaseModel):
    question: str
    options: List[str] = Field(min_length=2, max_length=4)
    correct_index: int
    explanation: str
    difficulty: Literal["easy", "medium", "hard"]
    topic: str

class Flashcard(BaseModel):
    front: str
    back: str
    difficulty: Literal["easy", "medium", "hard"]
    topic: str

class StudyKit(BaseModel):
    notes: str
    flashcards: List[Flashcard]
    quiz: List[QuizQuestion]