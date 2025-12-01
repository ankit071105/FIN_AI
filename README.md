# FinAI Lite

A multi-agent AI dashboard that helps traders filter noise from financial news.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend**: Python (FastAPI)
- **AI**: LangGraph, LangChain
- **Database**: SQLite, ChromaDB

## Setup & Run

### Backend

1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```
2. Create virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Features

- **Live Intelligence Feed**: Real-time financial news updates.
- **Impact Analysis**: AI-driven sentiment scoring and market impact labeling.
- **RAG Chat**: Ask questions about the market and get answers based on recent news.
- **Impact Velocity**: Visual trend of market sentiment.
