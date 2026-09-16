# Study Kit Generator

Study Kit Generator turns study documents into AI-generated notes, flashcards, and quizzes. The project has a React/Vite frontend and a FastAPI backend powered by Groq.

## Features

- Upload PDF, DOCX, PPTX, or TXT study material
- Extract text from documents, including DOCX tables and PPTX slide text
- Generate structured notes, flashcards, and multiple-choice quizzes
- Enforce a 15 MB upload limit

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer
- A Groq API key

## Setup

### Backend

From the repository root:

```powershell
cd backend
..\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` with your API key:

```env
GROQ_API_KEY=your_groq_api_key
```

Start the API:

```powershell
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000` by default.

### Frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The frontend uses `http://localhost:8000` by default. To use another API URL, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## API

### `GET /`

Returns the backend health status:

```json
{"status":"ok"}
```

### `POST /api/generate`

Accepts a multipart form upload with a field named `file`. The response contains `notes`, `flashcards`, and `quiz`.

## Development commands

Frontend commands are run from `frontend/`:

```powershell
npm run build
npm run lint
```

## Project structure

```text
backend/       FastAPI API, document extraction, and AI generation
frontend/      React/Vite client
frontend-old/ Previous frontend implementation kept for reference
```
