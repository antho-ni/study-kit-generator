# backend/test_gemini.py
from app.services.ai_generator import generate_study_kit

sample_text = """
Photosynthesis is the process by which green plants and some other organisms
use sunlight to synthesize foods from carbon dioxide and water. Photosynthesis
in plants generally involves the green pigment chlorophyll and generates oxygen
as a byproduct. It occurs in two stages: the light-dependent reactions, which
take place in the thylakoid membranes, and the light-independent reactions
(Calvin cycle), which take place in the stroma of the chloroplast.
"""

result = generate_study_kit(sample_text, num_flashcards=3, num_quiz=2)

print("NOTES:\n", result.notes)
print("\nFLASHCARDS:")
for card in result.flashcards:
    print(f"  Q: {card.front}\n  A: {card.back}\n")

print("QUIZ:")
for q in result.quiz:
    print(f"  {q.question}")
    print(f"  Options: {q.options}")
    print(f"  Correct index: {q.correct_index}\n")